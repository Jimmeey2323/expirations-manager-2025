# Deployment Checklist ✅

Use this checklist before deploying to Vercel.

## Pre-Deployment Tasks

### 1. Code Quality
- [ ] All TypeScript errors resolved
- [ ] No console errors in browser
- [ ] ESLint warnings addressed
- [ ] Code formatted and clean

### 2. Testing
- [ ] All features tested locally
- [ ] Search functionality works
- [ ] Filters work correctly
- [ ] Period filters (7/30/90 days) functional
- [ ] Location tabs switch properly
- [ ] Detail modal opens and closes
- [ ] Notes save successfully
- [ ] Follow-ups add correctly
- [ ] Data loads from Google Sheets

### 3. Environment Variables
- [ ] `.env` file exists locally
- [ ] All 4 variables set:
  - [ ] `VITE_GOOGLE_CLIENT_ID`
  - [ ] `VITE_GOOGLE_CLIENT_SECRET`
  - [ ] `VITE_GOOGLE_REFRESH_TOKEN`
  - [ ] `VITE_SPREADSHEET_ID`
- [ ] `.env` is in `.gitignore`
- [ ] `.env.example` is committed

### 4. Build Verification
- [ ] Run `npm run build` successfully
- [ ] No build errors
- [ ] Bundle size acceptable (<500KB recommended)
- [ ] Run `npm run preview` to test production build

### 5. Git Repository
- [ ] All changes committed
- [ ] Pushed to GitHub main branch
- [ ] No sensitive data in commits
- [ ] Repository is accessible

## Vercel Setup

### 6. Vercel Account
- [ ] Vercel account created
- [ ] GitHub connected to Vercel
- [ ] Billing set up (if needed)

### 7. Project Configuration
- [ ] Project imported from GitHub
- [ ] Framework preset set to "Vite"
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Install command: `npm install`

### 8. Environment Variables in Vercel
Add these in Vercel Dashboard → Project Settings → Environment Variables:

- [ ] `VITE_GOOGLE_CLIENT_ID` (Production)
- [ ] `VITE_GOOGLE_CLIENT_SECRET` (Production)
- [ ] `VITE_GOOGLE_REFRESH_TOKEN` (Production)
- [ ] `VITE_SPREADSHEET_ID` (Production)

Optional: Also add for Preview and Development environments

### 9. Advanced Settings
- [ ] Region set to Mumbai (BOM1) or closest to users
- [ ] Node.js version: 18.x (auto-detected)
- [ ] `vercel.json` committed and configured

## Deployment

### 10. Initial Deploy
- [ ] Click "Deploy" in Vercel Dashboard
- [ ] Wait for build to complete
- [ ] Check build logs for errors
- [ ] Deployment successful

### 11. Post-Deployment Verification
- [ ] Visit deployment URL
- [ ] App loads correctly
- [ ] No console errors
- [ ] Google Sheets data appears
- [ ] Search works
- [ ] All filters functional
- [ ] Modal interactions work
- [ ] Notes can be saved
- [ ] Follow-ups can be added
- [ ] Test on mobile device
- [ ] Test on different browsers

### 12. Google OAuth Setup
- [ ] Add Vercel URL to Google OAuth authorized origins:
  ```
  https://your-app-name.vercel.app
  ```
- [ ] Add to authorized redirect URIs (if needed)
- [ ] Test OAuth flow works

### 13. Performance Check
- [ ] Run Lighthouse audit (90+ score recommended)
- [ ] Check Core Web Vitals
- [ ] Page loads in <3 seconds
- [ ] No layout shifts
- [ ] Images optimized

## Optional Enhancements

### 14. Custom Domain (Optional)
- [ ] Domain purchased
- [ ] DNS configured
- [ ] Domain added in Vercel
- [ ] SSL certificate active
- [ ] Domain redirects properly

### 15. Monitoring (Optional)
- [ ] Vercel Analytics enabled
- [ ] Speed Insights installed
- [ ] Error tracking set up

### 16. CI/CD (Automatic)
- [ ] Auto-deploy on push to main
- [ ] Preview deploys on PRs
- [ ] Build notifications configured

## Troubleshooting

### If Build Fails:
1. Check build logs in Vercel
2. Verify all dependencies in package.json
3. Test `npm run build` locally
4. Check for TypeScript errors

### If Environment Variables Don't Work:
1. Verify they're set in Production environment
2. Redeploy after adding variables
3. Check variable names match exactly (case-sensitive)

### If Google Sheets API Fails:
1. Verify OAuth credentials are correct
2. Check refresh token is valid
3. Add Vercel URL to authorized origins
4. Verify Sheets API is enabled

## Success Criteria ✅

Your deployment is successful when:
- ✅ App is accessible at Vercel URL
- ✅ All features work as expected
- ✅ Data loads from Google Sheets
- ✅ No console errors
- ✅ Mobile responsive
- ✅ Fast load times (<3s)
- ✅ Lighthouse score 90+

## Rollback Plan

If something goes wrong:
1. Go to Vercel Dashboard → Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"
4. Fix issues locally
5. Redeploy when ready

---

## Quick Deploy Commands

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs
```

---

**Ready to deploy?** Follow VERCEL_DEPLOY.md for detailed instructions!
