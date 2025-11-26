# Execution Panel / Timeline View - High-Fidelity UI

A comprehensive execution panel that displays per-card execution state, step-by-step logs, retry history, JSON inspector, and execution controls.

## Features

### Core Functionality
- **Timeline View**: Vertical timeline showing node execution in order
- **Per-Node Execution**: Status badges, timestamps, duration, retry counts
- **Log Viewer**: Real-time logs with search and PII masking
- **JSON Inspector**: Pretty-printed mock responses with syntax highlighting
- **Run Controls**: Run Workflow, Rerun, Run Step Only, Retry Failed Step
- **Execution History**: Persisted run history (last 20 runs) in localStorage
- **Filters**: Filter by status (All/Errors/Success) and time range

### UI Components
- **ExecutionPanel**: Main panel with collapse/expand, tabs (Timeline/Logs)
- **TimelineView**: Vertical timeline with node rows
- **NodeExecutionRow**: Collapsible row showing node execution details
- **LogViewer**: Logs and JSON inspector with copy/mask/search
- **RunControls**: Control buttons (Run, Rerun, Run Step, Retry, Cancel)
- **ExecutionFilterBar**: Status and time range filters
- **ExecutionBadge**: Status badge component
- **RetryHistoryModal**: Modal showing retry history

## File Structure

```
src/
  components/execution/
    ExecutionPanel.tsx         ✅ Main panel component
    TimelineView.tsx            ✅ Vertical timeline
    NodeExecutionRow.tsx        ✅ Per-node execution row
    LogViewer.tsx               ✅ JSON + text log inspector
    RunControls.tsx             ✅ Control buttons
    RetryHistoryModal.tsx       ✅ Retry history modal
    ExecutionFilterBar.tsx      ✅ Filters
    ExecutionBadge.tsx          ✅ Status badge
  hooks/
    useExecutionSimulator.ts    ✅ Mock execution logic
  stores/
    executionStore.ts           ✅ Execution state management
  data/
    sampleRunEvents.ts          ✅ Mock responses & logs
```

## Usage

### Running a Workflow

1. **From Toolbar**: Click "Run Workflow" in the toolbar
2. **From Execution Panel**: Click "Run Workflow" in the panel header
3. **Watch Execution**: Timeline updates in real-time as nodes execute
4. **View Logs**: Expand any node row to see logs and JSON response

### Controls

- **Run Workflow**: Executes all nodes in topological order
- **Rerun**: Re-executes the entire workflow (creates new run)
- **Run Step Only**: Re-executes only the selected node
- **Retry Failed Step**: Retries a failed node according to retry policy
- **Cancel**: Stops current execution

### Viewing Execution Details

1. **Expand Node Row**: Click the chevron or row to expand
2. **View Logs**: See real-time execution logs
3. **View JSON**: See mock response JSON (pretty-printed)
4. **Search Logs**: Use search bar to filter logs
5. **Mask PII**: Toggle PII masking for sensitive data
6. **Copy Logs**: Copy all logs to clipboard

### Filters

- **Status Filter**: Show All / Errors only / Success only
- **Time Range**: Last Run / Today / Last 7 Days

## Execution Simulation

The execution simulator uses deterministic logic:

1. **Topological Sort**: Executes nodes in dependency order
2. **Mock Responses**: Returns predefined mock responses based on node type
3. **Mock Logs**: Generates realistic log messages
4. **Retry Logic**: Implements retry policy with exponential backoff
5. **Error Simulation**: Nodes with `mockError: true` will error
6. **Duration**: Each node takes 700-1200ms (randomized)

## Mock Data

Sample mock responses are provided for:
- Gmail operations (get_unread_emails)
- Jira operations (update_jira_ticket)
- Slack operations (post_to_slack)
- Internal operations (extract_ticket_ids, summarize_updates, filter)

## Integration

The ExecutionPanel is integrated into WorkflowCanvas and:
- Reads nodes/edges from `flowStore`
- Updates node statuses in real-time
- Focuses nodes on canvas during execution
- Persists run history in localStorage

## Keyboard Shortcuts

- **Enter/Space**: Expand/collapse node row
- **Tab**: Navigate through controls
- **Esc**: Close modals

## Accessibility

- All interactive elements have `aria-label`
- Keyboard navigation supported
- ARIA live region for execution announcements
- Color contrast meets WCAG AA standards

## Styling

- **Colors**: 
  - Primary: #2B6DF6 (Blue)
  - Success: #2ECC71 (Green)
  - Error: #FF5252 (Red)
  - Pending: Gray
- **Timeline**: Vertical layout with connecting lines
- **Animations**: Pulse for running nodes, smooth transitions

## Technical Details

### Execution Store

The `executionStore` manages:
- Run history (last 20 runs)
- Current run state
- Node execution statuses
- Events and logs
- Filters and time ranges

### Execution Simulator

The `useExecutionSimulator` hook provides:
- `runWorkflow()`: Execute entire workflow
- `runStepOnly()`: Execute single node
- `retryFailedStep()`: Retry failed node
- `cancelRun()`: Cancel current execution

All execution is deterministic and mock-based.

## Sample Workflow Execution

1. Generate workflow: "Update Jira tickets mentioned in my unread Gmail and post a summary to Slack"
2. Click "Run Workflow"
3. Watch nodes execute in order:
   - Get Unread Emails (Running → Success)
   - Extract Ticket IDs (Running → Success)
   - Update Jira Tickets (Running → Success)
   - Summarize Updates (Running → Success)
   - Post to Slack (Running → Success)
4. Expand any node to see logs and JSON response
5. Use filters to view only errors or success nodes

## Troubleshooting

### Timeline Not Showing
- Ensure a workflow has been run
- Check that nodes exist on canvas
- Verify executionStore is initialized

### Execution Not Starting
- Check browser console for errors
- Verify nodes are properly connected
- Ensure workflow has at least one node

### Logs Not Appearing
- Expand the node row
- Check that execution completed
- Verify mock responses are defined

## Next Steps

- Add replay scrubber for timeline
- Highlight edges on canvas during execution
- Export run as PDF/JSON report
- Add more sophisticated retry policies
- Support parallel execution branches

