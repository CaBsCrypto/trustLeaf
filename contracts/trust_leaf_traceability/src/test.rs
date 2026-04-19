#![cfg(test)]

use soroban_sdk::{testutils::Address as _, Address, BytesN, Env, Symbol};

use crate::{
    batch::BatchStatus, errors::ContractError, TrustLeafTraceability,
    TrustLeafTraceabilityClient,
};

// We also need the RBAC contract in tests
use trust_leaf_rbac::{TrustLeafRbac, TrustLeafRbacClient};

// ─── Setup helpers ────────────────────────────────────────────────────────────

struct TestEnv<'a> {
    env: Env,
    trc: TrustLeafTraceabilityClient<'a>,
    rbac: TrustLeafRbacClient<'a>,
    admin: Address,
    grower: Address,
    lab: Address,
    dispensary: Address,
}

fn setup<'a>() -> TestEnv<'a> {
    let env = Env::default();
    env.mock_all_auths();

    // Deploy RBAC
    let rbac_id = env.register(TrustLeafRbac, ());
    let rbac = TrustLeafRbacClient::new(&env, &rbac_id);

    let admin = Address::generate(&env);
    let grower = Address::generate(&env);
    let lab = Address::generate(&env);
    let dispensary = Address::generate(&env);

    rbac.initialize(&admin).unwrap();
    rbac.grant_role(&admin, &grower, &Symbol::new(&env, "GROWER")).unwrap();
    rbac.grant_role(&admin, &lab, &Symbol::new(&env, "LAB")).unwrap();
    rbac.grant_role(&admin, &dispensary, &Symbol::new(&env, "DISPENSARY")).unwrap();

    // Deploy Traceability
    let trc_id = env.register(TrustLeafTraceability, ());
    let trc = TrustLeafTraceabilityClient::new(&env, &trc_id);
    trc.initialize(&rbac_id).unwrap();

    TestEnv { env, trc, rbac, admin, grower, lab, dispensary }
}

fn make_hash(env: &Env, seed: u8) -> BytesN<32> {
    BytesN::from_array(env, &[seed; 32])
}

fn make_batch_id(env: &Env) -> BytesN<32> {
    make_hash(env, 0xAB)
}

// ─── Initialization ────────────────────────────────────────────────────────────

#[test]
fn test_double_initialize_fails() {
    let t = setup();
    let rbac_id = t.rbac.address.clone();
    let err = t.trc.try_initialize(&rbac_id).unwrap_err().unwrap();
    assert_eq!(err, ContractError::AlreadyInitialized);
}

// ─── create_batch ─────────────────────────────────────────────────────────────

#[test]
fn test_grower_can_create_batch() {
    let t = setup();
    let batch_id = make_batch_id(&t.env);
    let meta_hash = make_hash(&t.env, 0x01);
    let strain = Symbol::new(&t.env, "OG_KUSH");

    t.trc
        .create_batch(&t.grower, &batch_id, &meta_hash, &strain)
        .unwrap();

    let batch = t.trc.get_batch(&batch_id).unwrap();
    assert_eq!(batch.grower, t.grower);
    assert_eq!(batch.metadata_hash, meta_hash);
    assert_eq!(batch.status, BatchStatus::Growing);
}

#[test]
fn test_non_grower_cannot_create_batch() {
    let t = setup();
    let stranger = Address::generate(&t.env);
    let err = t
        .trc
        .try_create_batch(
            &stranger,
            &make_batch_id(&t.env),
            &make_hash(&t.env, 0x01),
            &Symbol::new(&t.env, "OG_KUSH"),
        )
        .unwrap_err()
        .unwrap();
    assert_eq!(err, ContractError::Unauthorized);
}

#[test]
fn test_duplicate_batch_id_fails() {
    let t = setup();
    let batch_id = make_batch_id(&t.env);
    let meta_hash = make_hash(&t.env, 0x01);
    let strain = Symbol::new(&t.env, "OG_KUSH");

    t.trc
        .create_batch(&t.grower, &batch_id, &meta_hash, &strain)
        .unwrap();

    let err = t
        .trc
        .try_create_batch(&t.grower, &batch_id, &meta_hash, &strain)
        .unwrap_err()
        .unwrap();
    assert_eq!(err, ContractError::BatchAlreadyExists);
}

// ─── update_batch_status ──────────────────────────────────────────────────────

