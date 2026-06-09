# V13: Multi-Currency Support for Budget

## Overview
Implemented multi-currency support for the budget module to allow expenses to be tracked in their original currency, alongside the trip's base currency.

## Technical Changes

1. **Database Schema:**
   - Appended a migration to `server/src/db/migrations.ts` to add three new columns to the `budget_items` table:
     - `currency` (TEXT): The ISO code of the expense's currency.
     - `original_amount` (REAL): The amount entered in the original currency.
     - `exchange_rate` (REAL DEFAULT 1.0): The conversion rate to the base trip currency.
   - Updated `server/src/db/schema.ts` to reflect the new structure.

2. **Backend Architecture:**
   - Modified the `BudgetItem` interfaces in both `client/src/types.ts` and `server/src/types.ts` to include `currency`, `original_amount`, and `exchange_rate`.
   - Updated `createBudgetItem` and `updateBudgetItem` in `server/src/services/budgetService.ts` to process and store the new fields safely.

3. **Frontend UI:**
   - Added a new utility `client/src/utils/currency.ts` to dynamically fetch live exchange rates from the Frankfurter API.
   - Enhanced `BudgetPanel.tsx`:
     - Updated the inline AddItemRow to include a native currency selector `<select>` populated from the `CURRENCIES` array.
     - Updated the UI of existing budget item rows to show the `original_amount` in its native currency alongside a selector to change it.
     - Automatically recalculate the `total_price` (in base currency) in the background via the exchange rate API when the user inputs a foreign currency.
     - Display a small approximation label (e.g. `≈ 95 EUR`) underneath the native amount.

## Type Safety
- All backend types correctly accept the optional multi-currency payload.
- Fixed a lingering strict type check issue where `reservation_id` was missing from `BudgetItem` in `server/src/types.ts`.
- Validated via `tsc --noEmit`.
