# Export Feature - Quick Reference

## New Export Buttons

The export functionality is located in the main dashboard controls bar:

```
┌──────────────────────────────────────────────────────────────────────┐
│                    EXPIRATIONS MANAGER 2025                          │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│  📊 Metric Cards (Summary Statistics)                                │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│  🔍 Filter Panel                                                      │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│  Group By: [No Grouping] [By Membership] [By Location] ...          │
│                                                                       │
│  Export: [ 📥 CSV ] [ 📄 PDF ] [ 📋 Copy ]  ← NEW!                  │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│  🔍 Search Bar  |  Quick Filters: [All] [Next 7] [Next 30] ...      │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│  📊 Data Table                                                        │
└──────────────────────────────────────────────────────────────────────┘
```

## Export Options

### 1. CSV Export (Green Button)
- **Icon**: Download (📥)
- **Color**: Green (Emerald)
- **Output**: CSV file with timestamp
- **Best for**: Excel analysis, data manipulation
- **Filename**: `expirations-export-2025-11-13T10-30-45.csv`

### 2. PDF Export (Red Button)
- **Icon**: File Text (📄)
- **Color**: Red
- **Output**: Professional PDF report
- **Best for**: Reports, printing, sharing
- **Filename**: `expirations-export-2025-11-13T10-30-45.pdf`

### 3. Copy to Clipboard (Blue Button)
- **Icon**: Copy (📋)
- **Color**: Blue
- **Output**: Tab-separated text (TSV)
- **Best for**: Quick paste into spreadsheets
- **Action**: Copies to clipboard with confirmation

## Button States

### Active State
```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  📥 CSV     │  │  📄 PDF     │  │  📋 Copy    │
│  (Enabled)  │  │  (Enabled)  │  │  (Enabled)  │
└─────────────┘  └─────────────┘  └─────────────┘
```

### Disabled State (No Data)
```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  📥 CSV     │  │  📄 PDF     │  │  📋 Copy    │
│  (Greyed)   │  │  (Greyed)   │  │  (Greyed)   │
└─────────────┘  └─────────────┘  └─────────────┘
```

## Usage Flow

```
1. Apply Filters
   ↓
2. Review Data in Table
   ↓
3. Click Export Button
   ↓
4. Receive File/Confirmation
```

## Exported Columns

| Column # | Field Name           | Description                    |
|----------|---------------------|--------------------------------|
| 1        | Member ID           | Unique member identifier       |
| 2        | First Name          | Member's first name            |
| 3        | Last Name           | Member's last name             |
| 4        | Email               | Contact email                  |
| 5        | Membership          | Membership type/name           |
| 6        | End Date            | Expiration date (IST format)   |
| 7        | Location            | Home location/branch           |
| 8        | Status              | Current status                 |
| 9        | Priority            | Priority level                 |
| 10       | Assigned Associate  | Assigned team member           |
| 11       | Stage               | Lifecycle stage                |
| 12       | Revenue             | Revenue amount                 |
| 13       | Sold By             | Sales associate                |
| 14       | Frozen              | Frozen status                  |
| 15       | Paid                | Payment status                 |
| 16       | Latest Follow-up    | Most recent follow-up comment  |
| 17       | Remarks             | Additional remarks/notes       |

## Tips

✅ **Before Exporting:**
- Apply all desired filters
- Verify the data count
- Check the date range

✅ **CSV Files:**
- Open in Excel or Google Sheets
- All special characters properly escaped
- UTF-8 encoding for international characters

✅ **PDF Files:**
- Landscape orientation for better fit
- Professional formatting
- Includes generation timestamp

✅ **Clipboard:**
- Paste directly into spreadsheet apps
- Maintains column structure
- Shows success confirmation

## Keyboard Shortcuts

No keyboard shortcuts currently assigned, but you can use:
- Tab to navigate between export buttons
- Enter/Space to trigger the focused button
