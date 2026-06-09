# Version 7 Release Notes: Budget Analytics & Time-Series Chart

## Overview
Tracking total expenses by category gives a great macro view, but understanding *when* money is being spent is crucial for travel budgeting. Version 7 introduces a Time-Series Bar Chart to the BudgetPanel Dashboard.

## Changes Made
- **Daily Spending Chart**: Added a horizontally scrollable bar chart plotting expenses chronologically by their recorded `expense_date`.
- **Dynamic Calculation**: Utilized `budgetItems` state to dynamically compute daily aggregates as well as track 'Unscheduled' expenses (those without dates).
- **Interactive UI**: Integrated responsive heights, micro-animations on bars, and tooltips indicating exact localized spending values for each day.
- **Visual Distinction**: The current day (today) is highlighted with an accent color for quick reference.

## Status
- **Tested**: Validated the component and successfully passed all `tsc` strict checks.
- **Completed**: Ready for use. Users can view their spending patterns over time immediately below the Category Pie Chart.
