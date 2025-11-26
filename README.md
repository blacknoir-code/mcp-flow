# MCP Browser - AI-Powered Workflow Automation

Card-based workflow automation engine powered by AI. Connect apps, automate tasks without coding.

## Features

- 🎨 **Visual Workflow Builder** - Drag-and-drop interface for creating workflows
- 🤖 **AI Assistant** - Natural language workflow generation and optimization
- 📊 **Execution Monitoring** - Real-time workflow execution with detailed logs
- 🔌 **Integration Management** - Connect and manage multiple apps and services
- 📝 **Template Library** - Pre-built workflow templates
- 🎯 **Add Card Panel** - Browse, search, and insert workflow cards
- 📈 **Run History** - Track and analyze workflow executions
- ⚙️ **Settings & Configuration** - Comprehensive settings panel

## Tech Stack

- **React 18+** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Flow** for workflow canvas
- **Zustand** for state management
- **React Router** for navigation

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, pnpm, or bun

### Installation

```bash
# Using bun (recommended)
bun install

# Or using npm
npm install
```

### Development

```bash
# Using bun
bun run dev

# Or using npm
npm run dev
```

The app will be available at `http://localhost:8080`

### Build

```bash
# Using bun
bun run build

# Or using npm
npm run build
```

## Deployment

### Vercel

This project is configured for Vercel deployment:

1. Push your code to GitHub
2. Import the project in Vercel
3. Vercel will auto-detect the Vite framework
4. Deploy!

The `vercel.json` file includes:
- Build command: `bun run build`
- Output directory: `dist`
- SPA routing configuration
- Asset caching headers

### Environment Variables

For custom base paths, set:
- `VITE_BASE_PATH` - Base path for the application (default: `/`)

## Project Structure

```
src/
├── components/       # React components
│   ├── addCard/     # Add Card Panel components
│   ├── ai-assistant/# AI Assistant components
│   ├── card-details/# Card detail drawer
│   ├── execution/   # Execution panel
│   ├── integrations/# Integration management
│   ├── mcp/         # MCP server management
│   ├── settings/    # Settings panel
│   ├── workflow/    # Workflow canvas
│   └── workflowRuns/# Run history
├── data/            # Mock data and samples
├── hooks/           # Custom React hooks
├── pages/           # Page components
├── stores/          # Zustand stores
└── utils/           # Utility functions
```

## License

MIT
