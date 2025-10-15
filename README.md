# Expirations Manager 2025

A modern, feature-rich web application for tracking and managing offer expirations with Google Sheets integration.

## Features

- 🔄 **Google Sheets Integration**: Seamlessly sync with your Google Spreadsheet
- 📊 **Advanced DataTable**: Sortable columns, pagination, column visibility controls
- 🎯 **Smart Filtering**: Comprehensive filter panel with multiple criteria
- 🏷️ **Flexible Annotations**: Add notes, comments, tags, and custom fields
- 👥 **Associate Management**: Track who's handling each expiration
- 📅 **Follow-up Dates**: Schedule and track follow-ups
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- 📱 **Responsive**: Works seamlessly on desktop and mobile devices
- 🔍 **Multi-Grouping**: Group data by 6+ different criteria
- 💾 **Persistent Storage**: Notes saved separately, never lost on sheet refresh

## Architecture

### Data Structure

The app uses two Google Sheets:

1. **Expirations Sheet** (Read-only)
   - Contains the core expiration data
   - Refreshes every 15 minutes
   - Fields: Offer Name, Description, Applicable On, Ideal For, Suggested Quantity

2. **Notes Sheet** (Read/Write)
   - Stores all user annotations
   - Maps to expirations via unique IDs
   - Fields: Associate Name, Follow-up Date, Status, Priority, Comments, Remarks, Tags, Custom Fields

### Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Table**: TanStack Table (React Table v8)
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **API**: Google Sheets API v4

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google Cloud Project with Sheets API enabled
- OAuth 2.0 credentials (already configured)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

### Building for Production

```bash
npm run build
npm run preview
```

## Configuration

The Google Sheets configuration is in `src/config/google.ts`:

```typescript
export const GOOGLE_CONFIG = {
  CLIENT_ID: "...",
  CLIENT_SECRET: "...",
  REFRESH_TOKEN: "...",
  TOKEN_URL: "https://oauth2.googleapis.com/token"
};

export const SPREADSHEET_ID = "1rGMDDvvTbZfNg1dueWtRN3LhOgGQOdLg3Fd7Sn1GCZo";
export const EXPIRATIONS_SHEET = "Expirations";
export const NOTES_SHEET = "Notes";
```

## Usage

### First Time Setup

1. Click **"Init Notes Sheet"** in the header to create the Notes sheet structure
2. Click **"Refresh Data"** to load expirations from your spreadsheet

### Managing Expirations

1. **View**: Browse expirations in the table view
2. **Filter**: Click the Filter button to show/hide advanced filters
3. **Group**: Use the grouping buttons to organize data by different criteria
4. **Details**: Click any row to open the detail modal
5. **Edit**: Add notes, tags, dates, and other annotations
6. **Save**: Changes are automatically synced to the Notes sheet

### Grouping Options

- None (default table view)
- By Offer Name
- By Applicable On
- By Ideal For
- By Status
- By Priority
- By Associate

### Column Visibility

Toggle which columns to display using the checkboxes above the table.

### Pagination

- Choose rows per page: 10, 25, 50, or 100
- Navigate with page controls at the bottom

## Features in Detail

### Filter Panel (Collapsible)

- Offer Name search
- Applicable On dropdown
- Ideal For dropdown
- Status filter
- Priority filter
- Associate Name filter
- Follow-up date range

### Detail Modal

**Read-only Expiration Info:**
- Offer Name
- Description
- Applicable On
- Ideal For
- Suggested Quantity

**Editable Annotations:**
- Status (Active, Pending, Completed, Cancelled)
- Priority (High, Medium, Low)
- Associate Name
- Follow-up Date
- Comments (multi-line)
- Remarks (multi-line)
- Tags (add/remove multiple)
- Timestamps (Created/Updated)

### Status Badges

Color-coded, uniform-sized badges:
- Active: Green
- Pending: Yellow
- Completed: Blue
- Cancelled: Red

### Priority Badges

Color-coded, uniform-sized badges:
- High: Red
- Medium: Yellow
- Low: Blue

## Development

### Project Structure

```
src/
├── components/
│   ├── Badge.tsx           # Status & priority badges
│   ├── DataTable.tsx       # Advanced table component
│   ├── DetailModal.tsx     # Row detail modal
│   ├── FilterPanel.tsx     # Collapsible filter section
│   └── Modal.tsx           # Reusable modal wrapper
├── config/
│   └── google.ts           # Google Sheets config
├── services/
│   └── googleSheets.ts     # Google Sheets API service
├── store/
│   └── useAppStore.ts      # Zustand state management
├── types/
│   └── index.ts            # TypeScript interfaces
├── utils/
│   └── dataHelpers.ts      # Filter & grouping utilities
├── App.tsx                 # Main app component
├── main.tsx                # Entry point
└── index.css               # Global styles
```

### Key Components

- **useAppStore**: Centralized state management with Zustand
- **googleSheetsService**: Handles OAuth and API calls
- **DataTable**: Feature-rich table with TanStack Table
- **FilterPanel**: Advanced filtering with real-time updates
- **DetailModal**: Comprehensive edit interface

## API Integration

The app uses Google Sheets API v4 with OAuth 2.0:

1. **Token Refresh**: Automatically refreshes access tokens
2. **Read Expirations**: Fetches from Expirations sheet (range A:E)
3. **Read Notes**: Fetches from Notes sheet (range A:Z)
4. **Write Notes**: Appends or updates rows in Notes sheet
5. **Delete Notes**: Clears note rows

## Best Practices

- Never edit the Expirations sheet data (read-only)
- All user data goes in the Notes sheet
- Notes are mapped by unique expiration IDs
- Regular refreshes keep data in sync
- Tags and custom fields support extensibility

## Troubleshooting

### Authentication Errors
- Check if credentials are valid
- Verify Sheets API is enabled in Google Cloud Console
- Ensure spreadsheet is accessible with the service account

### Data Not Loading
- Click "Refresh Data" button
- Check browser console for errors
- Verify spreadsheet ID and sheet names

### Notes Not Saving
- Ensure Notes sheet exists (click "Init Notes Sheet")
- Check write permissions on the spreadsheet

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
