#![no_std]

mod errors;

use soroban_sdk::{contract, contractimpl, Address, BytesN, Env, Symbol, Vec};

// ── OpenZeppelin stellar-access ───────────────────────────────────────────────
// Uses the audited OZ AccessControl storage & logic instead of custom storage.
// Docs: https://github.com/OpenZeppelin/stellar-contracts/tree/main/packages/access
use stellar_access::access_control;

use errors::ContractError;

// ─── Storage key (minimal — OZ owns role storage) ─────────────────────────────
use soroban_sdk::contracttype;

#[contracttype]
#[derive(Clone)]
enum StorageKey {
    Initialized,
}

#[contract]
pub struct TrustLeafRbac;

#[contractimpl]
impl TrustLeafRbac {
    // ─── Initialization ────────────────────────────────────────────────────

    /// Initialize the contract with a root admin.
    /// Bootstraps the ADMIN role via OpenZeppelin's `set_admin`.
    pub fn initialize(env: Env, admin: Address) -> Result<(), ContractError> {
        if env.storage().instance().has(&StorageKey::Initialized) {
            return Err(ContractError::AlreadyInitialized);
        }

        // OZ: set the admin address in OZ's storage
        access_control::set_admin(&env, &admin);

        // Bootstrap: grant ADMIN role to admin (for cross-contract has_role checks)
        access_control::grant_role_no_auth(&env, &admin, &Symbol::new(&env, "ADMIN"), &admin);

        env.storage().instance().set(&StorageKey::Initialized, &true);

        env.events().publish(
            (Symbol::new(&env, "RbacInit"),),
            (admin,),
        );

        Ok(())
    }

    // ─── Role management ───────────────────────────────────────────────────

    /// Grant a role to an account. Only callable by the contract admin.
    ///
    /// Delegates to OZ `access_control::grant_role` which:
    ///   1. Calls `caller.require_auth()`
    ///   2. Verifies caller is admin or has the role's admin-role
    ///   3. Handles storage + emits events
    pub fn grant_role(
        env: Env,
        caller: Address,
        account: Address,
        role: Symbol,
    ) -> Result<(), ContractError> {
        Self::ensure_initialized(&env)?;

        // OZ enforces admin auth internally
        access_control::grant_role(&env, &account, &role, &caller);

        env.events().publish(
            (Symbol::new(&env, "RoleGranted"), role),
            (account,),
        );

        Ok(())
    }

    /// Revoke a role from an account. Only callable by the contract admin.
    pub fn revoke_role(
        env: Env,
        caller: Address,
        account: Address,
        role: Symbol,
    ) -> Result<(), ContractError> {
        Self::ensure_initialized(&env)?;

        access_control::revoke_role(&env, &account, &role, &caller);

        env.events().publish(
            (Symbol::new(&env, "RoleRevoked"), role),
            (account,),
        );

        Ok(())
    }

    /// Allow an account to voluntarily relinquish their own role.
    pub fn renounce_role(env: Env, role: Symbol, caller: Address) -> Result<(), ContractError> {
        Self::ensure_initialized(&env)?;
        access_control::renounce_role(&env, &role, &caller);
        Ok(())
    }

    /// Initiate a two-step admin transfer (more secure than single-step).
    /// `live_until_ledger` is the ledger sequence until which the pending
    /// transfer remains valid (new admin must accept before then).
    pub fn transfer_admin(
        env: Env,
        new_admin: Address,
        live_until_ledger: u32,
    ) -> Result<(), ContractError> {
        Self::ensure_initialized(&env)?;
        // OZ enforces current admin auth internally
        access_control::transfer_admin_role(&env, &new_admin, live_until_ledger);
        Ok(())
    }

    /// New admin accepts a pending admin transfer.
    pub fn accept_admin_transfer(env: Env) -> Result<(), ContractError> {
        Self::ensure_initialized(&env)?;
        access_control::accept_admin_transfer(&env);
        Ok(())
    }

    /// Permanently renounce admin rights (irreversible — use with caution).
    pub fn renounce_admin(env: Env) -> Result<(), ContractError> {
        Self::ensure_initialized(&env)?;
        access_control::renounce_admin(&env);
        Ok(())
    }

    /// Configure which role acts as admin for a given role.
    /// Enables hierarchical delegation (e.g., ADMIN can manage DOCTOR_ROLE).
    pub fn set_role_admin(
        env: Env,
        caller: Address,
        role: Symbol,
        admin_role: Symbol,
    ) -> Result<(), ContractError> {
        Self::ensure_initialized(&env)?;
        caller.require_auth();
        // Ensure caller is admin
        let admin = access_control::get_admin(&env).ok_or(ContractError::NotInitialized)?;
        if caller != admin {
            return Err(ContractError::Unauthorized);
        }
        access_control::set_role_admin_no_auth(&env, &role, &admin_role);
        Ok(())
    }

    /// Upgrade the contract WASM. Only callable by the admin.
    pub fn upgrade(
        env: Env,
        caller: Address,
        new_wasm_hash: BytesN<32>,
    ) -> Result<(), ContractError> {
        Self::ensure_initialized(&env)?;
        caller.require_auth();
        let admin = access_control::get_admin(&env).ok_or(ContractError::NotInitialized)?;
        if caller != admin {
            return Err(ContractError::Unauthorized);
        }
        env.deployer().update_current_contract_wasm(new_wasm_hash);
        Ok(())
    }

    // ─── Read-only queries ─────────────────────────────────────────────────

    /// Returns true if `account` has `role`.
    /// Wraps OZ's `Option<u32>` return as `bool` for cross-contract compatibility.
    pub fn has_role(env: Env, account: Address, role: Symbol) -> bool {
        access_control::has_role(&env, &account, &role).is_some()
    }

    /// Returns the current admin address.
    pub fn get_admin(env: Env) -> Result<Address, ContractError> {
        access_control::get_admin(&env).ok_or(ContractError::NotInitialized)
    }

    /// Returns the admin role configured for a given role (if any).
    pub fn get_role_admin(env: Env, role: Symbol) -> Option<Symbol> {
        access_control::get_role_admin(&env, &role)
    }

    /// Returns the number of accounts holding a given role.
    pub fn get_role_member_count(env: Env, role: Symbol) -> u32 {
        access_control::get_role_member_count(&env, &role)
    }

    /// Returns all roles that have at least one member.
    pub fn get_existing_roles(env: Env) -> Vec<Symbol> {
        access_control::get_existing_roles(&env)
    }

    /// Returns true if the contract has been initialized.
    pub fn is_initialized(env: Env) -> bool {
        env.storage().instance().has(&StorageKey::Initialized)
    }

    // ─── Internal helpers ──────────────────────────────────────────────────

    fn ensure_initialized(env: &Env) -> Result<(), ContractError> {
        if !env.storage().instance().has(&StorageKey::Initialized) {
            return Err(ContractError::NotInitialized);
        }
        Ok(())
    }
}

#[cfg(test)]
mod test;
