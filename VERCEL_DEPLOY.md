# Vercel Deployment Guide 🚀

This guide will help you deploy the Expirations Manager 2025 app to Vercel with optimal configurations.

## 📋 Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository** - Already set up at https://github.com/Jimmeey2323/expirations-manager-2025
3. **Environment Variables** - Your Google OAuth credentials

## 🚀 Quick Deploy (Recommended)

### Option 1: Deploy via Vercel Dashboard

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"

2. **Connect GitHub Repository**
   - Select "Import Git Repository"
   - Choose `Jimmeey2323/expirations-manager-2025`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Add Environment Variables**
   
   Click "Environment Variables" and add:
   
   ```
   VITE_GOOGLE_CLIENT_ID = your_client_id_here
   VITE_GOOGLE_CLIENT_SECRET = your_client_secret_here
   VITE_GOOGLE_REFRESH_TOKEN = your_refresh_token_here
   VITE_SPREADSHEET_ID = your_spreadsheet_id_here
   ```
   
   **Important**: Add these for all environments (Production, Preview, Development)

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (~2-3 minutes)
   - Your app will be live at `https://your-project-name.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from Project Directory**
   ```bash
   cd /Users/jimmeeygondaa/Expirations-Manager-2025
   vercel
   ```

4. **Follow the Prompts**
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - What's your project's name? `expirations-manager-2025`
   - In which directory is your code located? `./`
   - Want to override settings? **N**

5. **Add Environment Variables**
   ```bash
   vercel env add VITE_GOOGLE_CLIENT_ID
   # Paste your client ID when prompted
   
   vercel env add VITE_GOOGLE_CLIENT_SECRET
   # Paste your client secret when prompted
   
   vercel env add VITE_GOOGLE_REFRESH_TOKEN
   # Paste your refresh token when prompted
   
   vercel env add VITE_SPREADSHEET_ID
   # Paste your spreadsheet ID when prompted
   ```

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## ⚙️ Advanced Configuration Features

### 1. Performance Optimizations

Our `vercel.json` includes:

- ✅ **Smart Caching**: Static assets cached for 1 year
- ✅ **Mumbai Region (BOM1)**: Optimized for Indian users
- ✅ **SPA Routing**: Proper rewrites for client-side routing
- ✅ **Asset Optimization**: Automatic compression and minification

### 2. Build Configuration

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
```

### 3. Caching Strategy

- **Static Assets**: Cached for 1 year (immutable)
- **HTML**: No cache (always fresh)
- **API Calls**: Client-side (no server caching needed)

### 4. Environment Variables Security

- Stored securely in Vercel's encrypted vault
- Never exposed in client-side code
- Accessible during build time via `import.meta.env`

## 🌍 Custom Domain Setup (Optional)

1. **Go to Project Settings**
   - Select your project in Vercel Dashboard
   - Go to "Settings" → "Domains"

2. **Add Custom Domain**
   - Click "Add"
   - Enter your domain (e.g., `expirations.yourdomain.com`)
   - Follow DNS configuration instructions

3. **Update Google OAuth**
   - Add your custom domain to authorized redirect URIs
   - In Google Cloud Console → APIs & Services → Credentials

## 🔄 Automatic Deployments

Vercel automatically deploys when you push to GitHub:

- **Push to `main`** → Production deployment
- **Push to other branches** → Preview deployment
- **Pull Requests** → Automatic preview URLs

## 📊 Post-Deployment Checklist

After deployment, verify:

- ✅ App loads correctly
- ✅ Google Sheets data is fetched
- ✅ Search functionality works
- ✅ Filters are functional
- ✅ Detail modal opens
- ✅ Notes can be saved
- ✅ All environment variables are set

## 🔍 Monitoring & Analytics

### Enable Vercel Analytics

1. Go to your project dashboard
2. Click "Analytics" tab
3. Enable "Vercel Analytics"
4. Get real-time performance metrics

### Enable Vercel Speed Insights

1. Install the package:
   ```bash
   npm install @vercel/speed-insights
   ```

2. Add to your `src/main.tsx`:
   ```typescript
   import { SpeedInsights } from '@vercel/speed-insights/react';
   
   // Add <SpeedInsights /> to your root component
   ```

3. Commit and push to deploy

## 🐛 Troubleshooting

### Build Fails

**Problem**: Build command fails
**Solution**: Check build logs in Vercel dashboard, ensure all dependencies are in `package.json`

### Environment Variables Not Working

**Problem**: API calls fail, credentials not found
**Solution**: 
- Verify all 4 environment variables are set
- Ensure they're added for Production environment
- Redeploy after adding variables

### White Screen / 404 Errors

**Problem**: Routes not working
**Solution**: The `vercel.json` rewrites are configured to handle SPA routing

### Google Sheets API Errors

**Problem**: CORS or authentication errors
**Solution**: 
- Add Vercel URL to Google OAuth authorized origins
- Verify refresh token is valid

## 🔒 Security Best Practices

1. ✅ **Environment Variables**: All secrets in Vercel environment variables
2. ✅ **HTTPS**: Automatic SSL/TLS encryption
3. ✅ **Git Ignored**: `.env` file never committed
4. ✅ **Access Control**: Only authorized users can access Vercel project

## 📈 Performance Metrics

Expected performance:

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Lighthouse Score**: 90+
- **Core Web Vitals**: All green

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Documentation**: https://vercel.com/docs
- **Your Repository**: https://github.com/Jimmeey2323/expirations-manager-2025
- **Support**: https://vercel.com/support

## 🎯 Next Steps After Deployment

1. **Share the URL** with your team
2. **Set up custom domain** (if needed)
3. **Enable analytics** for monitoring
4. **Configure webhooks** for notifications (optional)
5. **Set up preview deployments** for staging

---

## 📝 Quick Reference Commands

```bash
# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# List deployments
vercel list

# Remove deployment
vercel remove [deployment-url]

# Open project in browser
vercel open
```

---

**Your app will be live at**: `https://expirations-manager-2025.vercel.app` (or your custom domain)

Enjoy your lightning-fast, globally distributed Expirations Manager! ⚡️
