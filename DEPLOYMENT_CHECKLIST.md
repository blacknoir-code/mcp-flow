# MCP Flow - GitHub Pages Deployment Checklist

## Pre-Deployment Verification

Use this checklist to verify the project is ready for deployment.

---

## ✅ Local Development Checklist

- [ ] Node.js 18+ installed
- [ ] Project dependencies installed (`npm install`)
- [ ] Development server runs (`npm run dev`)
- [ ] App accessible at http://localhost:8080
- [ ] Hot reload working (make a change, see it update)
- [ ] ESLint passes (`npm run lint`)
- [ ] No console errors in browser DevTools

**Verification Commands:**
```bash
node --version          # Should be 18+
npm install             # Install deps
npm run dev             # Start dev server
npm run lint            # Check for lint errors
npm run build           # Verify production build works
```

---

## ✅ Code Quality Checklist

- [ ] No console errors
- [ ] No console warnings (except third-party)
- [ ] ESLint passes without errors
- [ ] TypeScript compiles without errors
- [ ] All routes work correctly
- [ ] Responsive design verified (mobile, tablet, desktop)
- [ ] Dark/light mode works (if implemented)
- [ ] No broken links
- [ ] No unused imports
- [ ] No commented-out code

**Verification Commands:**
```bash
npm run lint                    # Check for lint errors
npx tsc --noEmit               # Check TypeScript errors
npm run build                  # Verify build succeeds
npm run preview                # Test production build
```

---

## ✅ Build Configuration Checklist

- [ ] `vite.config.ts` has `base: process.env.VITE_BASE_URL || "/"`
- [ ] Build environment variables configured
- [ ] Code splitting enabled for vendor/app
- [ ] Source maps disabled in production
- [ ] Output directory set to `dist/`
- [ ] Asset optimization configured

**Check vite.config.ts:**
```bash
cat vite.config.ts
# Should show:
# - base: process.env.VITE_BASE_URL || "/"
# - build.outDir: "dist"
# - code splitting configuration
```

---

## ✅ GitHub Actions Workflow Checklist

- [ ] Workflow file exists at `.github/workflows/jekyll-gh-pages.yml`
- [ ] Workflow triggers on `main` branch push
- [ ] Manual workflow dispatch enabled
- [ ] Node.js version set to 18
- [ ] npm cache enabled
- [ ] ESLint check included
- [ ] Build environment variables set: `VITE_BASE_URL=/mcp-flow/`
- [ ] Artifacts uploaded to Pages
- [ ] Deployment job configured

**Check Workflow File:**
```bash
cat .github/workflows/jekyll-gh-pages.yml
# Should include:
# - name: Deploy to GitHub Pages
# - Node.js 18 setup
# - VITE_BASE_URL=/mcp-flow/
# - Upload to pages artifact
```

---

## ✅ GitHub Repository Checklist

- [ ] Repository is **public**
- [ ] Default branch is `main`
- [ ] GitHub Pages enabled in repository settings
- [ ] GitHub Pages source: **GitHub Actions**
- [ ] GitHub Pages branch: **Not applicable (using Actions)**
- [ ] No pending merges to `main`
- [ ] Latest code pushed to `main`

**Setup GitHub Pages:**
1. Go to **Settings** → **Pages**
2. Verify **GitHub Actions** is selected as source
3. Click **Save** if changes made

---

## ✅ Pre-Deployment Commit Checklist

Before pushing to GitHub:

- [ ] All changes committed locally
- [ ] No uncommitted changes (`git status` is clean)
- [ ] Meaningful commit message written
- [ ] No sensitive data in commits
- [ ] All files formatted correctly
- [ ] `.gitignore` has `node_modules/`, `dist/`, `.env*`

**Verification Commands:**
```bash
git status                      # Should show "nothing to commit"
git log --oneline -5            # View last 5 commits
git diff                        # Check for uncommitted changes
```

