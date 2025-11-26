# Regenerate With AI Workflow Editor

A comprehensive AI-powered workflow editor that allows users to modify workflows using natural language intent. All AI behaviors are deterministic, rule-based mocks.

## Features

### Core Functionality
- **Intent Editor**: Natural language input with keyword highlighting
- **AI Preview**: Shows detected apps, operations, conditions, and proposed steps
- **Rewrite Suggestions**: AI-generated suggestions for workflow improvements
- **Diff View**: Visual comparison of original vs. regenerated workflow
- **History Timeline**: Track all regenerate actions with restore capability
- **Apply/Reject UI**: Apply changes, save as version, or cancel

### AI Rewrite Rules (Deterministic)
1. **Add Filter for "Assigned to Me"**: Inserts filter node when intent mentions assignment
2. **Add Summarization Step**: Inserts summarizer before Slack posting
3. **Merge Adjacent Transforms**: Combines consecutive transform steps
4. **Add Default Slack Channel**: Fills missing channel parameter
5. **Add Error Handling**: Wraps error-prone steps (e.g., Jira updates)
6. **Add Priority Filter**: Inserts priority filter for urgent items

## File Structure

```
src/
  components/regenerate/
    RegenerateWithAIDrawer.tsx    ✅ Main drawer component
    IntentEditor.tsx               ✅ Natural language editor
    AIPreviewPanel.tsx             ✅ AI interpretation preview
    AIRewriteSuggestions.tsx       ✅ Suggestions list
    AINodeDiffView.tsx             ✅ Diff visualization
    ApplyChangesFooter.tsx         ✅ Apply/Reject actions
    HistoryTimeline.tsx            ✅ Regenerate history
  hooks/
    useRegenerateAI.ts             ✅ AI parsing & rewrite logic
  stores/
    regenerateStore.ts             ✅ State management
  data/
    mockRewriteRules.ts            ✅ Deterministic rewrite rules
  components/
    RegenerateAIButton.tsx         ✅ Header button component
```

## Usage

### Opening the Editor

1. **From Header**: Click the wand icon (✨) in the browser header
2. **From Canvas**: Available on workflow canvas (can be added to toolbar)

### Workflow

1. **Edit Intent**: Type or modify natural language intent
2. **Parse Intent**: Click "Parse Intent" to see AI interpretation
3. **View Suggestions**: Navigate to "Suggestions" tab to see AI recommendations
4. **Preview Changes**: Click "Preview" on any suggestion to see diff
5. **Apply Suggestions**: Click "Apply" to add suggestion to rewritten workflow
6. **Review Diff**: Navigate to "Diff" tab to see all changes
7. **Apply Changes**: Click "Apply Changes" to update the workflow

### Tabs

- **Intent**: Edit natural language intent
- **AI Preview**: View AI interpretation (apps, operations, conditions)
- **Suggestions**: Browse and apply AI suggestions
- **Diff**: See detailed changes (added/removed/modified nodes)
- **History**: View past regenerate actions and restore versions

## Integration

### With flowStore
- Reads current `nodes` and `edges`
- Updates `nodes` and `edges` when changes are applied

### With workflowStore
- Creates version entries when changes are applied
- Adds activity feed entries
- Supports restore from history

### With Canvas
- Button available in header (wand icon)
- Can be triggered from workflow canvas

## Mock AI Behavior

All AI behaviors are deterministic:

### Intent Parsing
- Detects apps: Gmail, Jira, Slack, Notion
- Detects operations: read, update, create, delete, send
- Detects conditions: unread_only, assigned_to_me, high_priority, mentioned
- Extracts entities: ticket_ids, emails, summary

### Rewrite Rules
- Rules are applied sequentially
- Each rule checks conditions before applying
- Rules can add, modify, merge, or remove nodes
- Suggestions are generated for each applied rule

### Confidence Score
- Mock calculation: 70% base + 5% per suggestion
- Max 95% confidence

## State Management

### regenerateStore
- `intentDraft`: Current intent text
- `parsedSpec`: Parsed TaskSpec
- `suggestions`: List of rewrite suggestions
- `rewrittenFlow`: New nodes and edges
- `diff`: Computed differences
- `history`: Past regenerate actions (last 50)

All persisted to localStorage.

## Acceptance Criteria ✅

- [x] Intent editor with keyword highlighting
- [x] AI preview shows detected apps/operations/conditions
- [x] At least 4 deterministic suggestions appear
- [x] Preview shows diff (inline + JSON)
- [x] Apply suggestion updates rewrittenFlow
- [x] Diff view highlights added/removed/modified nodes
- [x] Param diffs visible
- [x] Edge diffs visible
- [x] Apply updates flowStore
- [x] Version created in workflowStore
- [x] Activity added to feed
- [x] History logged and restorable
- [x] Drawer transitions smoothly
- [x] Keyboard navigable (Escape to close)
- [x] Accessible labels & ARIA roles
- [x] No backend calls
- [x] Fully deterministic

## Styling

- Drawer width: 600px (desktop)
- Mobile: Full-screen modal (responsive)
- Colors:
  - Added: Green (#2ECC71)
  - Removed: Red (#FF5252)
  - Modified: Amber (#FFA726)
- Icons from heroicons
- Tailwind CSS utilities

## Example Usage

1. Click wand icon in header
2. Type: "Update Jira tickets mentioned in my unread Gmail and send summary to Slack"
3. Click "Parse Intent"
4. View AI Preview: Shows Gmail, Jira, Slack detected
5. Go to Suggestions tab: See suggestions like "Add Filter: Assigned to Me"
6. Click "Apply" on suggestions
7. View Diff tab: See all changes highlighted
8. Click "Apply Changes" to update workflow

## Next Steps

- Add more rewrite rules
- Support custom rewrite rules
- Add undo/redo for suggestions
- Export regenerate history
- Share regenerated workflows

