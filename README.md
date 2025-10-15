# Expirations Manager 2025 🎯

A modern, feature-rich web application for tracking and managing membership expirations with Google Sheets integration. Built with React, TypeScript, and Tailwind CSS.

![React](https://img.shields.io/badge/React-18.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Vite](https://img.shields.io/badge/Vite-5.0-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan)

## ✨ Features

### Core Functionality
- 📊 **Google Sheets Integration** - Direct sync with Google Sheets for real-time data
- 🔍 **Advanced Search** - Real-time search by name, email, membership, or member ID
- 📅 **Period Filters** - Quick filters for expirations in next 7, 30, or 90 days
- 🏢 **Location Tabs** - Filter by different office locations
- 📝 **Detailed Member Profiles** - Comprehensive view with follow-ups, notes, and remarks
- 🎨 **Modern UI** - Beautiful gradients, smooth animations, and professional design
- ⚡ **Auto-Priority** - Automatic priority calculation based on expiration dates
- 🔄 **Real-time Updates** - Live data synchronization with Google Sheets

### User Experience
- 🎯 **Smart Filtering** - Combine multiple filters (location, date range, priority, tags)
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🌈 **Visual Indicators** - Color-coded badges for status, priority, and membership
- 💾 **Auto-save** - Automatic saving of notes and follow-ups
- 🔔 **Visual Feedback** - Loading states, error messages, and success confirmations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Google Cloud Project with Sheets API enabled
- Google OAuth 2.0 credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Jimmeey2323/expirations-manager-2025.git
   cd expirations-manager-2025
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your credentials:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_client_id_here
   VITE_GOOGLE_CLIENT_SECRET=your_client_secret_here
   VITE_GOOGLE_REFRESH_TOKEN=your_refresh_token_here
   VITE_SPREADSHEET_ID=your_spreadsheet_id_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Google Sheets Setup

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Sheets API**

### Step 2: Create OAuth 2.0 Credentials
1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Choose **Web application**
4. Add authorized redirect URIs:
   - `http://localhost:3000`
   - Your production URL (if applicable)
5. Download the credentials JSON

### Step 3: Get Refresh Token
1. Use the OAuth 2.0 Playground or a script to get a refresh token
2. Add the refresh token to your `.env` file

### Step 4: Prepare Your Spreadsheet
Your Google Sheet should have two sheets:

**Expirations Sheet** (columns A-P):
- A: Unique ID
- B: First Name
- C: Last Name
- D: Email
- E: Phone
- F: Home Location
- G: Membership Name
- H: Member ID
- I: Start Date
- J: End Date
- K: Order At
- L: Service Tax
- M: Total Amount
- N: Membership Value
- O: Status
- P: Associate Name

**Notes Sheet**:
- Automatically created for storing follow-ups and notes

## 📁 Project Structure

```
expirations-manager-2025/
├── src/
│   ├── components/         # React components
│   ├── config/            # Configuration files
│   ├── constants/         # App constants
│   ├── services/          # API services
│   ├── store/             # State management
│   ├── types/             # TypeScript types
│   ├── utils/             # Utility functions
│   └── App.tsx            # Main app component
├── .env.example           # Environment variables template
├── package.json           # Dependencies
└── README.md             # This file
```

## 🎨 Features in Detail

### Search & Filtering
- **Real-time Search**: Instantly filter by name, email, membership, or member ID
- **Period Filters**: Quick access to expirations in 7, 30, or 90 days
- **Location Tabs**: Filter by Kenkere House, Kwality House, Supreme HQ, or All
- **Advanced Filters**: Date ranges, priorities, stages, statuses, associates, and tags
- **Group By**: Organize data by priority, status, or location

### Member Management
- **Detailed Profiles**: View complete member information
- **Follow-up Tracking**: Record and view all follow-up conversations
- **Notes System**: Add internal notes and public remarks
- **Tag Organization**: Categorize members with custom tags
- **Status Tracking**: Monitor payment status and membership stages

### Priority System
- 🔴 **High Priority**: Expires in < 30 days
- 🟡 **Medium Priority**: Expires in 31-90 days
- 🟢 **Low Priority**: Expires in > 90 days

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.2
- **Language**: TypeScript 5.3
- **Build Tool**: Vite 5.0
- **Styling**: Tailwind CSS 3.4
- **State Management**: Zustand 4.5
- **Date Handling**: date-fns 3.3
- **Icons**: Lucide React 0.344
- **API**: Google Sheets API v4

## 📝 Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run deploy           # Deploy to Vercel (production)
npm run deploy:preview   # Deploy to Vercel (preview)
```

## 🚀 Deployment

This app is optimized for deployment on **Vercel** with advanced configurations.

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Jimmeey2323/expirations-manager-2025)

**Or follow the detailed guide**: See [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) for comprehensive deployment instructions.

### Deployment Features
- ✅ Automatic deployments on Git push
- ✅ Preview deployments for pull requests
- ✅ Edge network distribution
- ✅ Optimized build configuration
- ✅ Environment variable management
- ✅ SSL/HTTPS by default
- ✅ Mumbai region (BOM1) optimization

### Prerequisites for Deployment
1. Vercel account (free tier available)
2. GitHub repository (already set up)
3. Environment variables configured
4. Google OAuth credentials

See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for a complete pre-deployment checklist.

## 📞 Support

For support, please contact the development team or open an issue in the repository.

---

Made with ❤️ by Jimmeey