---

## ✅ First-Time Deployment Steps

### Step 1: Verify Local Build
```bash
npm run build
# Expected output:
# - dist/ folder created
# - Build successful message
```

### Step 2: Preview Production Build
```bash
npm run preview
# Expected output:
# - Server running on http://localhost:4173
# - App works correctly
# - No console errors
```

### Step 3: Commit Changes
```bash
git add .
git commit -m "Initial deployment setup"
git push origin main
```

### Step 4: Monitor Deployment
1. Go to repository **Actions** tab
2. Watch **Deploy to GitHub Pages** workflow
3. Wait for ✅ Build Job to complete
4. Wait for ✅ Deploy Job to complete
5. Check deployment logs for errors

### Step 5: Verify Deployment
1. Once workflow completes, visit: `https://blacknoir-code.github.io/mcp-flow/`
2. Verify app loads
3. Test all routes
4. Check responsive design
5. Verify no console errors

---

## ✅ Deployment Troubleshooting Checklist

### If Build Fails

- [ ] Check workflow logs for error message
- [ ] Verify Node.js version compatibility
- [ ] Check for missing dependencies
- [ ] Verify TypeScript errors: `npx tsc --noEmit`
- [ ] Check linting errors: `npm run lint`
- [ ] Verify build works locally: `npm run build`

**Debug Build Locally:**
```bash
VITE_BASE_URL=/mcp-flow/ npm run build
# This simulates the GitHub Actions build
```

### If Deployment URL Shows 404

- [ ] Check GitHub Pages settings
- [ ] Verify repository is public
- [ ] Wait a few minutes (DNS propagation)
- [ ] Hard refresh browser: `Ctrl+Shift+R`
- [ ] Check repository name matches URL

**Verify URL:**
```
GitHub URL: https://github.com/blacknoir-code/mcp-flow
Pages URL: https://blacknoir-code.github.io/mcp-flow/
             ───────────────────────────────────────
             username              repository name
```

### If Assets Return 404

- [ ] Check `VITE_BASE_URL` environment variable
- [ ] Verify `vite.config.ts` base URL configuration
- [ ] Clear browser cache: `Ctrl+Shift+Delete`
- [ ] Check network tab in DevTools
- [ ] View page source to check asset paths

---

## ✅ Post-Deployment Verification

After deployment, verify everything works:

### Functionality Tests
- [ ] App loads without errors
- [ ] Dashboard displays correctly
- [ ] Navigation between pages works
- [ ] All pages load (Dashboard, Workflow, Templates, Integrations, Settings)
- [ ] Responsive design on mobile/tablet/desktop
- [ ] Forms work (if applicable)
- [ ] Buttons and interactive elements work

### Performance Tests
- [ ] Page load time < 3 seconds
- [ ] No console errors
- [ ] No console warnings (except third-party)
- [ ] Lighthouse score > 80

**Test Performance:**
1. Open: https://blacknoir-code.github.io/mcp-flow/
2. Open DevTools: F12
3. Go to **Lighthouse** tab
4. Run audit (Desktop and Mobile)
5. Check scores

### Browser Compatibility
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge

---

## ✅ Maintenance Checklist

After deployment, maintain the site:

### Regular Tasks (Weekly)
- [ ] Check GitHub Actions runs
- [ ] Monitor for any deployment failures
- [ ] Review error logs if failures occur

### Regular Tasks (Monthly)
- [ ] Update dependencies: `npm update`
- [ ] Check for security vulnerabilities: `npm audit`
- [ ] Review and merge any pull requests
- [ ] Update documentation if needed

**Check for Updates:**
```bash
npm update                      # Update dependencies
npm audit                       # Check for vulnerabilities
npm audit fix                   # Fix security issues automatically
```

### Maintenance Commands
```bash
# Check outdated packages
npm outdated

# Update specific package
npm install package-name@latest

# Update all packages
npm update

# Clean up unused packages
npm prune

# Verify integrity
npm audit
```

