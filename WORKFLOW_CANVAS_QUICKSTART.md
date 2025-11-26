# Workflow Canvas - Quick Start

## Running the Application

The application is already set up and ready to run. The dev server should be running at `http://localhost:8080`.

If you need to restart:

```bash
bun run dev
# or
npm run dev
```

## First Steps

1. **Navigate to Workflow Canvas**: Click "Workflow" in the navigation or go to `/workflow`

2. **Generate Your First Workflow**:
   - Type in the top bar: "Update Jira tickets mentioned in my unread Gmail and post a summary to Slack"
   - Click "Generate Workflow"
   - You'll see 5 nodes appear on the canvas

3. **Interact with Nodes**:
   - Click a node to select it and open the editor panel
   - Drag nodes around the canvas
   - Connect nodes by dragging from the bottom handle to another node's top handle
   - Right-click a node for context menu (Edit, Duplicate, Delete)

4. **Run the Workflow**:
   - Click "Run Workflow" in the toolbar
   - Watch nodes animate through statuses
   - Check the Execution Panel at the bottom for logs

5. **Try Templates**:
   - Press `Cmd/Ctrl+K` to toggle templates strip
   - Click "Use Template" on any template to load it

## Key Features to Try

### Workflow Generation
- Try different intents in the top bar
- Examples:
  - "Get unread emails from Gmail"
  - "Create Jira tickets from Gmail messages"
  - "Post daily standup summary to Slack"

### Node Editing
- Click any node to edit its parameters
- Toggle "Show Schema" to see raw JSON
- Save changes to update the node

### AI Assistant
- After generating a workflow, click "Regenerate Workflow (Mock AI)" in the right sidebar
- Review suggestions and click "Apply Suggestion"

### Save & Export
- Build a workflow
- Click "Save as Template" to save it
- Click "Export" to download as JSON
- Click "Import" to load a saved workflow

### Keyboard Shortcuts
- `Cmd/Ctrl+K`: Toggle templates
- `Delete`: Delete selected node
- `Cmd/Ctrl+Z`: Undo
- `Cmd/Ctrl+Shift+Z`: Redo

## Troubleshooting

### Canvas is Empty
- Generate a workflow using the top bar
- Or load a template from the templates strip

### Nodes Not Connecting
- Make sure you drag from the bottom handle (source) to the top handle (target) of another node
- Nodes must have compatible types

### Execution Not Working
- Make sure you have at least one node on the canvas
- Check for validation errors (missing parameters)
- Use "Quick Fix" if prompted

## File Locations

- Main page: `src/pages/WorkflowCanvas.tsx`
- Components: `src/components/workflow/`
- State management: `src/stores/flowStore.ts`
- Sample data: `src/data/`

## Next Steps

- Explore the codebase to understand the architecture
- Customize node types and templates
- Add your own workflow generation logic
- Extend the AI assistant with more suggestions

Enjoy building workflows! 🚀

