# Integration Detail Page

A comprehensive detail page for each connected app that allows users to inspect scopes, tokens, rate limits, triggers, default params, test integration calls, reconnect/revoke flows, and view per-integration logs/metrics.

## Features

### Core Sections

1. **Integration Header**
   - App icon and name
   - Connection status badge
   - Connected as email
   - Last sync timestamp
   - Actions: Reconnect, Revoke, Open Docs

2. **Integration Status Card**
   - Connection state (Connected/Disconnected/Token Expired/Error)
   - Token expiry countdown
   - Last sync timestamp and result
   - Health indicator (green/yellow/red)
   - Sync Now button

3. **Scopes Viewer**
   - List of OAuth scopes with granted/missing status
   - Expandable long descriptions
   - Request More Scopes button
   - Reconnect modal for additional scopes

4. **Token Manager**
   - Token type (OAuth/API key)
   - Expiry timestamp and countdown
   - Last rotated date
   - Rotate Token button
   - Revoke button
   - Copy Token button
   - Automatic Rotation toggle with frequency selector

5. **Rate Limit Panel**
   - Current quotas (requests/min, requests/day)
   - Usage gauge showing % used
   - Recent spikes table
   - Client-side throttling toggle

6. **Trigger Toggles**
   - List of supported triggers (On New Email, On New Issue, etc.)
   - Enable/disable toggles
   - Configure parameters
   - Test Trigger button
   - Last fired timestamp

7. **Default Parameters Editor**
   - Set default values for templates/auto-generated nodes
   - Provider-specific parameters
   - Save button with toast notification

8. **Test Call Panel**
   - Select endpoint dropdown
   - Dynamic params form
   - Run button with mock response
   - Show latency, status code, raw headers
   - Save as Template Param button

9. **Integration Logs**
   - Stream of recent events
   - Search and filter by type
   - Expandable JSON metadata
   - Timestamped entries

10. **Integration Activity Feed**
    - Right-side feed with recent actions
    - Token rotated, trigger fired, defaults updated, etc.

11. **Reconnect Modal**
    - Shows requested scopes
    - Approve/Deny buttons
    - Simulates OAuth reconsent flow

12. **Revoke Confirm Modal**
    - Confirmation dialog
    - Warning about workflow impact
    - Revoke/Cancel buttons

## File Structure

```
src/
  pages/
    IntegrationDetailPage.tsx          ✅ Main page component
  components/integrations/
    IntegrationHeader.tsx               ✅ Header with breadcrumb
    IntegrationStatusCard.tsx          ✅ Status and sync card
    ScopesViewer.tsx                   ✅ OAuth scopes list
    TokenManager.tsx                    ✅ Token management
    RateLimitPanel.tsx                 ✅ Rate limit display
    TriggerToggles.tsx                 ✅ Trigger configuration
    DefaultParamsEditor.tsx            ✅ Default params editor
    TestCallPanel.tsx                  ✅ Test API calls
    IntegrationLogs.tsx                ✅ Logs viewer
    IntegrationActivityFeed.tsx        ✅ Activity feed
    ReconnectModal.tsx                 ✅ Reconnect flow
    RevokeConfirmModal.tsx             ✅ Revoke confirmation
  stores/
    integrationStore.ts                ✅ State management
  data/
    mockIntegrations.ts                ✅ Sample integration data
```

## Usage

### Accessing Integration Detail

Navigate to `/integrations/:id` where `:id` is the integration ID (e.g., `gmail-1`, `jira-1`, `slack-1`).

### Available Integrations

- **Gmail** (`gmail-1`): Email integration with read/modify scopes
- **Jira** (`jira-1`): Issue tracking with read/write scopes
- **Slack** (`slack-1`): Messaging with chat:write and channels:read

### Key Actions

1. **Sync Integration**: Click "Sync Now" to simulate health check
2. **Rotate Token**: Click "Rotate Token" to generate new token
3. **Request More Scopes**: Click "Request More Scopes" to open reconnect modal
4. **Enable Triggers**: Toggle triggers and configure parameters
5. **Test API Calls**: Select endpoint, fill params, click "Run Test Call"
6. **View Logs**: Browse integration logs with search and filters
7. **Revoke Integration**: Click "Revoke" to disconnect integration