---

## ✅ Environment Variables Reference

### Build-Time Variables (in Vite config)
```bash
VITE_BASE_URL=/mcp-flow/
```

### GitHub Actions Environment
Configured in `.github/workflows/jekyll-gh-pages.yml`

### Access Variables in App
```typescript
// In TypeScript/React code
const baseUrl = import.meta.env.VITE_BASE_URL || '/'
```

---

## ✅ Rollback Procedure (If Needed)

If deployment causes issues:

### Option 1: Revert Last Commit
```bash
git revert HEAD
git push origin main
# Workflow will re-run and deploy previous version
```

### Option 2: Disable Workflow Temporarily
1. Go to repository **Actions** tab
2. Click on workflow **Deploy to GitHub Pages**
3. Click **...** menu → **Disable workflow**
4. Fix issues locally
5. Re-enable workflow and push fix

### Option 3: Force Redeployment
```bash
git commit --allow-empty -m "Redeploy"
git push origin main
# Or manually trigger from Actions tab
```

---

## ✅ Documentation Checklist

- [ ] README.md exists and is comprehensive
- [ ] QUICKSTART.md for new developers
- [ ] DEPLOYMENT.md for deployment details
- [ ] CODE_REVIEW.md for architecture
- [ ] PROJECT_SUMMARY.md for overview
- [ ] GitHub Pages URL documented
- [ ] Build commands documented
- [ ] Environment variables documented

---

## ✅ Security Checklist

- [ ] No sensitive data in code
- [ ] No API keys in repository
- [ ] `.gitignore` configured correctly
- [ ] Environment variables not hardcoded
- [ ] GitHub repository is public (for Pages)
- [ ] No vulnerabilities: `npm audit`
- [ ] Dependencies up to date

---

## ✅ Final Pre-Push Checklist

Before your final push to GitHub:

```bash
# 1. Check status
git status
# Expected: nothing to commit, working tree clean

# 2. Run linter
npm run lint
# Expected: No errors

# 3. Build for production
npm run build
# Expected: Build successful

# 4. Preview production build
npm run preview
# Open http://localhost:4173 and verify

# 5. Commit and push
git add .
git commit -m "Ready for GitHub Pages deployment"
git push origin main
```

---

## ✅ Deployment Success Indicators

After deployment, you should see:

- ✅ Green checkmark on workflow in Actions tab
- ✅ App loads at https://blacknoir-code.github.io/mcp-flow/
- ✅ All pages accessible
- ✅ No 404 errors
- ✅ Assets loaded correctly
- ✅ No console errors
- ✅ Responsive design works

---

## 📞 Need Help?

### Common Issues

| Issue | Solution |
|-------|----------|
| Build fails | Check workflow logs, verify `npm run build` locally |
| 404 error | Check GitHub Pages settings, verify repository is public |
| Assets 404 | Check `VITE_BASE_URL`, clear cache |
| Slow load | Check bundle size, optimize images |
| Workflow won't run | Enable GitHub Pages, check branch is `main` |

### Documentation References

- **Setup Issues**: See `QUICKSTART.md`
- **Deployment Issues**: See `DEPLOYMENT.md`
- **Architecture Questions**: See `CODE_REVIEW.md`
- **Build Issues**: See `vite.config.ts`
- **Workflow Issues**: See `.github/workflows/jekyll-gh-pages.yml`

---

## ✅ Deployment Complete!

Once all checks pass and deployment succeeds:

1. 🎉 App is live at: https://blacknoir-code.github.io/mcp-flow/
2. 📚 Documentation is comprehensive
3. 🔄 CI/CD pipeline is automated
4. 🚀 Ready for production usage

**Celebrate and monitor the first 24 hours for any issues!**

---

**Last Updated:** November 25, 2025  
**Status:** ✅ Ready for Deployment

