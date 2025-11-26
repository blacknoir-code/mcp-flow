export interface MockResponse {
  [key: string]: any;
}

export const mockResponses: Record<string, MockResponse> = {
  get_unread_emails: {
    emails: [
      { id: 'e1', subject: 'JIRA-123: Bug Report', from: 'alice@example.com', body: 'Found a critical bug...' },
      { id: 'e2', subject: 'PROJ-456: Feature Request', from: 'bob@example.com', body: 'Can we add...' },
      { id: 'e3', subject: 'JIRA-789: Question', from: 'charlie@example.com', body: 'How do I...' }
    ],
    count: 3,
    timestamp: new Date().toISOString()
  },
  extract_ticket_ids: {
    ticketIds: ['JIRA-123', 'PROJ-456', 'JIRA-789'],
    pattern: 'JIRA-\\d+|PROJ-\\d+',
    matches: 3
  },
  update_jira_ticket: {
    updated: ['JIRA-123', 'PROJ-456', 'JIRA-789'],
    failures: [],
    status: 'In Progress',
    updatedCount: 3
  },
  summarize_updates: {
    summary: 'Updated 3 tickets to In Progress status. Tickets: JIRA-123, PROJ-456, JIRA-789',
    ticketCount: 3,
    status: 'In Progress'
  },
  post_to_slack: {
    channel: '#product-updates',
    messageId: 'msg_1691234567',
    timestamp: '1691234567',
    success: true
  },
  filter: {
    filtered: ['JIRA-123'],
    total: 3,
    criteria: { assignee: 'me' }
  },
  summarize: {
    summary: 'Daily standup summary: 3 updates collected',
    participants: 5,
    mode: 'concise'
  }
};

export const mockLogs: Record<string, string[]> = {
  get_unread_emails: [
    '[INFO] Connecting to Gmail API...',
    '[INFO] Fetching unread emails with label: inbox',
    '[INFO] Found 3 unread emails',
    '[SUCCESS] Retrieved emails successfully'
  ],
  extract_ticket_ids: [
    '[INFO] Parsing email content...',
    '[INFO] Applying pattern: JIRA-\\d+|PROJ-\\d+',
    '[INFO] Found 3 ticket IDs: JIRA-123, PROJ-456, JIRA-789',
    '[SUCCESS] Extraction complete'
  ],
  update_jira_ticket: [
    '[INFO] Connecting to Jira API...',
    '[INFO] Updating 3 tickets to status: In Progress',
    '[INFO] Updated JIRA-123',
    '[INFO] Updated PROJ-456',
    '[INFO] Updated JIRA-789',
    '[SUCCESS] All tickets updated successfully'
  ],
  summarize_updates: [
    '[INFO] Generating summary...',
    '[INFO] Processing 3 ticket updates',
    '[INFO] Formatting summary message',
    '[SUCCESS] Summary generated'
  ],
  post_to_slack: [
    '[INFO] Connecting to Slack API...',
    '[INFO] Posting message to channel: #product-updates',
    '[SUCCESS] Message posted successfully'
  ]
};

