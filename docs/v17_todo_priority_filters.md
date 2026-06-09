# TREK Release Notes: Version 17
## Todo Priority Sorting & Quick Filters

We have implemented dynamic filtering and advanced sorting options inside the todo panel to help users organize, filter, and view their tasks efficiently.

### Features

1. **Toolbar Quick Filters**:
   - **Priority Filter**: Allows filtering tasks by priority (P1 High, P2 Medium, P3 Low, or No Priority).
   - **Assignee Filter**: Easily filter tasks assigned to a specific buddy, unassigned tasks, or show all assignees.
   - **Category Filter**: View tasks of a specific category, uncategorized tasks, or show all categories.
2. **Advanced Sorting options**:
   - Sort tasks by **Priority (High to Low)**.
   - Sort tasks by **Priority (Low to High)**.
   - Sort tasks by **Due Date**.
3. **Sidebar & Toolbar State Sync**:
   - Changing the sorting options in the sidebar (via the "Priority" button) automatically updates the sort dropdown, and vice versa.
4. **Premium Layout**:
   - Replaced custom layout offsets with a flexbox toolbar that integrates cleanly between the header and the scrollable task list.
   - Supports dark/light modes and fits seamlessly into desktop/mobile viewports.

### Verification Results

#### Automated Unit Tests
We added four comprehensive integration/unit tests to the client Vitest suite (`TodoListPanel.test.tsx`):
- `FE-COMP-TODO-030: priority dropdown filters task list`
- `FE-COMP-TODO-031: assignee dropdown filters task list`
- `FE-COMP-TODO-032: category dropdown filters task list`
- `FE-COMP-TODO-033: sort dropdown reorders task list`

All 33 client unit tests are passing.
Typecheck is clean with `npx tsc --noEmit` across `client/` and `server/`.
