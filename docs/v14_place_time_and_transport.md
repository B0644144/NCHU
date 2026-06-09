# V14: Place Time & Transportation Suggestions

## Overview
Version 14 focuses on giving users better tools to estimate travel time and place durations to improve daily itinerary planning. 
We've integrated the existing OSRM routing engine to display travel times and driving segments between places directly in the Day Plan Sidebar. 
Additionally, we've implemented category-based default durations for places.

## Key Changes

### 1. Category-Based Durations
*   **Default Durations Map**: Introduced `CATEGORY_DURATION_MAP` in `client/src/utils/categoryDefaults.ts` to map place categories (via their Lucide icons) to reasonable default durations.
    *   *Examples*: Restaurants default to 90 min, Museums to 150 min, Transports/Transit to 15-150 min.
*   **Place Form Modal**: 
    *   The Add/Edit Place modal now exposes the `duration_minutes` input.
    *   When selecting a category for a new place, the duration is auto-filled based on the `CATEGORY_DURATION_MAP`.
*   **Backend Service (`placeService.ts`)**: Enhanced duration handling to correctly process `duration_minutes = 0` (using `??` instead of `||`) which is useful for accommodations that don't need a discrete hourly duration.

### 2. Travel Time Segments in Sidebar
*   **OSRM Integration**: Leveraged the existing OSRM integration (`useRouteCalculation.ts`) which calculates driving routes between geocoded waypoints.
*   **UI Display**: 
    *   Passed `routeSegments` from `TripPlannerPage` into `DayPlanSidebar`.
    *   Rendered a connector line below places in the Day Plan Sidebar.
    *   Displayed the estimated travel time (e.g., "15 min") inside a stylish, clickable pill.
    *   The pill connects the current place to the next consecutive place using an external link to Google Maps Directions for real-world navigation.

## Testing & Verification
1.  **Tested category defaults**: Selecting different categories in the Place form correctly adjusts the duration field.
2.  **Tested segment rendering**: The timeline view correctly spaces places and inserts travel segments using OSRM estimates.
3.  **Tested `0` duration**: Adding accommodations correctly allows `0` duration without overriding it back to `60` minutes.
4.  **TypeScript Verification**: Ran `npx tsc --noEmit` across the client codebase to ensure type safety remains intact.

## Next Steps
The UI for places is much more complete. Future iterations can look into auto-shifting times for subsequent places based on these durations and travel segments.
