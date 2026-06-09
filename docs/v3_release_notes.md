# Version 3 Release Notes: Weather Integration

## Overview
Based on user feedback from open-source travel planners, having quick access to destination weather is crucial. Version 3 introduces a fully functional `WeatherWidget` to the Dashboard.

## Changes Made
- **Created `WeatherWidget.tsx`**: A new widget that automatically fetches the coordinates of the first mapped place in the trip.
- **Open-Meteo API Integration**: Utilizing the free, no-key Open-Meteo API to fetch the 5-day daily forecast (max/min temperatures and weather codes).
- **Icon Mapping**: Added custom Lucide icons (Sun, CloudRain, Snowflake, CloudLightning, etc.) to visually represent Open-Meteo weather codes.
- **Dashboard Integration**: Embedded the `WeatherWidget` into both the Desktop sidebar and the Mobile bottom sheet (Widget Settings).
- **Dynamic Localization**: Ensured days and weather descriptions are fully translated via `t()` and JavaScript `Date.toLocaleDateString()`.

## Status
- **Tested**: Verified zero TypeScript errors.
- **Completed**: Ready for use.
