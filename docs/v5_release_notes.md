# Version 5 Release Notes: Expense Splitting (Splitwise-lite)

## Overview
One of the most complex elements of group travel is managing who paid for what and who owes whom. In Version 5, we have fully stabilized and integrated the `Splitwise-lite` expense splitting engine within the BudgetPanel.

## Changes Made
- **Settlement Engine Integration**: Fully integrated the `budgetApi.settlement` backend logic directly into `BudgetPanel.tsx`. 
- **Balances UI**: Rendered net positive/negative balances and debt flows visually with colored trend indicators (Green for +, Red for -).
- **Member Chips**: Ensured `BudgetMemberChips` securely passes `paid_by` and `split_with` flags back into the global store for precise ratio calculation.
- **Micro-Animations**: Debt flows now feature hover micro-animations matching the dark/light dynamic theme of the Budget Panel.

## Status
- **Tested**: Validated the `settlement` endpoint integration and zero TypeScript errors (`tsc --noEmit`).
- **Completed**: Ready for use. Group members can now transparently view net debts.
