# Version 8 Release Notes: File Management - Tags & Categories

## Overview
Keeping travel documents, bookings, and receipts organized can become chaotic. Version 8 brings an intelligent tagging system directly into the `FileManager`.

## Changes Made
- **Hashtag Parsing Engine**: File descriptions are now automatically parsed using a Regex engine (`/#[\w\u00C0-\u024F]+/g`) to extract any tags formatted as `#tagname`.
- **Dynamic Filter Tabs**: The UI top navigation bar in FileManager now dynamically registers custom tags parsed from all files and provides clickable pill-filters.
- **Visual Micro-Indicators**: Within the file lists, any hashtag inside a description is visually transformed into a distinct highlighted label, making scanning immediate and frictionless.

## Status
- **Tested**: Verified parsing stability and TS compiler constraints.
- **Completed**: Ready for use. Add `#receipt`, `#hotel`, or `#flight` to your file notes to automatically group them.
