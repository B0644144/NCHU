# Version 6 Release Notes: Visual Calendar / Timeline View

## Overview
To provide a macro-level overview of the trip schedule, Version 6 introduces the `CalendarView` component. It visually represents all planned days as horizontal columns, with their respective places and reservations plotted inside. 

## Changes Made
- **CalendarView Component**: Created a horizontally scrollable timeline structure mimicking popular tools like Wanderlog.
- **Dynamic Content Mapping**: Uses `useMemo` to group and align places (Assignments) and reservations (Reservations) according to their scheduled `day_id`.
- **Trip Planner Integration**: Injected the new 'Calendar' tab gracefully into the main Navigation menu in `TripPlannerPage.tsx`.

## Status
- **Tested**: Validated component data mapping and `tsc` compilation.
- **Completed**: Ready for use. Users can switch to the Calendar tab and see their full trip plotted sequentially.
