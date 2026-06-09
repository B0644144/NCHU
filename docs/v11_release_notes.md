# Version 11 Release Notes: Advanced Theme Switcher

## Overview
To provide users with more control over their viewing experience, V11 upgrades the Dark Mode functionality into a robust Theme Switcher. Users can now explicitly select between Light, Dark, or System (Auto) modes, and this preference is saved persistently.

## Changes Made
- **Navbar Dropdown**: Upgraded the simple sun/moon toggle in the `Navbar.tsx` to a fully interactive dropdown menu allowing selection of Light, Dark, and Auto.
- **Settings Sync**: Integrated the dropdown directly with the `SettingsStore` (`dark_mode: 'light' | 'dark' | 'auto'`), seamlessly triggering the CSS variable shifts (`trek-theme-transitioning`).
- **Cross-Component Consistency**: Verified that the dedicated `DisplaySettingsTab.tsx` UI perfectly aligns with the new Navbar dropdown state.

## Status
- **Tested**: Verified via `tsc` to ensure the new state types and UI components are strictly typed.
- **Completed**: Ready for use.
