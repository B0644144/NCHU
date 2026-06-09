# TREK Release Notes: Version 18
## Travel Warnings & Alerts for Long Transports

We have introduced visual alerts and warnings inside the timeline view to warn users about exceptionally long transport durations and long-distance walks between itinerary places.

### Features

1. **Long Walk Detection & Alert**:
   - If the walking distance between two consecutive places is **over 2 km** OR the estimated walking duration is **over 30 minutes**, a warning badge labeled **"Long Walk"** is rendered.
   - Hovering over this badge displays a detailed tooltip showing the estimated walking time and distance in kilometers (e.g. `Long walk warning: walking takes over 30 minutes`).

2. **Long Drive / Transport Detection & Alert**:
   - If the driving duration between two consecutive places is **over 3 hours**, a warning badge labeled **"Long Drive"** is rendered.
   - Hovering over this badge displays a tooltip warning the user of the exceptionally long travel duration (e.g. `Long transport warning: driving takes over 3 hours`).

3. **State Integrity Fixes**:
   - Resolved a runtime bug where `RouteSegment` from OSRM did not populate `distance` and `duration` values, preventing the timeline time-sync calculations (`handleSyncTimes`) from correctly reading segment travel time at runtime.

### Verification Results

#### Automated Tests
Added two unit tests to `DayPlanSidebar.test.tsx` to verify warnings render correctly:
- `FE-PLANNER-DAYPLAN-099: renders warning badges when travel segments are exceptionally long` (verifies the "Long Walk" warning badge when distance exceeds 2 km)
- `FE-PLANNER-DAYPLAN-100: renders long drive warning when driving duration is over 3 hours` (verifies the "Long Drive" warning badge when driving duration exceeds 3 hours)

All 98 client tests in `DayPlanSidebar.test.tsx` compile and pass cleanly. Typechecks are 100% green.
