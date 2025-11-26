export interface MockResponse {
  [key: string]: any;
}

export const mockResponses: Record<string, MockResponse> = {
  get_unread_emails: {
    emails: [
      {
        id: "e1",
        subject: "JIRA-123: Bug Report",
        from: "alice@example.com",
        body: "Found a critical bug in the payment flow...",
        date: "2024-01-15T10:30:00Z",
        labels: ["inbox", "unread"],
      },
      {
        id: "e2",
        subject: "PROJ-456: Feature Request",
        from: "bob@example.com",
        body: "Can we add dark mode support?",
        date: "2024-01-15T09:15:00Z",
        labels: ["inbox", "unread"],
      },
    ],
    count: 2,
    timestamp: new Date().toISOString(),
  },
  extract_ticket_ids: {
    ticketIds: ["JIRA-123", "PROJ-456"],
    pattern: "JIRA-\\d+|PROJ-\\d+",
    matches: 2,
    source: "email",
  },
  update_jira_ticket: {
    updated: ["JIRA-123", "PROJ-456"],
    failures: [],
    status: "In Progress",
    updatedCount: 2,
    timestamp: new Date().toISOString(),
  },
  summarize_updates: {
    summary: "Updated 2 tickets to In Progress status. Tickets: JIRA-123, PROJ-456",
    ticketCount: 2,
    status: "In Progress",
    timestamp: new Date().toISOString(),
  },
  post_to_slack: {
    channel: "#product-updates",
    messageId: "msg_1691234567",
    timestamp: "1691234567",
    success: true,
    permalink: "https://workspace.slack.com/archives/C123/p1691234567",
  },
  filter: {
    filtered: ["JIRA-123"],
    total: 2,
    criteria: { assignee: "me" },
  },
  summarize: {
    summary: "Daily standup summary: 2 updates collected",
    participants: 5,
    mode: "concise",
  },
};

export const mockSchemas: Record<string, any> = {
  get_unread_emails: {
    name: "gmail.get_unread_emails",
    description: "Retrieve unread emails from Gmail inbox",
    inputs: {
      label: {
        type: "string",
        description: "Gmail label to filter by",
        default: "inbox",
        required: true,
      },
      unread: {
        type: "boolean",
        description: "Filter only unread emails",
        default: true,
        required: false,
      },
      limit: {
        type: "number",
        description: "Maximum number of emails to retrieve",
        default: 10,
        required: false,
      },
    },
    outputs: {
      emails: {
        type: "array",
        description: "List of email objects",
      },
      count: {
        type: "number",
        description: "Total count of emails",
      },
    },
    idempotent: true,
    rateLimit: "100 requests/hour",
    authScopes: ["gmail.readonly"],
  },
  update_jira_ticket: {
    name: "jira.update_ticket",
    description: "Update a Jira ticket status or fields",
    inputs: {
      ticketId: {
        type: "string",
        description: "Jira ticket ID (e.g., JIRA-123)",
        required: true,
      },
      status: {
        type: "string",
        description: "New status for the ticket",
        enum: ["To Do", "In Progress", "Done"],
        required: true,
      },
      project: {
        type: "string",
        description: "Jira project key",
        default: "PROJ",
        required: false,
      },
    },
    outputs: {
      updated: {
        type: "array",
        description: "List of updated ticket IDs",
      },
      failures: {
        type: "array",
        description: "List of failed updates",
      },
    },
    idempotent: false,
    rateLimit: "500 requests/hour",
    authScopes: ["jira.write"],
  },
  post_to_slack: {
    name: "slack.post_message",
    description: "Post a message to a Slack channel",
    inputs: {
      channel: {
        type: "string",
        description: "Slack channel name or ID",
        default: "#general",
        required: true,
      },
      message: {
        type: "string",
        description: "Message text to post",
        required: true,
      },
      threadTs: {
        type: "string",
        description: "Thread timestamp to reply to",
        required: false,
      },
    },
    outputs: {
      channel: {
        type: "string",
        description: "Channel where message was posted",
      },
      messageId: {
        type: "string",
        description: "Slack message timestamp",
      },
      success: {
        type: "boolean",
        description: "Whether message was posted successfully",
      },
    },
    idempotent: false,
    rateLimit: "1000 requests/hour",
    authScopes: ["chat:write"],
  },
};

export const defaultParams: Record<string, Record<string, any>> = {
  get_unread_emails: {
    label: "inbox",
    unread: true,
    limit: 10,
  },
  update_jira_ticket: {
    project: "PROJ",
    status: "In Progress",
  },
  post_to_slack: {
    channel: "#product-updates",
  },
  extract_ticket_ids: {
    pattern: "JIRA-\\d+|PROJ-\\d+",
  },
};

