# Wix Google Sheets Library Sync 📚

An integration script for Wix sites built on Velo (Wix Code) to fetch, search, and filter a library database stored in a Google Sheet.

## 🚀 Features

- **Google Sheets API v4 Integration**: Direct fetch from a spreadsheet using async HTTP requests (`wix-fetch`).
- **Section Parsing**: Handles structured spreadsheet layouts (headers, empty rows, and topics/sections).
- **Search & Filtering**: Client-side filtering across Book Title, Author, Topic, and Library Section.
- **Wix UI Binding**: Automatically populates Wix Repeaters or Tables with responsive card data.

## 🛠️ How it Works

1. The script calls the Google Sheets API endpoint using your `SHEET_ID` and `API_KEY`.
2. It processes the raw JSON array values, skipping formatting spacing or blank cells.
3. Groups books under dynamically parsed sections (e.g., Agraria, Art, etc.).
4. Feeds the data array into Wix frontend repeater datasets to display real-time results.

## 📁 Code Files

- `library.js` — Basic implementation for loading and rendering sheets.
- `library-new.js` — Robust parser handling nested sections, empty cells, and advanced multi-field search algorithms.

## ⚙️ Wix Setup

To use this script:
1. Enable **Developer Mode** in the Wix Editor.
2. Under Public/Backend, add a new JavaScript file and paste the logic.
3. Replace the placeholder config:
   ```javascript
   const SHEET_ID = 'YOUR_SHEET_ID';
   const API_KEY = 'YOUR_API_KEY';
   ```
4. Connect the return promise arrays to your page elements.