## State Management

### integrationStore

The `integrationStore` manages:
- Integration metadata (name, provider, status)
- Token information (value, expiry, rotation)
- OAuth scopes (granted/missing)
- Rate limits (quotas, usage)
- Triggers (enabled/disabled, config)
- Default parameters
- Logs (last 50 entries)
- Settings (auto-rotate, throttle)

All data persists in localStorage.

## Mock Behaviors

### Sync Integration
- Simulates 800ms delay
- 90% success rate
- Updates lastSyncAt and health status
- Adds log entry

### Rotate Token
- Generates new masked token
- Sets expiry based on rotation frequency
- Updates lastRotated timestamp
- Adds log entry

### Reconnect
- Simulates OAuth consent flow
- Grants requested scopes
- Updates token
- Sets status to Connected

### Test Call
- Simulates 500-1000ms latency
- 85% success rate
- Returns mock response from mockResponses
- Updates rate limit usage
- Adds log entry

### Test Trigger
- Updates lastFiredAt timestamp
- Adds trigger_fired log entry
- Simulates trigger execution

## Routing

The page is accessible at `/integrations/:id` where `:id` is the integration UUID.

Routes are defined in `App.tsx`:
```tsx
<Route path="/integrations/:id" element={<IntegrationDetailPage />} />
```

## Components

### IntegrationHeader
- Breadcrumb navigation
- App icon and name
- Status badge
- Connected as email
- Last sync timestamp
- Action buttons

### IntegrationStatusCard
- Connection state badge
- Token expiry countdown
- Last sync result icon
- Health indicator
- Sync Now button

### ScopesViewer
- Scope list with granted/missing badges
- Expandable descriptions
- Request More Scopes button

### TokenManager
- Token display (masked/unmasked toggle)
- Expiry countdown
- Rotation settings
- Rotate/Revoke/Copy buttons

### RateLimitPanel
- Usage gauges (per minute, per day)
- Color-coded usage bars
- Throttling toggle
- Recent spikes table

### TriggerToggles
- Trigger cards with enable/disable
- Parameter configuration
- Test Trigger button
- Last fired timestamp

### DefaultParamsEditor
- Provider-specific parameters
- Form inputs with validation
- Save button

### TestCallPanel
- Endpoint selector
- Dynamic params form
- Run button with loading state
- Response display with syntax highlighting
- Copy/Save as Default buttons

### IntegrationLogs
- Searchable log stream
- Filter by type
- Expandable metadata
- Timestamped entries

### IntegrationActivityFeed
- Recent activity timeline
- Icon-based visualization
- Relative timestamps

## Acceptance Criteria ✅

- [x] Integration Detail Page loads for sample integration IDs
- [x] Status card shows token expiry countdown
- [x] Sync Now works (updates lastSyncAt & logs)
- [x] Scopes viewer lists scopes
- [x] Request More Scopes opens ReconnectModal
- [x] Token manager supports Rotate Token
- [x] Copy Token copies masked token
- [x] Revoke opens confirm modal and sets status to Disconnected
- [x] Rate limit panel displays quotas and usage gauge
- [x] Usage updates on Test Call
- [x] Trigger toggles can be enabled/disabled and configured
- [x] Test Trigger writes event to IntegrationLogs
- [x] Default params editor saves values
- [x] Test Call panel runs deterministic mock responses
- [x] IntegrationLogs shows real-time events
- [x] Search & filter works
- [x] Reconnect flow simulates OAuth consent
- [x] All state persists in localStorage
- [x] No backend calls; all deterministic mocks

## Styling

- Consistent with existing Dashboard & Canvas styles
- Card radius: 10-12px
- Subtle shadows
- Color tokens:
  - Primary: #2B6DF6
  - Success: #2ECC71
  - Warning: #FFA726
  - Error: #FF5252
- Responsive layout (3-column grid on desktop, stacked on mobile)

## Next Steps

- Add integration analytics dashboard
- Support webhook configuration
- Add integration templates
- Export integration configuration
- Share integration settings

