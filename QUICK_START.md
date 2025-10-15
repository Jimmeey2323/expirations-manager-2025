# 🚀 Quick Start Guide

## Your App is Ready!

The Expirations Manager 2025 is now running at: **http://localhost:3000**

## First Time Setup (30 seconds)

### Step 1: Initialize Notes Sheet
1. Look for the **"Init Notes Sheet"** button in the top-right corner
2. Click it to create the Notes sheet structure in your Google Spreadsheet
3. Wait for confirmation

### Step 2: Load Data
1. Click the **"Refresh Data"** button (next to Init Notes Sheet)
2. Your expirations from the Google Sheet will load
3. You should see 7 offers in the table

## Quick Feature Tour

### 📊 Viewing Data
- **Table View**: See all expirations in an organized table
- **Click Any Row**: Opens detailed view with all information
- **Pagination**: Navigate through data at bottom of table
- **Sort**: Click column headers to sort

### 🔍 Filtering (Collapsible Panel)
1. Click **"Filters"** to expand the filter section
2. Set any combination of:
   - Offer Name (search)
   - Applicable On
   - Ideal For
   - Status
   - Priority
   - Associate Name
   - Date Range
3. Click **"Apply Filters"**
4. Click **"Clear All"** to reset

### 📁 Grouping Data
Click any grouping button:
- **No Grouping** - Standard table
- **By Offer Name** - Group by offer
- **By Status** - Group by status
- **By Priority** - Group by priority
- **By Associate** - Group by assigned person
- And more...

### ✏️ Editing & Adding Notes

**Click any row to open the detail modal:**

1. **View Read-Only Info** (top section):
   - Offer Name
   - Description
   - Applicable On
   - Ideal For
   - Suggested Quantity

2. **Edit Annotations** (bottom section):
   - Set **Status**: Active, Pending, Completed, Cancelled
   - Set **Priority**: High, Medium, Low
   - Assign **Associate Name**
   - Set **Follow-up Date**
   - Add **Comments**
   - Add **Remarks**
   - Add **Tags** (multiple)

3. Click **"Save Changes"** to persist to Google Sheets

### 🎨 Column Visibility
- Find checkboxes above the table
- Toggle any column on/off
- Changes apply immediately

### 📈 Page Size
- Bottom of table: select 10, 25, 50, or 100 rows per page

## Understanding the Data

### 🔒 Read-Only (from Expirations sheet)
- Offer Name
- Description
- Applicable On
- Ideal For
- Suggested Quantity

### ✍️ Your Editable Fields (saved to Notes sheet)
- Status
- Priority
- Associate Name
- Follow-up Date
- Comments
- Remarks
- Tags
- Timestamps

## 🎯 Sample Data Loaded

You should see these 7 offers:

1. **12 for 10 Deal** - 12-Class Pack (Qty: 4)
2. **Golden Unlimited** - 1-Month Unlimited (Qty: 3)
3. **Annual Bonus Month** - Annual Unlimited (Qty: 2)
4. **Flat 15% Off** - 8-Class & above (Qty: 8)
5. **6-Month Unlimited – Double Freezes** - 6-Month Unlimited (Qty: 3)
6. **Festive 5-Pack** - 5-Class Pack (Qty: 5)
7. **Lucky Draw: Grand Golden Month** - 1-Month Unlimited (Qty: 1)

## 🎨 Badge Colors

### Status Badges
- 🟢 **Active** = Green
- 🟡 **Pending** = Yellow
- 🔵 **Completed** = Blue
- 🔴 **Cancelled** = Red

### Priority Badges
- 🔴 **High** = Red
- 🟡 **Medium** = Yellow
- 🔵 **Low** = Blue

## 💡 Pro Tips

1. **Keyboard Navigation**: Use arrow keys in modals
2. **Tag Entry**: Press Enter after typing a tag to add it
3. **Quick Refresh**: Use the refresh button to sync latest data
4. **Filter Badge**: Shows number of active filters
5. **Mobile Friendly**: Works great on phones and tablets

## 🔄 Data Sync

- **Expirations Sheet**: Refreshes every 15 minutes (external)
- **Notes Sheet**: Updates immediately when you save
- **Your Notes**: Never lost, even when Expirations refreshes
- **Click Refresh**: To get latest data anytime

## 🎯 Common Workflows

### Assign an Expiration
1. Click row
2. Set Associate Name
3. Set Follow-up Date
4. Set Priority
5. Add Comments
6. Save

### Track Progress
1. Set Status to "Active"
2. Add progress comments
3. Update remarks as needed
4. Change status to "Completed" when done

### Organize with Tags
1. Add tags like "Urgent", "Marketing", "Sales"
2. Use filter to find all items with specific tags

### Generate Reports
1. Group by Status to see workflow stages
2. Group by Associate to see workload
3. Group by Priority to focus efforts

## 🆘 Troubleshooting

### Data Not Loading?
- Click "Refresh Data"
- Check browser console (F12)
- Verify spreadsheet ID in config

### Can't Save Notes?
- Click "Init Notes Sheet" first
- Check spreadsheet permissions
- Verify OAuth credentials

### Filter Not Working?
- Click "Apply Filters" after setting criteria
- Check that you have data matching filters

## 🚀 You're All Set!

Start by:
1. Clicking a row to explore the detail modal
2. Adding some notes and tags
3. Trying different groupings
4. Experimenting with filters

Enjoy your new Expirations Manager! 🎉

---

**Need Help?** Check:
- `README.md` - Full documentation
- `PROJECT_SUMMARY.md` - Technical details
- Console (F12) - Error messages
