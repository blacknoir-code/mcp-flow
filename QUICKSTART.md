# MCP Flow - Quick Start Guide

Get up and running with MCP Flow in minutes!

---

## Prerequisites

- **Node.js** 18+ or **Bun** latest
- **Git** installed
- A GitHub account (optional, for deployment)

---

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/blacknoir-code/mcp-flow.git
cd mcp-flow
```

### 2. Install Dependencies
```bash
npm install
# OR
bun install
```

### 3. Start Development Server
```bash
npm run dev
```

You'll see:
```
Local:   http://localhost:8080/
```

Open this URL in your browser. The app will automatically reload when you make changes.

---

## Project Layout

```
mcp-flow/
├── src/
│   ├── pages/              # Pages (Dashboard, Workflow, Templates, etc.)
│   ├── components/         # Reusable components
│   │   └── ui/            # shadcn/ui components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities
│   ├── App.tsx            # Main app with routing
│   └── main.tsx           # Entry point
├── public/                # Static files
├── README.md              # Project documentation
├── package.json           # Dependencies
├── vite.config.ts         # Vite configuration
└── tailwind.config.ts     # Tailwind CSS config
```

---

## Common Tasks

### View All Pages

The app has 5 main pages accessible via navigation:

1. **Dashboard** (`/`)
   - Overview of recent workflows
   - Command bar for creating new workflows
   - Template showcase
   - Integration status

2. **Workflow Canvas** (`/workflow`)
   - Visual workflow editor
   - Step-by-step execution
   - Real-time monitoring

3. **Templates** (`/templates`)
   - Pre-built workflow templates
   - Searchable and filterable
   - One-click deployment

4. **Integrations** (`/integrations`)
   - MCP server status
   - Connected apps
   - Rate limit tracking

5. **Settings** (`/settings`)
   - User preferences
   - Configuration options

### Add a New Page

1. Create a component in `src/pages/NewPage.tsx`:
```tsx
export default function NewPage() {
  return (
    <div className="min-h-full container mx-auto px-6 py-8">
      <h1>New Page</h1>
    </div>
  )
}
```

2. Add route in `src/App.tsx`:
```tsx
<Route path="/new" element={<NewPage />} />
```

3. Add navigation link in your menu component

### Add a New Component

1. Create `src/components/MyComponent.tsx`:
```tsx
import { Button } from "@/components/ui/button"

export const MyComponent = () => {
  return (
    <div className="p-4">
      <Button>Click me</Button>
    </div>
  )
}
```

2. Import and use in a page:
```tsx
import { MyComponent } from "@/components/MyComponent"

export default function Dashboard() {
  return <MyComponent />
}
```

### Style Components with Tailwind

Use utility classes for styling:
```tsx
<div className="flex items-center gap-4 p-6 bg-slate-50 rounded-lg border border-gray-200">
  <h2 className="text-2xl font-bold text-gray-900">Title</h2>
  <p className="text-gray-600">Description</p>
</div>
```

Available utilities:
- **Spacing**: `p-4`, `m-2`, `gap-3`, etc.
- **Colors**: `bg-blue-50`, `text-gray-900`, etc.
- **Typography**: `text-xl`, `font-bold`, `uppercase`, etc.
- **Layout**: `flex`, `grid`, `justify-center`, etc.
- **Responsive**: `md:text-2xl`, `lg:grid-cols-3`, etc.

### Use UI Components

shadcn/ui provides 50+ ready-to-use components:

```tsx
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export default function Example() {
  return (
    <Card className="p-6">
      <Badge>Status</Badge>
      <Button>Action</Button>
      <Input placeholder="Enter text..." />
    </Card>
  )
}
```

---

## Build for Production

### Build the App
```bash
npm run build
```

This creates an optimized `dist/` folder ready for deployment.

### Preview Production Build
```bash
npm run preview
```

Open http://localhost:4173 to see the production build.

---

## Deploy to GitHub Pages

### Option 1: Automatic (Recommended)

The GitHub Actions workflow automatically deploys when you push to `main`:

1. Push your changes:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

2. View deployment:
   - Go to **Actions** tab in GitHub
   - Watch **Deploy to GitHub Pages** workflow
   - Once complete, visit: `https://blacknoir-code.github.io/mcp-flow/`

### Option 2: Manual

```bash
npm run build
# The dist/ folder is ready for deployment
```

---

## Useful Commands

```bash
# Development
npm run dev              # Start dev server on port 8080
npm run lint            # Check code quality
npm run lint -- --fix   # Fix linting issues

# Building
npm run build           # Production build
npm run build:dev       # Development build
npm run preview         # Preview production build

# Utilities
npm run lint            # Run ESLint
```

---

## Troubleshooting

### Port 8080 Already in Use
```bash
# Use a different port
npx vite --port 3000
```

### Dependencies Installation Issues
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Check TypeScript errors
npx tsc --noEmit

# Check code quality
npm run lint
```

### Hot Reload Not Working
1. Check if Vite dev server is running: `npm run dev`
2. Hard refresh browser: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
3. Check browser console for errors

---

## Key Features to Explore

### 1. Responsive Design
- Resize browser window to see responsive layouts
- Uses Tailwind CSS responsive prefixes: `md:`, `lg:`, `xl:`

### 2. Dark Mode
- The UI has dark mode support
- Uses `next-themes` for theme switching

### 3. Animations
- Smooth transitions using `tailwindcss-animate`
- Hover effects and fade-in animations

### 4. Components
- Modular, reusable components
- Consistent styling across the app
- Type-safe with TypeScript

### 5. Icon Library
- 500+ icons from Lucide React
- Easy to use: `import { Mail, CheckSquare } from "lucide-react"`

---

## Development Tips

### 1. Use Path Aliases
Instead of: `import { Button } from '../../../components/ui/button'`

Use: `import { Button } from '@/components/ui/button'`

### 2. Type Everything
```tsx
interface Props {
  title: string
  status: 'success' | 'error' | 'pending'
  onAction: () => void
}

export const Component: React.FC<Props> = ({ title, status, onAction }) => {
  // ...
}
```

### 3. Use React Query for Data
```tsx
import { useQuery } from '@tanstack/react-query'

const { data, isLoading, error } = useQuery({
  queryKey: ['workflows'],
  queryFn: () => fetch('/api/workflows').then(r => r.json()),
})
```

### 4. Reuse UI Components
The `ui/` folder has many ready-to-use components. Browse them first before creating new ones.

### 5. Keep Components Small
- Aim for components < 200 lines
- Extract logic to custom hooks
- One responsibility per component

---

## Learning Resources

- **React**: https://react.dev/learn
- **TypeScript**: https://www.typescriptlang.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com
- **Vite**: https://vitejs.dev/guide
- **React Router**: https://reactrouter.com/en/main

---

## Next Steps

1. ✅ Run `npm install`
2. ✅ Run `npm run dev`
3. ✅ Open http://localhost:8080
4. ✅ Explore the app
5. ✅ Make a small change and see it hot-reload
6. ✅ Read the full [README.md](README.md)
7. ✅ Check [CODE_REVIEW.md](CODE_REVIEW.md) for architecture details
8. ✅ Review [DEPLOYMENT.md](DEPLOYMENT.md) for deployment options

---

## Getting Help

- **GitHub Issues**: Report bugs and request features
- **GitHub Discussions**: Ask questions and discuss ideas
- **Documentation**: See README.md and DEPLOYMENT.md
- **Code Examples**: Check existing components in `src/components/`

---

## Happy Coding! 🚀

Enjoy building with MCP Flow!

