#![cfg(test)]

use soroban_sdk::{testutils::Address as _, Address, Env, Symbol};

use crate::{errors::ContractError, TrustLeafRbac, TrustLeafRbacClient};

// ─── Setup helpers ────────────────────────────────────────────────────────────

fn setup() -> (Env, TrustLeafRbacClient<'static>, Address) {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(TrustLeafRbac, ());
    let client = TrustLeafRbacClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.initialize(&admin).unwrap();

    (env, client, admin)
}

// ─── Initialization ────────────────────────────────────────────────────────────

#[test]
fn test_initialize_sets_admin() {
    let (_, client, admin) = setup();
    assert_eq!(client.get_admin().unwrap(), admin);
}

#[test]
fn test_initialize_bootstraps_admin_role() {
    let (env, client, admin) = setup();
    assert!(client.has_role(&admin, &Symbol::new(&env, "ADMIN")));
}

#[test]
fn test_initialize_marks_initialized() {
    let (_, client, _) = setup();
    assert!(client.is_initialized());
}

#[test]
fn test_double_initialize_fails() {
    let (_, client, admin) = setup();
    let err = client.try_initialize(&admin).unwrap_err().unwrap();
    assert_eq!(err, ContractError::AlreadyInitialized);
}

// ─── grant_role ───────────────────────────────────────────────────────────────

#[test]
fn test_admin_can_grant_role() {
    let (env, client, admin) = setup();
    let doctor = Address::generate(&env);
    client.grant_role(&admin, &doctor, &Symbol::new(&env, "DOCTOR")).unwrap();
    assert!(client.has_role(&doctor, &Symbol::new(&env, "DOCTOR")));
}

#[test]
fn test_non_admin_cannot_grant_role() {
    let (env, client, _) = setup();
    let rando = Address::generate(&env);
    let target = Address::generate(&env);
    // OZ panics / errors on unauthorized grant
    let result = client.try_grant_role(&rando, &target, &Symbol::new(&env, "DOCTOR"));
    assert!(result.is_err());
}

#[test]
fn test_multiple_roles_same_account() {
    let (env, client, admin) = setup();
    let multi = Address::generate(&env);
    client.grant_role(&admin, &multi, &Symbol::new(&env, "DOCTOR")).unwrap();
    client.grant_role(&admin, &multi, &Symbol::new(&env, "LAB")).unwrap();
    assert!(client.has_role(&multi, &Symbol::new(&env, "DOCTOR")));
    assert!(client.has_role(&multi, &Symbol::new(&env, "LAB")));
    assert!(!client.has_role(&multi, &Symbol::new(&env, "GROWER")));
}

// ─── revoke_role ──────────────────────────────────────────────────────────────

#[test]
fn test_admin_can_revoke_role() {
    let (env, client, admin) = setup();
    let lab = Address::generate(&env);
    client.grant_role(&admin, &lab, &Symbol::new(&env, "LAB")).unwrap();
    client.revoke_role(&admin, &lab, &Symbol::new(&env, "LAB")).unwrap();
    assert!(!client.has_role(&lab, &Symbol::new(&env, "LAB")));
}

#[test]
fn test_non_admin_cannot_revoke_role() {
    let (env, client, admin) = setup();
    let dispensary = Address::generate(&env);
    let attacker = Address::generate(&env);
    client.grant_role(&admin, &dispensary, &Symbol::new(&env, "DISPENSARY")).unwrap();
    let result = client.try_revoke_role(&attacker, &dispensary, &Symbol::new(&env, "DISPENSARY"));
    assert!(result.is_err());
    // Role must still be held
    assert!(client.has_role(&dispensary, &Symbol::new(&env, "DISPENSARY")));
}

// ─── renounce_role ────────────────────────────────────────────────────────────

#[test]
fn test_account_can_renounce_own_role() {
    let (env, client, admin) = setup();
    let grower = Address::generate(&env);
    client.grant_role(&admin, &grower, &Symbol::new(&env, "GROWER")).unwrap();
    client.renounce_role(&Symbol::new(&env, "GROWER"), &grower).unwrap();
    assert!(!client.has_role(&grower, &Symbol::new(&env, "GROWER")));
}

// ─── has_role on unknown ──────────────────────────────────────────────────────

#[test]
fn test_has_role_false_for_unknown_account() {
    let (env, client, _) = setup();
    let stranger = Address::generate(&env);
    assert!(!client.has_role(&stranger, &Symbol::new(&env, "DOCTOR")));
}

// ─── get_role_member_count ────────────────────────────────────────────────────

#[test]
fn test_role_member_count_increments() {
    let (env, client, admin) = setup();
    assert_eq!(client.get_role_member_count(&Symbol::new(&env, "DOCTOR")), 0u32);

    let d1 = Address::generate(&env);
    let d2 = Address::generate(&env);
    client.grant_role(&admin, &d1, &Symbol::new(&env, "DOCTOR")).unwrap();
    client.grant_role(&admin, &d2, &Symbol::new(&env, "DOCTOR")).unwrap();

    assert_eq!(client.get_role_member_count(&Symbol::new(&env, "DOCTOR")), 2u32);
}

// ─── two-step admin transfer ──────────────────────────────────────────────────

#[test]
fn test_two_step_admin_transfer() {
    let (env, client, _admin) = setup();
    let new_admin = Address::generate(&env);
    // live_until_ledger = current + 1000
    let live_until = env.ledger().sequence() + 1000;

    client.transfer_admin(&new_admin, &live_until).unwrap();

    // New admin accepts
    client.accept_admin_transfer().unwrap();

    assert_eq!(client.get_admin().unwrap(), new_admin);
}
