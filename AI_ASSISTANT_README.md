# AI Assistant Sidebar - High-Fidelity Planning Panel

A comprehensive AI Assistant Sidebar that interprets user intents, visualizes task graphs, provides suggestions, detects conflicts, and allows natural language editing of workflows.

## Features

### Core Functionality
- **Interpretation Summary**: Parses natural language intents and displays detected apps, operations, entities, and constraints
- **Task Graph View**: Visual list of nodes with click-to-focus functionality
- **Suggestions List**: AI-generated suggestions for workflow improvements
- **Conflict Detection**: Identifies missing parameters, broken edges, and cycles
- **NL Command Editor**: Edit intents with real-time parsing and preview
- **Regenerate Workflow**: Deterministic AI regeneration with preview and apply

### UI Components
- **AIAssistantSidebar**: Main sidebar with collapsed/expanded states
- **TaskGraphView**: Node list with mini-graph visualization
- **SuggestionsList**: Displays AI suggestions with preview and apply
- **SuggestionItem**: Individual suggestion with hover effects
- **ConflictDetector**: Shows errors and warnings with resolve actions
- **NLCommandEditor**: Natural language editing interface
- **ApplyConfirmationModal**: Confirmation dialog for applying changes

## File Structure

```
src/
  components/ai-assistant/
    AIAssistantSidebar.tsx       ✅ Main sidebar component
    TaskGraphView.tsx             ✅ Task graph visualization
    SuggestionsList.tsx           ✅ Suggestions container
    SuggestionItem.tsx            ✅ Individual suggestion
    ConflictDetector.tsx           ✅ Conflict detection UI
    NLCommandEditor.tsx            ✅ NL editing interface
    ApplyConfirmationModal.tsx     ✅ Confirmation dialog
  hooks/
    useAiAssistant.ts             ✅ Mock AI logic hook
  data/
    mockTaskSpecs.ts              ✅ TaskSpec types and parsing
```

## Usage

### Integration

The sidebar is already integrated into the WorkflowCanvas page. It appears on the right side of the canvas.

### Basic Workflow

1. **Generate a Workflow**: Type an intent in the top bar and click "Generate Workflow"
2. **View Interpretation**: The sidebar automatically parses the intent and shows:
   - Detected apps (Gmail, Jira, Slack)
   - Operations (Fetch, Update, Send, etc.)
   - Keywords and constraints
   - Confidence score
3. **Review Task Graph**: Click any node in the task graph to focus it on the canvas
4. **Check Conflicts**: Review any detected conflicts and use "Resolve" to auto-fix
5. **Apply Suggestions**: Review AI suggestions and click "Apply" to implement them
6. **Edit Intent**: Click "Edit Intent" to modify the command and regenerate

### Keyboard Shortcuts

- **Tab**: Navigate through suggestions and buttons
- **Enter/Space**: Activate focused button
- **Esc**: Close modals

### Mock AI Behavior

All AI features are deterministic and rule-based:

#### Intent Parsing
- Detects apps from keywords: "gmail", "jira", "slack"
- Identifies operations: "get", "update", "create", "post", "extract"
- Extracts entities: "ticket", "email", "message"
- Calculates confidence based on keyword matches

#### Suggestions
1. **Add Filter**: If intent contains "assigned to me", suggests adding a filter node
2. **Merge Nodes**: If two consecutive transform nodes exist, suggests merging
3. **Add Summary**: If "summary" detected and Slack node exists, suggests summarizer
4. **Add Retry**: If Jira node lacks retry policy, suggests adding one
5. **Group By**: If "group by" detected, suggests grouping node

#### Conflict Detection
- **Missing Params**: Checks for required parameters (Jira project, Slack channel, Gmail label)
- **Broken Edges**: Identifies edges connecting to non-existent nodes
- **Cycles**: Detects cycles in the workflow graph

#### Regeneration Rules
- Inserts filter node if "assigned to me" detected
- Adds summarizer before Slack if "summary" mentioned
- Merges duplicate transform nodes
- All changes are deterministic and idempotent

## API Integration

### flowStore Methods

The sidebar uses these methods from the flowStore:

```typescript
// Focus a node on the canvas
focusNode(nodeId: string): void

// Apply workflow mutations
applyMutation(nodes: Node[], edges: Edge[]): void

// Get node by ID
getNodeById(id: string): Node | undefined

// Update task spec
setTaskSpec(spec: string): void
```

### useAiAssistant Hook

```typescript
const {
  taskSpec,              // Parsed TaskSpec
  suggestions,          // Array of suggestions
  conflicts,            // Array of conflicts
  parseIntentText,      // Parse intent string
  generateSuggestions,  // Generate suggestions
  detectConflicts,      // Detect conflicts
  mockRegenerate,       // Regenerate workflow
} = useAiAssistant();
```

## Styling

- **Sidebar Width**: 384px (w-96) when expanded, 48px when collapsed
- **Colors**: 
  - Primary: Blue (#2B6DF6)
  - Success: Green
  - Warning: Orange
  - Error: Red
- **Typography**: System font stack (Inter preferred)
- **Spacing**: 8-12px border radius, soft shadows

## Accessibility

- All interactive elements have `aria-label`
- Keyboard navigation supported (Tab, Enter, Esc)
- ARIA live region for announcements
- Focus indicators visible
- Semantic HTML structure

## Examples

### Sample Intents

Try these intents to see different suggestions:

1. **"Update Jira tickets mentioned in my unread Gmail and post a summary to Slack"**
   - Detects: Gmail, Jira, Slack
   - Suggests: Filter for "assigned to me", summary step
   - Confidence: ~85%

2. **"Get unread emails from Gmail"**
   - Detects: Gmail
   - Suggests: Add label parameter
   - Confidence: ~70%

3. **"Create Jira tickets and group by project"**
   - Detects: Jira
   - Suggests: Group by node, retry policy
   - Confidence: ~75%

## Technical Details

### Deterministic Behavior

All AI features use deterministic rule-based logic:
- No external API calls
- Same input always produces same output
- Rules are keyword-based and pattern-matching
- Confidence calculated from keyword matches

### State Management

- Uses Zustand for global state
- Local component state for UI interactions
- Suggestions and conflicts cached in hook state
- History preserved for undo/redo

### Performance

- Suggestions generated on-demand
- Conflicts detected when nodes/edges change
- Preview calculations are lightweight
- No expensive computations

## Troubleshooting

### Sidebar Not Showing
- Check that WorkflowCanvas is rendering
- Verify AIAssistantSidebar is imported
- Check browser console for errors

### Suggestions Not Appearing
- Ensure a workflow is generated first
- Check that intent contains recognizable keywords
- Verify nodes exist on canvas

### Conflicts Not Detecting
- Make sure nodes have required apps (Jira, Slack, Gmail)
- Check that edges connect valid nodes
- Verify node parameters are set

## Next Steps

- Add more sophisticated suggestion rules
- Implement visual diff highlighting on canvas
- Add confidence history tracking
- Enhance explainability with detailed rule breakdowns
- Support undo for applied suggestions

