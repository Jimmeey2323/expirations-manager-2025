# Expirations Manager 2025 - Updated Structure

A modern, feature-rich web application for tracking and managing membership expirations with Google Sheets integration.

## ✨ Updated for Member Expiration Tracking

The app now works with your **Expirations** sheet containing member-level data with the following structure:

### Expirations Sheet Columns
| Column | Description |
|--------|-------------|
| Unique Id | Unique identifier for each expiration record |
| Member ID | Member's ID number |
| First Name | Member's first name |
| Last Name | Member's last name |
| Email | Member's email address |
| Membership Name | Name of the membership package |
| End Date | Expiration/end date of membership |
| Home Location | Member's home studio location |
| Current Usage | Current usage metrics |
| Id | Order/transaction ID |
| Order At | Date order was placed |
| Sold By | Sales representative |
| Membership Id | Membership package ID |
| Frozen | Whether membership is frozen (TRUE/FALSE) |
| Paid | Payment amount |
| Status | Member status (Active, Churned, etc.) |

## 🎯 Key Features

- **Member-Centric View**: Track individual member expirations
- **Comprehensive Filtering**: Filter by member name, email, membership type, location, status, and more
- **Smart Annotations**: Add notes, follow-ups, tags, and priorities to any expiration
- **Persistent Notes**: All annotations stored separately and never lost when Expirations sheet refreshes
- **Advanced Grouping**: Group by membership type, location, status, priority, or associate
- **Modern UI**: Beautiful badges, responsive design, and intuitive interface

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. First Time Setup
1. Open http://localhost:3000
2. Click **"Init Notes Sheet"** to create the Notes sheet
3. Click **"Refresh Data"** to load member expirations

## 📊 Data Structure

### Read-Only Fields (from Expirations sheet)
All member and membership information is read-only:
- Member details (ID, name, email)
- Membership details (name, end date, location)
- Transaction details (order date, sold by, payment)
- Status information (frozen, paid, status)

### Editable Annotations (saved to Notes sheet)
You can add and edit:
- **Note Status**: Active, Pending, Completed, Cancelled
- **Priority**: High, Medium, Low
- **Associate Name**: Assign to team members
- **Follow-up Date**: Schedule follow-ups
- **Comments**: Add detailed comments
- **Remarks**: Additional notes
- **Tags**: Multiple tags for organization
- **Custom Fields**: Extensible for future needs

## 🎨 Table Features

### Main Table Columns
The data table displays all 16 expiration columns plus annotation columns:

**Member Info:**
- Unique ID
- Member ID
- First Name, Last Name
- Email

**Membership Info:**
- Membership Name
- End Date
- Home Location
- Current Usage

**Transaction Info:**
- ID
- Order At
- Sold By
- Membership ID

**Status Info:**
- Frozen
- Paid
- Status

**Annotations:**
- Note Status
- Note Priority
- Associate
- Follow-up Date
- Tags

### Column Visibility
- Toggle any column on/off using checkboxes
- Changes apply immediately
- Visibility preferences persist during session

### Sorting
- Click any column header to sort
- Click again to reverse sort order
- Multi-column sorting supported

### Pagination
- Choose 10, 25, 50, or 100 rows per page
- Navigate with page controls
- Shows current page and total records

## 🔍 Filtering Options

### Available Filters
1. **Member Name**: Search by first or last name
2. **Email**: Search by email address
3. **Membership Name**: Filter by membership type
4. **Home Location**: Filter by studio location
5. **Member Status**: Filter by Active, Churned, etc.
6. **Note Status**: Filter by annotation status
7. **Priority**: Filter by priority level
8. **Associate Name**: Filter by assigned person

### Using Filters
1. Click **"Filters"** to expand the panel
2. Set any combination of criteria
3. Click **"Apply Filters"**
4. Active filter count shown in badge
5. Click **"Clear All"** to reset

## 📁 Grouping Options

Organize your data by:
- **No Grouping**: Standard table view (default)
- **By Membership**: Group by membership type
- **By Location**: Group by home studio
- **By Member Status**: Group by Active/Churned status
- **By Note Status**: Group by annotation status
- **By Priority**: Group by priority level
- **By Associate**: Group by assigned team member

Each group shows:
- Group name and item count
- Separate table for group items
- All filtering and sorting within groups

## ✏️ Managing Expirations

### View Details
Click any row to open the detail modal showing:

**Member Expiration Info (Read-Only):**
- All 16 fields from the Expirations sheet
- Organized in clean grid layout
- Easy to read and reference

**Editable Annotations:**
- Status dropdown (Active, Pending, Completed, Cancelled)
- Priority dropdown (High, Medium, Low)
- Associate name input
- Follow-up date picker
- Comments textarea
- Remarks textarea
- Tags (add/remove multiple)
- Timestamps (created/updated)

### Save Changes
1. Edit any annotation fields
2. Click **"Save Changes"**
3. Data synced to Notes sheet immediately
4. Table refreshes automatically

