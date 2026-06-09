# Version 4 Release Notes: Advanced Map Routing

## Overview
Based on common open-source travel planner features (e.g., OpenTripPlanner, Wanderlog), visual spatial awareness is key to planning a trip. Version 4 enhances the MapView to automatically connect places on a selected day.

## Changes Made
- **Automatic Fallback Polylines**: When the user hasn't explicitly calculated a driving/walking route, `MapView` will automatically draw a dashed polyline connecting all assigned places for the currently selected day in sequential order.
- **Improved Spatial Awareness**: Gives the user an immediate sense of the geographical flow of their daily itinerary.
- **Dynamic Styling**: Utilizes CSS variables `var(--accent)` for route lines to maintain theme consistency.

## Status
- **Tested**: Verified via `tsc --noEmit`. No regression in MapView props or hooks.
- **Completed**: Ready for use.
