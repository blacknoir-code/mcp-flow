# Vercel Deployment Guide

This guide will help you deploy the MCP Browser application to Vercel.

## Prerequisites

1. A GitHub account with your code pushed to a repository
2. A Vercel account (sign up at [vercel.com](https://vercel.com))

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Import Project**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your GitHub repository
   - Click "Import"

2. **Configure Project**
   - Vercel will auto-detect the Vite framework
   - The following settings are pre-configured in `vercel.json`:
     - **Framework Preset**: Vite
     - **Build Command**: `bun run build`
     - **Output Directory**: `dist`
     - **Install Command**: `bun install`

3. **Environment Variables** (Optional)
   - If you need a custom base path, add:
     - `VITE_BASE_PATH` = `/` (or your desired path)
   - For most deployments, you can leave this empty (defaults to `/`)

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   # or
   bun add -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Production Deploy**
   ```bash
   vercel --prod
   ```

## Configuration Files

### `vercel.json`
This file contains the Vercel deployment configuration:
- **Build settings**: Uses Bun for installation and building
- **SPA routing**: All routes are rewritten to `/index.html` for client-side routing
- **Caching**: Static assets are cached for optimal performance

### `vite.config.ts`
- Base path is set to `/` by default (perfect for Vercel)
- Can be customized with `VITE_BASE_PATH` environment variable

## Important Notes

1. **Package Manager**: This project uses Bun. Vercel will automatically detect and use Bun if available, otherwise it will fall back to npm.

2. **SPA Routing**: The `vercel.json` includes rewrites to ensure all routes serve `index.html`, which is required for React Router to work correctly.

3. **Environment Variables**: 
   - Set `VITE_BASE_PATH` only if deploying to a subdirectory
   - For root domain deployment (most common), leave it empty

4. **Build Output**: The build output goes to the `dist` directory, which is configured in both `vite.config.ts` and `vercel.json`.

## Troubleshooting

### Build Fails
- Check that all dependencies are listed in `package.json`
- Ensure Bun is available or Vercel can use npm as fallback
- Check build logs in Vercel dashboard

### Routes Not Working
- Verify `vercel.json` has the rewrites configuration
- Ensure `vite.config.ts` base path matches your deployment path

### Assets Not Loading
- Check that `VITE_BASE_PATH` is set correctly
- Verify asset paths in the built `dist/index.html`

## Custom Domain

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Continuous Deployment

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every push to other branches and pull requests

## Support

For more information, visit:
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

