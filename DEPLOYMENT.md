# MCP Flow - Deployment Guide

This document provides comprehensive deployment instructions for MCP Flow across different platforms.

---

## Table of Contents

1. [GitHub Pages Deployment](#github-pages-deployment)
2. [Local Development](#local-development)
3. [Production Build](#production-build)
4. [Docker Deployment](#docker-deployment)
5. [Environment Variables](#environment-variables)
6. [CI/CD Pipeline](#cicd-pipeline)
7. [Troubleshooting](#troubleshooting)

---

## GitHub Pages Deployment

### Automatic Deployment

MCP Flow includes an automated GitHub Actions workflow for deploying to GitHub Pages.

**Setup Instructions:**

1. **Repository Settings**
   - Go to repository **Settings** → **Pages**
   - Ensure **GitHub Actions** is selected as the deployment source
   - The source branch should be set to `main`

2. **Automatic Deployment**
   - Every push to the `main` branch triggers the deployment workflow
   - The workflow automatically builds and deploys the app to GitHub Pages
   - Access your deployed app at: `https://[username].github.io/mcp-flow`

3. **Manual Trigger**
   - Go to **Actions** tab
   - Select **Deploy to GitHub Pages** workflow
   - Click **Run workflow** and select the `main` branch

### Workflow Details

The GitHub Actions workflow (`.github/workflows/jekyll-gh-pages.yml`):

```yaml
name: Deploy to GitHub Pages
```

**Build Steps:**
1. Checks out the code
2. Sets up Node.js 18
3. Installs npm dependencies with caching
4. Runs ESLint for code quality
5. Builds the production bundle
6. Uploads artifacts to GitHub Pages

**Build Environment Variables:**
```
VITE_BASE_URL=/mcp-flow/
```

This ensures all assets are correctly referenced when deployed to a subdirectory.

### Deployment URL

Once deployed, your application will be accessible at:
```
https://blacknoir-code.github.io/mcp-flow/
```

---

## Local Development

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, pnpm, or Bun

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/blacknoir-code/mcp-flow.git
   cd mcp-flow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open http://localhost:8080 in your browser
   - Changes will hot-reload automatically

### Development Commands

```bash
# Start dev server with hot reload
npm run dev

# Run code quality checks
npm run lint

# Fix linting issues automatically
npm run lint -- --fix

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## Production Build

### Building for GitHub Pages

```bash
# Build with GitHub Pages base URL
VITE_BASE_URL=/mcp-flow/ npm run build
```

### Building for Root Deployment

If deploying to a domain root (e.g., `example.com`):

```bash
# Build for root deployment
npm run build
```

### Build Output

The production build generates:
- `dist/` - Optimized production bundle
- `dist/index.html` - Main entry point
- `dist/assets/` - JavaScript, CSS, and image assets

### Build Optimization

The `vite.config.ts` includes optimizations:

```typescript
build: {
  outDir: "dist",
  sourcemap: false,
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ["react", "react-dom", "react-router-dom"],
      },
    },
  },
}
```

**Optimizations:**
- Code splitting for better caching
- Vendor bundle separated for better versioning
- Source maps disabled for smaller bundle size

### Bundle Size

Expected bundle sizes:
- Main bundle: ~150KB (gzipped)
- Vendor bundle: ~200KB (gzipped)
- Total: ~350KB (gzipped)

---

## Docker Deployment

### Build Docker Image

Create a `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist /app/dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

### Build and Run

```bash
# Build the image
docker build -t mcp-flow:latest .

# Run the container
docker run -p 3000:3000 mcp-flow:latest

# Access the application
# Open http://localhost:3000 in your browser
```

### Docker Compose (Optional)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  mcp-flow:
    build: .
    ports:
      - "3000:3000"
    environment:
      - VITE_BASE_URL=/
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

Run with Docker Compose:
```bash
docker-compose up -d
```

---

## Environment Variables

### Build-Time Variables

Variables prefixed with `VITE_` are embedded during build time.

#### Available Variables

| Variable | Purpose | Default | Example |
|----------|---------|---------|---------|
| `VITE_BASE_URL` | Base URL for asset paths | `/` | `/mcp-flow/` |
| `VITE_API_URL` | Backend API endpoint | `` | `https://api.example.com` |
| `VITE_MCP_SERVER_URL` | MCP Server endpoint | `` | `http://localhost:5000` |

### Setting Environment Variables

**For local development** (`.env.local`):
```env
VITE_BASE_URL=/
VITE_API_URL=http://localhost:3001
VITE_MCP_SERVER_URL=http://localhost:5000
```

**For production** (`.env.production`):
```env
VITE_BASE_URL=/mcp-flow/
VITE_API_URL=https://api.production.com
VITE_MCP_SERVER_URL=https://mcp.production.com
```

**For GitHub Actions deployment**:
- Set in `VITE_BASE_URL: /mcp-flow/` in the workflow file
- Or in GitHub Secrets and reference in workflow

### Runtime Configuration

For runtime-only configuration (not embedded in build):

1. Create `public/config.json`:
```json
{
  "apiUrl": "https://api.example.com",
  "mcpServerUrl": "https://mcp.example.com"
}
```

2. Load in your app:
```typescript
const config = await fetch('/config.json').then(r => r.json())
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

The workflow file: `.github/workflows/jekyll-gh-pages.yml`

**Triggers:**
- Push to `main` branch
- Manual workflow dispatch from Actions tab

**Jobs:**

1. **Build Job**
   - Runs on Ubuntu latest
   - Checks out code
   - Sets up Node.js with caching
   - Installs dependencies
   - Runs linter
   - Builds production bundle
   - Uploads to Pages

2. **Deploy Job**
   - Depends on successful build
   - Deploys to GitHub Pages environment
   - Provides deployment URL

### Workflow Duration

Expected times:
- Install dependencies: ~30s
- Linting: ~10s
- Build: ~15s
- Upload: ~5s
- Total: ~1-2 minutes

### View Workflow Runs

1. Go to repository **Actions** tab
2. Select **Deploy to GitHub Pages** workflow
3. View run history and logs

---

## Troubleshooting

### Build Failures

#### Issue: Dependencies not installing

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lockfile
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

#### Issue: Type errors during build

**Solution:**
```bash
# Check TypeScript
npx tsc --noEmit

# Fix issues based on output
```

### Deployment Issues

#### Issue: 404 errors on GitHub Pages

**Cause:** Incorrect `base` URL in Vite config

**Solution:**
```bash
# Ensure base URL matches repository name
VITE_BASE_URL=/mcp-flow/ npm run build
```

#### Issue: Assets returning 404

**Cause:** Base path not configured correctly

**Solution:**
1. Check `vite.config.ts` has `base: process.env.VITE_BASE_URL || "/"`
2. Verify deployment path in workflow
3. Clear browser cache (Ctrl+Shift+Delete)

### Performance Issues

#### Issue: Slow page load

**Solutions:**
1. Check bundle size:
   ```bash
   npm run build -- --report
   ```

2. Optimize large imports:
   - Use code splitting
   - Lazy load routes

3. Enable compression:
   ```bash
   # nginx
   gzip on;
   gzip_types text/plain text/css text/javascript application/javascript;
   ```

### Runtime Errors

#### Issue: Router not working on GitHub Pages

**Cause:** Routing issues with client-side routing

**Solution:**
React Router should work with hash router for GitHub Pages, or ensure proper configuration in `App.tsx`

#### Issue: 403 Forbidden error

**Solution:**
1. Check repository is public
2. Verify GitHub Pages settings
3. Check branch is `main` (or configured branch)

---

## Monitoring & Debugging

### Check Deployment Status

```bash
# View GitHub Actions logs
gh run list --workflow jekyll-gh-pages.yml

# View specific run
gh run view [run-id]
```

### Local Build Testing

```bash
# Build locally
npm run build

# Serve built files
npm run preview

# Test in browser
open http://localhost:4173
```

### Bundle Analysis

```bash
# Install analyzer (if needed)
npm install --save-dev rollup-plugin-analyze

# Check bundle composition
npm run build -- --analyze
```

---

## Post-Deployment Checklist

- [ ] Verify app loads at deployment URL
- [ ] Test all routes navigate correctly
- [ ] Check responsive design (mobile, tablet, desktop)
- [ ] Test integrations (if applicable)
- [ ] Verify build took < 3 minutes
- [ ] No console errors in browser DevTools
- [ ] Lighthouse score > 80
- [ ] Performance is acceptable (< 3s load time)

---

## Support

For issues or questions:

1. Check GitHub Issues: https://github.com/blacknoir-code/mcp-flow/issues
2. Review Deployment Guide troubleshooting section
3. Check GitHub Actions workflow logs
4. Review Vite deployment docs: https://vitejs.dev/guide/static-deploy.html

---

## Related Documentation

- [README.md](README.md) - Project overview
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Docker Documentation](https://docs.docker.com/)

