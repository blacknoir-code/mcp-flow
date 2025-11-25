# MCP Flow - AI-Powered Workflow Automation

<div align="center">

[![React](https://img.shields.io/badge/React-18.3-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwindcss)](https://tailwindcss.com)

**A modern, card-based workflow automation engine powered by AI**

Connect your favorite apps, describe what you want to automate, and watch the AI build your workflow - no coding required.

[View Demo](#-features) • [Get Started](#-getting-started) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Overview

MCP Flow is a next-generation workflow automation platform that leverages AI and the Model Context Protocol (MCP) to enable seamless integration between applications. Built with modern web technologies, it provides an intuitive interface for creating, managing, and monitoring automation workflows.

### Key Highlights

- **AI-Powered Workflow Generation** - Describe what you want to automate in plain English
- **Multi-App Integration** - Connect Gmail, Jira, Slack, and more through MCP servers
- **Real-time Monitoring** - Track workflow execution with live status updates
- **Pre-built Templates** - Jump-start automation with battle-tested workflow templates
- **Enterprise-Ready** - Built on proven technologies with scalability in mind

---

## ✨ Features

### Dashboard
- **Quick Overview** - See your recent workflows at a glance
- **Quick Access** - Command bar for rapid workflow generation
- **Templates** - Pre-built workflows for common automation tasks
- **Integration Cards** - Monitor connected applications and services

### Workflow Canvas
- **Visual Editor** - Build workflows step-by-step with a card-based interface
- **Real-time Execution** - Monitor workflow execution in real-time
- **Input/Output Tracking** - See data flowing through each step
- **Error Handling** - Clear error messages and debugging information

### Integrations
- **MCP Server Health** - Monitor status of all connected MCP servers
- **Application Management** - Connect and manage OAuth-based integrations
- **Rate Limit Tracking** - Monitor API usage across all services
- **Detailed Logging** - Access comprehensive logs for each integration

### Templates Library
- **Gmail → Jira Triage** - Auto-create tickets from unread emails (Save 2h/week)
- **Daily Standup Summary** - Collect updates and generate summaries (Save 30min/day)
- **Support Escalation** - Auto-escalate critical issues (Save 1h/day)
- **PR Review Reminder** - Send Slack reminders for pending reviews (Save 1h/week)
- **Bug Triage Automation** - Categorize and assign bug reports (Save 4h/week)
- **And more...** - Explore 50+ templates for various workflows

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - Modern UI library with concurrent rendering
- **TypeScript 5.8** - Type-safe development
- **Vite 5.4** - Lightning-fast build tool and dev server
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible React components

### Libraries
- **React Router 6.30** - Client-side routing
- **TanStack Query 5.83** - Powerful async state management
- **React Hook Form 7.61** - Performant form handling
- **Recharts 2.15** - Composable chart components
- **Lucide React** - Beautiful, consistent icon library
- **Zod 3.25** - TypeScript-first schema validation
- **Sonner** - Elegant toast notifications

### Development
- **ESLint 9.32** - Code quality and consistency
- **TypeScript ESLint** - Type-aware linting
- **PostCSS** - CSS transformation
- **Autoprefixer** - Vendor prefixing

---

## 📦 Getting Started

### Prerequisites
- **Node.js** 18+ or **Bun** latest
- **npm**, **yarn**, **pnpm**, or **bun** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/blacknoir-code/mcp-flow.git
   cd mcp-flow
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install
   
   # Or using bun (recommended)
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:8080`

### Build for Production

```bash
# Standard build
npm run build

# Build with development optimizations
npm run build:dev

# Preview the production build locally
npm run preview
```

### Code Quality

```bash
# Run ESLint
npm run lint
```

---

## 📂 Project Structure

```
mcp-flow/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── CommandBar.tsx  # AI command input interface
│   │   ├── WorkflowCard.tsx # Workflow display card
│   │   ├── TemplateCard.tsx # Template showcase card
│   │   └── ...
│   ├── pages/              # Page components (routing)
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   ├── WorkflowCanvas.tsx # Workflow editor
│   │   ├── Integrations.tsx # Integration management
│   │   ├── Templates.tsx   # Template library
│   │   └── Settings.tsx    # User settings
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── package.json            # Project dependencies
```

---

## 🔄 Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run lint            # Check code quality with ESLint

# Build & Deploy
npm run build           # Create optimized production build
npm run build:dev       # Build with development mode
npm run preview         # Preview production build locally

# Utilities
npm run preview         # Serve dist locally for testing
```

---

## 🚀 Deployment

### GitHub Pages

This project includes an automated deployment workflow for GitHub Pages.

**Setup:**

1. Go to your repository settings
2. Navigate to **Settings → Pages**
3. Select **GitHub Actions** as the deployment source
4. The workflow will automatically deploy on `main` branch pushes

**Manual Deployment:**

```bash
npm run build
# The dist/ folder is ready for deployment
```

**Environment Variables:**

If you need to customize the base path (for non-root deployments):

```bash
# .env or .env.production
VITE_BASE_URL=/mcp-flow/
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

```bash
docker build -t mcp-flow .
docker run -p 3000:3000 mcp-flow
```

---

## 🔌 MCP Server Integration

MCP Flow communicates with Model Context Protocol servers for:

- **Gmail Server** - Email management and filtering
- **Jira Server** - Issue tracking and management
- **Slack Server** - Team messaging and notifications

Each server exposes tools and resources available in the workflow canvas.

### Architecture

```
┌─────────────────┐
│  MCP Flow UI    │
│   (React App)   │
└────────┬────────┘
         │
         │ HTTP/WebSocket
         │
    ┌────▼──────────────────┐
    │ MCP Flow Backend/Proxy │
    └────┬───────────────────┘
         │
    ┌────┴──────────────────────┐
    │                           │
    │  MCP Servers              │
    │  ├── Gmail               │
    │  ├── Jira                │
    │  └── Slack               │
    └──────────────────────────┘
```

---

## 📊 Key Components

### CommandBar
Intelligent command interface that:
- Accepts natural language workflow descriptions
- Auto-detects required integrations
- Generates workflow configurations with AI

### WorkflowCard
Displays workflow execution with:
- Step-by-step progress tracking
- Input/output data visualization
- Status indicators (running, success, failed, pending)

### TemplateCard
Pre-built workflow templates featuring:
- Category tags and descriptions
- Time-saving estimates
- One-click deployment

### IntegrationCard
Manages connected applications with:
- Connection status indicators
- Last sync timestamps
- Quick action buttons

---

## 🎨 Theming

The application supports light and dark modes using `next-themes`.

```tsx
import { useTheme } from 'next-themes'

const { theme, setTheme } = useTheme()

// Available themes
setTheme('light')
setTheme('dark')
setTheme('system')
```

---

## 🧪 Testing

### Run ESLint

```bash
npm run lint
```

### Type Checking

```bash
npx tsc --noEmit
```

---

## 📝 Configuration Files

### vite.config.ts
- Development server on port 8080
- Path alias for imports (`@` → `./src`)
- React Fast Refresh support

### tsconfig.json
- Strict TypeScript checking (customizable)
- Path aliases for cleaner imports
- JSX support with React 18

### tailwind.config.ts
- Custom color scheme
- Extended spacing utilities
- Animation configurations

---

## 🔐 Security Considerations

- ✅ Environment variables for sensitive data
- ✅ OAuth 2.0 for third-party authentication
- ✅ Content Security Policy headers
- ✅ CORS configuration for MCP servers

---

## 🤝 Contributing

Contributions are welcome! Here's how to contribute:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to your branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style and naming conventions
- Add comments for complex logic
- Update documentation for new features
- Run `npm run lint` before submitting PR
- Test changes locally before pushing

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [React](https://react.dev/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [Lucide](https://lucide.dev/) - Icon library

---

## Support & Contact

- **Issues** - [GitHub Issues](https://github.com/blacknoir-code/mcp-flow/issues)
- **Discussions** - [GitHub Discussions](https://github.com/blacknoir-code/mcp-flow/discussions)
- **Author** - [@blacknoir-code](https://github.com/blacknoir-code)

---

## 🗺️ Roadmap

- [ ] Advanced workflow scheduling
- [ ] Workflow versioning and rollback
- [ ] Custom MCP server support
- [ ] Workflow marketplace
- [ ] Team collaboration features
- [ ] Audit logs and compliance
- [ ] Mobile app
- [ ] CI/CD integration templates

---

<div align="center">

**Built with ❤️ for automation enthusiasts**

[⬆ Back to Top](#mcp-flow---ai-powered-workflow-automation)

</div>
