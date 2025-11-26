# Workflow Canvas - High-Fidelity UI

A comprehensive workflow canvas interface built with React Flow, Zustand, and Tailwind CSS.

## Features

### Core Functionality
- **Visual Canvas**: Drag-and-drop nodes with React Flow
- **Node Management**: Add, edit, duplicate, and delete nodes
- **Edge Connections**: Connect nodes with visual edges
- **Workflow Generation**: Generate workflows from natural language intents
- **Execution Simulation**: Run workflows with animated status updates
- **Template System**: Save and load workflow templates
- **Import/Export**: JSON-based workflow persistence

### UI Components
- **TopBar**: Command input for generating workflows
- **Toolbar**: Actions (Run, Save, Export, Import, Undo, Redo)
- **Canvas**: Interactive node graph with zoom, pan, and minimap
- **NodeEditorPanel**: Edit node parameters and view schema
- **RightSidebarAI**: AI assistant with workflow suggestions
- **ExecutionPanel**: Real-time execution logs
- **TemplatesStrip**: Browse and instantiate templates

### Advanced Features
- **Validation**: Check for missing required parameters
- **Quick Fix**: Auto-fill missing parameters with defaults
- **Keyboard Shortcuts**: 
  - `Cmd/Ctrl+K`: Toggle templates strip
  - `Delete`: Delete selected node
  - `Cmd/Ctrl+Z`: Undo
  - `Cmd/Ctrl+Shift+Z` or `Cmd/Ctrl+Y`: Redo
- **Context Menu**: Right-click nodes for quick actions
- **Undo/Redo**: History management for workflow changes

## Usage

### Generate a Workflow
1. Type an intent in the top bar (e.g., "Update Jira tickets mentioned in my unread Gmail and post a summary to Slack")
2. Click "Generate Workflow"
3. Nodes will appear on the canvas

### Edit Nodes
1. Click a node to select it
2. The NodeEditorPanel will open on the left
3. Edit parameters and click "Save"

### Run Workflow
1. Click "Run Workflow" in the toolbar
2. Watch nodes animate through statuses: Pending → Running → Success
3. View execution logs in the ExecutionPanel at the bottom

### Save as Template
1. Build your workflow
2. Click "Save as Template" in the toolbar
3. Enter a name and description
4. Template will be available in the TemplatesStrip

### Export/Import
- **Export**: Click "Export" to download workflow as JSON
- **Import**: Click "Import" and select a JSON file

## File Structure

```
src/
  components/workflow/
    Canvas.tsx              # Main React Flow canvas
    NodeCard.tsx            # Custom node component
    NodeEditorPanel.tsx     # Node editing panel
    TopBar.tsx              # Command input bar
    Toolbar.tsx              # Action toolbar
    RightSidebarAI.tsx       # AI assistant sidebar
    ExecutionPanel.tsx      # Execution logs
    TemplatesStrip.tsx      # Template browser
    ModalConfirm.tsx        # Confirmation dialogs
  data/
    sampleNodes.ts          # Node generation logic
    sampleTemplates.ts      # Pre-built templates
  stores/
    flowStore.ts            # Zustand state management
  pages/
    WorkflowCanvas.tsx      # Main page component
```

## State Management

The app uses Zustand for state management with localStorage persistence:

- **Nodes**: Array of workflow nodes
- **Edges**: Connections between nodes
- **Templates**: Saved workflow templates
- **History**: Undo/redo stack
- **TaskSpec**: Current workflow intent

## Mock AI Features

The AI assistant uses deterministic rule-based logic:

- Detects apps from intent (Gmail, Jira, Slack)
- Suggests workflow improvements
- Merges duplicate transform nodes
- Adds filter nodes for "assigned to me" queries
- Adds summarization steps when needed

## Color Tokens

- Primary: `#2B6DF6` (Blue)
- Success: `#2ECC71` (Green)
- Warning: `#FFA726` (Orange)
- Error: `#FF5252` (Red)
- Neutral: `#0F172A` (Dark Gray)

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl+K` | Toggle templates strip |
| `Delete` | Delete selected node |
| `Cmd/Ctrl+Z` | Undo |
| `Cmd/Ctrl+Shift+Z` or `Cmd/Ctrl+Y` | Redo |

## Sample Workflows

Try these intents:
- "Update Jira tickets mentioned in my unread Gmail and post a summary to Slack"
- "Get unread emails from Gmail"
- "Create Jira tickets from Gmail messages"

## Technical Details

- **React Flow**: Node graph rendering and interactions
- **Zustand**: Lightweight state management
- **Tailwind CSS**: Utility-first styling
- **Heroicons**: Icon library
- **UUID**: Unique ID generation

## Notes

- This is a **frontend-only** prototype
- All AI features are mock/deterministic
- Workflows persist in localStorage
- No backend API calls are made