### Delete Notes
1. Open detail modal
2. Click **"Delete Notes"**
3. Confirm deletion
4. Notes removed from Notes sheet

## 🎨 Status Badges

### Member Status (from sheet)
Displays the actual status from your Expirations sheet:
- Active (green)
- Churned (red)
- Or any custom status

### Note Status (your annotations)
Color-coded badges for annotation status:
- 🟢 Active = Green
- 🟡 Pending = Yellow
- 🔵 Completed = Blue
- 🔴 Cancelled = Red

### Priority Badges
- 🔴 High = Red
- 🟡 Medium = Yellow
- 🔵 Low = Blue

All badges are uniform size (96px × 24px) for clean alignment.

## 🔄 Data Sync

### How It Works
1. **Expirations Sheet**: Source data (refreshes every 15 mins)
2. **Notes Sheet**: Your annotations (never lost)
3. **Mapping**: Notes linked to expirations via Unique ID
4. **Display**: Combined view in the app

### Important Notes
- Expirations data is READ-ONLY
- All user data goes to Notes sheet
- Notes persist even when Expirations refreshes
- Click **"Refresh Data"** anytime to sync

## 📋 Sample Data

Your sheet contains membership expirations like:

```
Vandana Agarwal - Studio 1 Month Unlimited - Expired 2022-03-03 - Churned
Zahur Shaikh - Studio 1 Month Unlimited - Expired 2022-03-04 - Churned
Shonali Mahajan - Studio 12 Class Package - Expires 2025-10-26 - Active
```

## 🎯 Common Workflows

### Renewal Campaign
1. Filter by "Status = Churned" and membership type
2. Group by Home Location
3. Add follow-up dates and assign to associates
4. Track progress with Note Status
5. Add tags like "Renewal", "High-Priority"

### Expiring Memberships
1. Filter by upcoming end dates
2. Set Priority = High for imminent expirations
3. Add comments with renewal offers
4. Assign to sales team
5. Track with Note Status updates

### Studio-Based Management
1. Group by Location
2. Filter by membership type
3. Assign local associate
4. Track location-specific campaigns

### Team Workload
1. Group by Associate
2. View each person's assigned expirations
3. Balance workload
4. Track completion rates

## 🔧 Configuration

### Google Sheets Setup
The app connects to your spreadsheet:
- **Spreadsheet ID**: `1rGMDDvvTbZfNg1dueWtRN3LhOgGQOdLg3Fd7Sn1GCZo`
- **Expirations Sheet**: "Expirations" (columns A-P)
- **Notes Sheet**: "Notes" (auto-created)

### Authentication
OAuth 2.0 credentials configured in `src/config/google.ts`:
- Automatic token refresh
- Secure API access
- No manual login required

## 📱 Responsive Design

- **Desktop**: Full layout with all columns
- **Tablet**: Adapted grid, horizontal scroll
- **Mobile**: Stacked layout, touch-friendly

## 🐛 Troubleshooting

### Data Not Loading
- Click "Refresh Data" button
- Check spreadsheet URL/ID in config
- Verify sheet name is "Expirations"
- Check browser console (F12)

### Can't Save Notes
- Click "Init Notes Sheet" first
- Verify spreadsheet permissions
- Check OAuth credentials

### Wrong Data Displayed
- Ensure columns A-P match expected structure
- First row should be headers
- Check for empty rows at top

### Filters Not Working
- Click "Apply Filters" after setting criteria
- Check that data exists matching filters
- Try "Clear All" and reapply

## 💡 Pro Tips

1. **Column Visibility**: Hide unused columns for cleaner view
2. **Keyboard Navigation**: Use Tab/Shift+Tab in modals
3. **Tag Entry**: Press Enter to quickly add tags
4. **Batch Updates**: Group by location/status for bulk management
5. **Export Ready**: Use browser print/PDF for reports

## 🚀 Advanced Features

### Extending Custom Fields
The Notes sheet supports `customFields` (JSON):
```javascript
customFields: {
  renewalOffer: "20% discount",
  contactAttempts: 3,
  lastContactDate: "2025-10-15"
}
```

### Adding New Filters
Edit `src/utils/dataHelpers.ts` to add custom filter logic.

### Custom Grouping
Edit `src/utils/dataHelpers.ts` `groupData()` function for new grouping options.

## 📚 Technical Details

- **Framework**: React 18 + TypeScript
- **Build**: Vite 5
- **Styling**: Tailwind CSS 3
- **State**: Zustand
- **Table**: TanStack Table v8
- **Icons**: Lucide React
- **Dates**: date-fns
- **API**: Google Sheets API v4

## 🎉 You're All Set!

The app is now configured for your membership expiration tracking needs. Start by:

1. Loading your expiration data
2. Exploring the columns and filters
3. Adding notes to key expirations
4. Grouping by membership or location
5. Assigning follow-ups to your team

Happy tracking! 🚀

---

**Need More Help?**
- Check `PROJECT_SUMMARY.md` for technical details
- Check `QUICK_START.md` for step-by-step guide
- Open browser console (F12) for error messages
