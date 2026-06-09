# Version 9 Release Notes: Offline Sync Indicator

## Overview
Because TREK provides robust offline capabilities, users need visual reassurance of their connectivity status to know when data is safely synced to the cloud versus stored locally on their device. Version 9 introduces a top-level Offline Mode indicator.

## Changes Made
- **Real-time Connectivity Tracking**: Integrated `navigator.onLine` and `window` event listeners (`online`/`offline`) into the global Navbar component.
- **Visual Badge**: A red-tinted `WifiOff` badge now appears in the Navbar when the device loses connection.
- **Styling**: Ensured the badge integrates smoothly within the responsive layout (hidden on very small screens to save space, but visible otherwise) and blends gracefully with dark mode.

## Status
- **Tested**: Verified state changes and event unmounting logic.
- **Completed**: Ready for use. The application is now fully aware of offline states at the UI level.