#[test]
fn test_valid_status_transitions() {
    let t = setup();
    let batch_id = make_batch_id(&t.env);
    let zero_hash = make_hash(&t.env, 0x00);
    let cert_hash = make_hash(&t.env, 0xCC);

    t.trc
        .create_batch(
            &t.grower,
            &batch_id,
            &make_hash(&t.env, 0x01),
            &Symbol::new(&t.env, "SATIVA"),
        )
        .unwrap();

    // Growing → Harvested
    t.trc
        .update_batch_status(&t.grower, &batch_id, &BatchStatus::Harvested, &zero_hash)
        .unwrap();

    // Harvested → LabTested (attaches cert hash)
    t.trc
        .update_batch_status(&t.lab, &batch_id, &BatchStatus::LabTested, &cert_hash)
        .unwrap();

    let batch = t.trc.get_batch(&batch_id).unwrap();
    assert_eq!(batch.status, BatchStatus::LabTested);
    assert_eq!(batch.lab_cert_hash, cert_hash);

    // LabTested → Approved
    t.trc
        .update_batch_status(&t.dispensary, &batch_id, &BatchStatus::Approved, &zero_hash)
        .unwrap();

    // Approved → Dispensed
    t.trc
        .update_batch_status(&t.dispensary, &batch_id, &BatchStatus::Dispensed, &zero_hash)
        .unwrap();

    let batch = t.trc.get_batch(&batch_id).unwrap();
    assert_eq!(batch.status, BatchStatus::Dispensed);
}

#[test]
fn test_invalid_status_transition_fails() {
    let t = setup();
    let batch_id = make_batch_id(&t.env);
    t.trc
        .create_batch(
            &t.grower,
            &batch_id,
            &make_hash(&t.env, 0x01),
            &Symbol::new(&t.env, "INDICA"),
        )
        .unwrap();

    // Can't skip from Growing → Approved
    let err = t
        .trc
        .try_update_batch_status(
            &t.grower,
            &batch_id,
            &BatchStatus::Approved,
            &make_hash(&t.env, 0x00),
        )
        .unwrap_err()
        .unwrap();
    assert_eq!(err, ContractError::InvalidStatusTransition);
}

// ─── record_event ─────────────────────────────────────────────────────────────

#[test]
fn test_grower_can_record_event() {
    let t = setup();
    let batch_id = make_batch_id(&t.env);
    t.trc
        .create_batch(
            &t.grower,
            &batch_id,
            &make_hash(&t.env, 0x01),
            &Symbol::new(&t.env, "CBD"),
        )
        .unwrap();

    t.trc
        .record_event(
            &t.grower,
            &batch_id,
            &Symbol::new(&t.env, "WATERING"),
            &make_hash(&t.env, 0xEE),
        )
        .unwrap();

    assert_eq!(t.trc.get_event_count(&batch_id), 1u32);

    let ev = t.trc.get_event(&batch_id, &0u32).unwrap();
    assert_eq!(ev.event_type, Symbol::new(&t.env, "WATERING"));
    assert_eq!(ev.seq, 0u32);
}

#[test]
fn test_multiple_events_sequential_seq_numbers() {
    let t = setup();
    let batch_id = make_batch_id(&t.env);
    t.trc
        .create_batch(
            &t.grower,
            &batch_id,
            &make_hash(&t.env, 0x01),
            &Symbol::new(&t.env, "CBD"),
        )
        .unwrap();

    for i in 0u8..5 {
        t.trc
            .record_event(
                &t.grower,
                &batch_id,
                &Symbol::new(&t.env, "WATERING"),
                &make_hash(&t.env, i),
            )
            .unwrap();
    }

    assert_eq!(t.trc.get_event_count(&batch_id), 5u32);

    for seq in 0u32..5 {
        let ev = t.trc.get_event(&batch_id, &seq).unwrap();
        assert_eq!(ev.seq, seq);
    }
}

#[test]
fn test_unauthorized_cannot_record_event() {
    let t = setup();
    let batch_id = make_batch_id(&t.env);
    t.trc
        .create_batch(
            &t.grower,
            &batch_id,
            &make_hash(&t.env, 0x01),
            &Symbol::new(&t.env, "CBD"),
        )
        .unwrap();

    let stranger = Address::generate(&t.env);
    let err = t
        .trc
        .try_record_event(
            &stranger,
            &batch_id,
            &Symbol::new(&t.env, "WATERING"),
            &make_hash(&t.env, 0xFF),
        )
        .unwrap_err()
        .unwrap();
    assert_eq!(err, ContractError::Unauthorized);
}

// ─── touch_batch ──────────────────────────────────────────────────────────────

#[test]
fn test_touch_batch_on_nonexistent_fails() {
    let t = setup();
    let fake_id = make_hash(&t.env, 0xFF);
    let err = t.trc.try_touch_batch(&fake_id).unwrap_err().unwrap();
    assert_eq!(err, ContractError::BatchNotFound);
}
