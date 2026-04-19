use soroban_sdk::{Address, Env, Symbol};

use crate::{
    errors::ContractError,
    storage::{StorageKey, TTL_BUMP_TARGET, TTL_BUMP_THRESHOLD},
};

// ─── Role name constants ───────────────────────────────────────────────────────
// Kept short (≤ 9 chars) to fit within Soroban Symbol limits.

pub fn role_admin(env: &Env) -> Symbol {
    Symbol::new(env, "ADMIN")
}
pub fn role_doctor(env: &Env) -> Symbol {
    Symbol::new(env, "DOCTOR")
}
pub fn role_dispensary(env: &Env) -> Symbol {
    Symbol::new(env, "DISPENSARY")
}
pub fn role_lab(env: &Env) -> Symbol {
    Symbol::new(env, "LAB")
}
pub fn role_grower(env: &Env) -> Symbol {
    Symbol::new(env, "GROWER")
}

// ─── Core role helpers ─────────────────────────────────────────────────────────

/// Returns `true` if `account` has the given `role`.
/// Also bumps the TTL of the entry so active roles stay alive.
pub fn has_role(env: &Env, account: &Address, role: &Symbol) -> bool {
    let key = StorageKey::Role(account.clone(), role.clone());
    let result = env
        .storage()
        .persistent()
        .get::<StorageKey, bool>(&key)
        .unwrap_or(false);

    // Bump TTL if the entry exists
    if result {
        env.storage().persistent().extend_ttl(
            &key,
            TTL_BUMP_THRESHOLD,
            TTL_BUMP_TARGET,
        );
    }

    result
}

/// Grants `role` to `account`. Stores the entry in persistent storage.
/// Does NOT check caller authorization — that must be done before calling this.
pub fn grant_role_unchecked(env: &Env, account: &Address, role: &Symbol) {
    let key = StorageKey::Role(account.clone(), role.clone());
    env.storage().persistent().set(&key, &true);
    env.storage()
        .persistent()
        .extend_ttl(&key, TTL_BUMP_THRESHOLD, TTL_BUMP_TARGET);
}

/// Revokes `role` from `account`.
/// Does NOT check caller authorization — that must be done before calling this.
pub fn revoke_role_unchecked(env: &Env, account: &Address, role: &Symbol) {
    let key = StorageKey::Role(account.clone(), role.clone());
    env.storage().persistent().set(&key, &false);
}

/// Asserts that `caller` has the required `role`, calling `require_auth()` first.
/// Returns `ContractError::Unauthorized` if the check fails.
pub fn require_role(
    env: &Env,
    caller: &Address,
    role: &Symbol,
) -> Result<(), ContractError> {
    caller.require_auth();
    if !has_role(env, caller, role) {
        return Err(ContractError::Unauthorized);
    }
    Ok(())
}

/// Asserts that `caller` is the contract admin, calling `require_auth()` first.
pub fn require_admin(env: &Env, caller: &Address) -> Result<(), ContractError> {
    caller.require_auth();
    let admin = env
        .storage()
        .instance()
        .get::<StorageKey, Address>(&StorageKey::Admin)
        .ok_or(ContractError::NotInitialized)?;
    if *caller != admin {
        return Err(ContractError::Unauthorized);
    }
    Ok(())
}
