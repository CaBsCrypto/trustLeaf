#![cfg(test)]

use soroban_sdk::{testutils::Address as _, Address, Env, Symbol};

use crate::{errors::ContractError, TrustLeafRbac, TrustLeafRbacClient};

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
    let (_env, client, admin) = setup();
    assert_eq!(client.get_admin().unwrap(), admin);
}

#[test]
fn test_initialize_grants_admin_role() {
    let (_env, client, admin) = setup();
    assert!(client.has_role(&admin, &Symbol::new(&_env, "ADMIN")));
}

#[test]
fn test_initialize_marks_contract_initialized() {
    let (_env, client, _admin) = setup();
    assert!(client.is_initialized());
}

#[test]
fn test_double_initialize_fails() {
    let (_env, client, admin) = setup();
    let err = client.try_initialize(&admin).unwrap_err().unwrap();
    assert_eq!(err, ContractError::AlreadyInitialized);
}

// ─── Grant Role ────────────────────────────────────────────────────────────────

#[test]
fn test_admin_can_grant_role() {
    let (env, client, admin) = setup();
    let doctor = Address::generate(&env);
    client
        .grant_role(&admin, &doctor, &Symbol::new(&env, "DOCTOR"))
        .unwrap();
    assert!(client.has_role(&doctor, &Symbol::new(&env, "DOCTOR")));
}

#[test]
fn test_non_admin_cannot_grant_role() {
    let (env, client, _admin) = setup();
    let rando = Address::generate(&env);
    let target = Address::generate(&env);
    let err = client
        .try_grant_role(&rando, &target, &Symbol::new(&env, "DOCTOR"))
        .unwrap_err()
        .unwrap();
    assert_eq!(err, ContractError::Unauthorized);
}

#[test]
fn test_grant_already_granted_role_fails() {
    let (env, client, admin) = setup();
    let doctor = Address::generate(&env);
    client
        .grant_role(&admin, &doctor, &Symbol::new(&env, "DOCTOR"))
        .unwrap();
    let err = client
        .try_grant_role(&admin, &doctor, &Symbol::new(&env, "DOCTOR"))
        .unwrap_err()
        .unwrap();
    assert_eq!(err, ContractError::RoleAlreadyGranted);
}

// ─── Revoke Role ───────────────────────────────────────────────────────────────

#[test]
fn test_admin_can_revoke_role() {
    let (env, client, admin) = setup();
    let lab = Address::generate(&env);
    client
        .grant_role(&admin, &lab, &Symbol::new(&env, "LAB"))
        .unwrap();
    client
        .revoke_role(&admin, &lab, &Symbol::new(&env, "LAB"))
        .unwrap();
    assert!(!client.has_role(&lab, &Symbol::new(&env, "LAB")));
}

#[test]
fn test_revoke_nonexistent_role_fails() {
    let (env, client, admin) = setup();
    let nobody = Address::generate(&env);
    let err = client
        .try_revoke_role(&admin, &nobody, &Symbol::new(&env, "LAB"))
        .unwrap_err()
        .unwrap();
    assert_eq!(err, ContractError::RoleNotFound);
}

#[test]
fn test_non_admin_cannot_revoke_role() {
    let (env, client, admin) = setup();
    let dispensary = Address::generate(&env);
    let attacker = Address::generate(&env);
    client
        .grant_role(&admin, &dispensary, &Symbol::new(&env, "DISPENSARY"))
        .unwrap();
    let err = client
        .try_revoke_role(&attacker, &dispensary, &Symbol::new(&env, "DISPENSARY"))
        .unwrap_err()
        .unwrap();
    assert_eq!(err, ContractError::Unauthorized);
}

// ─── Transfer Admin ────────────────────────────────────────────────────────────

#[test]
fn test_transfer_admin_updates_admin() {
    let (env, client, admin) = setup();
    let new_admin = Address::generate(&env);
    client.transfer_admin(&admin, &new_admin).unwrap();
    assert_eq!(client.get_admin().unwrap(), new_admin);
}

#[test]
fn test_transfer_admin_old_admin_loses_role() {
    let (env, client, admin) = setup();
    let new_admin = Address::generate(&env);
    client.transfer_admin(&admin, &new_admin).unwrap();
    assert!(!client.has_role(&admin, &Symbol::new(&env, "ADMIN")));
    assert!(client.has_role(&new_admin, &Symbol::new(&env, "ADMIN")));
}

#[test]
fn test_non_admin_cannot_transfer_admin() {
    let (env, client, _admin) = setup();
    let rando = Address::generate(&env);
    let new_admin = Address::generate(&env);
    let err = client
        .try_transfer_admin(&rando, &new_admin)
        .unwrap_err()
        .unwrap();
    assert_eq!(err, ContractError::Unauthorized);
}

// ─── Multiple roles ────────────────────────────────────────────────────────────

#[test]
fn test_account_can_hold_multiple_roles() {
    let (env, client, admin) = setup();
    let multi = Address::generate(&env);
    client
        .grant_role(&admin, &multi, &Symbol::new(&env, "DOCTOR"))
        .unwrap();
    client
        .grant_role(&admin, &multi, &Symbol::new(&env, "LAB"))
        .unwrap();
    assert!(client.has_role(&multi, &Symbol::new(&env, "DOCTOR")));
    assert!(client.has_role(&multi, &Symbol::new(&env, "LAB")));
    assert!(!client.has_role(&multi, &Symbol::new(&env, "GROWER")));
}

// ─── has_role on uninitialized ────────────────────────────────────────────────

#[test]
fn test_has_role_returns_false_for_unknown() {
    let (env, client, _admin) = setup();
    let stranger = Address::generate(&env);
    assert!(!client.has_role(&stranger, &Symbol::new(&env, "DOCTOR")));
}
