[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Jimmeey2323/expirations-manager-2025)

# 🚀 Quick Deploy to Vercel

Deploy your Expirations Manager 2025 in under 5 minutes!

## Method 1: One-Click Deploy (Fastest)

1. Click the "Deploy with Vercel" button above
2. Sign in to Vercel (or create a free account)
3. Click "Create" to import the repository
4. **Add Environment Variables** before deploying:
   ```
   VITE_GOOGLE_CLIENT_ID=your_client_id
   VITE_GOOGLE_CLIENT_SECRET=your_client_secret
   VITE_GOOGLE_REFRESH_TOKEN=your_refresh_token
   VITE_SPREADSHEET_ID=your_spreadsheet_id
   ```
5. Click "Deploy"
6. Wait 2-3 minutes for build to complete
7. Your app is live! 🎉

## Method 2: Vercel Dashboard (Recommended)

### Step 1: Import Project
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select `Jimmeey2323/expirations-manager-2025`
4. Click "Import"

### Step 2: Configure
The settings are auto-detected from `vercel.json`:
- ✅ Framework: Vite
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `dist`
- ✅ Region: Mumbai (BOM1)

### Step 3: Add Environment Variables
Click "Environment Variables" and add these 4 variables:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_GOOGLE_CLIENT_ID` | Your Google OAuth Client ID | Production, Preview, Development |
| `VITE_GOOGLE_CLIENT_SECRET` | Your Google OAuth Client Secret | Production, Preview, Development |
| `VITE_GOOGLE_REFRESH_TOKEN` | Your Google OAuth Refresh Token | Production, Preview, Development |
| `VITE_SPREADSHEET_ID` | Your Google Spreadsheet ID | Production, Preview, Development |

### Step 4: Deploy
1. Click "Deploy"
2. Wait for the build (usually 2-3 minutes)
3. Click on the deployment URL to view your app

## Method 3: Vercel CLI (For Developers)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to project
cd /path/to/expirations-manager-2025

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? [Select your account]
# - Link to existing project? N
# - Project name? expirations-manager-2025
# - Directory? ./
# - Override settings? N

# Add environment variables
vercel env add VITE_GOOGLE_CLIENT_ID
# Paste your value when prompted, select all environments

vercel env add VITE_GOOGLE_CLIENT_SECRET
# Paste your value when prompted, select all environments

vercel env add VITE_GOOGLE_REFRESH_TOKEN
# Paste your value when prompted, select all environments

vercel env add VITE_SPREADSHEET_ID
# Paste your value when prompted, select all environments

# Deploy to production
vercel --prod
```

## Post-Deployment Steps

### 1. Update Google OAuth Settings
Add your Vercel URL to Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** > **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Add to **Authorized JavaScript origins**:
   ```
   https://your-project-name.vercel.app
   ```
5. Add to **Authorized redirect URIs** (if needed):
   ```
   https://your-project-name.vercel.app
   ```
6. Click "Save"

### 2. Test Your Deployment
Visit your Vercel URL and verify:
- ✅ App loads without errors
- ✅ Google Sheets data appears
- ✅ Search works
- ✅ Filters function correctly
- ✅ Detail modal opens
- ✅ Notes can be saved

### 3. Set Up Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS as instructed
4. Update Google OAuth with your custom domain

## Automatic Deployments

Once connected, Vercel automatically deploys:
- **Push to `main`** → Production deployment
- **Pull Request** → Preview deployment
- **Push to branch** → Preview deployment

## Useful Commands

```bash
# View deployment logs
vercel logs

# List all deployments
vercel list

# Promote preview to production
vercel promote [deployment-url]

# Remove a deployment
vercel remove [deployment-url]

# Open project dashboard
vercel open
```

## Troubleshooting

### Build Failed
- Check build logs in Vercel dashboard
- Verify all dependencies are in package.json
- Test `npm run build` locally first

### Environment Variables Not Working
- Ensure all 4 variables are set
- Verify they're added for "Production" environment
- Redeploy after adding variables

### Google Sheets Not Loading
- Verify OAuth credentials are correct
- Check refresh token is valid
- Add Vercel URL to authorized origins in Google Console
- Ensure Sheets API is enabled

### App Shows White Screen
- Check browser console for errors
- Verify environment variables are set
- Check network tab for API failures

## Performance Tips

Your app is already optimized with:
- ✅ Code splitting and lazy loading
- ✅ Asset caching (1 year for static files)
- ✅ Minification and compression
- ✅ Mumbai region for Indian users
- ✅ CDN distribution

Expected Lighthouse scores:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

## Support

- **Detailed Guide**: See [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)
- **Checklist**: See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- **Vercel Docs**: https://vercel.com/docs
- **Issues**: https://github.com/Jimmeey2323/expirations-manager-2025/issues

---

**Your app will be live at**: `https://your-project-name.vercel.app`

Happy deploying! 🚀
