import { MCPFunction } from "./mockMcpServers";

export const mockFunctions: MCPFunction[] = [
  {
    id: "gmail-get-unread",
    name: "gmail.get_unread_emails",
    idempotent: true,
    inputsSchema: {
      type: "object",
      properties: {
        label: {
          type: "string",
          description: "Gmail label to filter by",
          default: "inbox",
        },
        unread: {
          type: "boolean",
          description: "Filter only unread emails",
          default: true,
        },
        limit: {
          type: "number",
          description: "Maximum number of emails",
          default: 10,
        },
      },
      required: ["label"],
    },
    outputsSchema: {
      type: "object",
      properties: {
        emails: {
          type: "array",
          items: { type: "object" },
        },
        count: { type: "number" },
      },
    },
    authScopes: ["gmail.readonly"],
    examples: {
      request: {
        label: "inbox",
        unread: true,
        limit: 10,
      },
      response: {
        emails: [
          {
            id: "e1",
            subject: "Test Email",
            from: "test@example.com",
            date: "2024-01-15T10:30:00Z",
          },
        ],
        count: 1,
      },
    },
    cost: "cheap",
    appType: "gmail",
  },
  {
    id: "jira-update-ticket",
    name: "jira.update_ticket",
    idempotent: false,
    inputsSchema: {
      type: "object",
      properties: {
        ticketId: {
          type: "string",
          description: "Jira ticket ID",
          required: true,
        },
        status: {
          type: "string",
          enum: ["To Do", "In Progress", "Done"],
          description: "New status",
        },
        project: {
          type: "string",
          description: "Jira project key",
          default: "PROJ",
        },
      },
      required: ["ticketId", "status"],
    },
    outputsSchema: {
      type: "object",
      properties: {
        updated: { type: "array", items: { type: "string" } },
        failures: { type: "array" },
      },
    },
    authScopes: ["jira.write"],
    examples: {
      request: {
        ticketId: "PROJ-123",
        status: "In Progress",
        project: "PROJ",
      },
      response: {
        updated: ["PROJ-123"],
        failures: [],
      },
    },
    cost: "expensive",
    appType: "jira",
  },
  {
    id: "slack-post-message",
    name: "slack.post_message",
    idempotent: false,
    inputsSchema: {
      type: "object",
      properties: {
        channel: {
          type: "string",
          description: "Slack channel",
          default: "#general",
        },
        message: {
          type: "string",
          description: "Message text",
          required: true,
        },
      },
      required: ["channel", "message"],
    },
    outputsSchema: {
      type: "object",
      properties: {
        channel: { type: "string" },
        messageId: { type: "string" },
        success: { type: "boolean" },
      },
    },
    authScopes: ["chat:write"],
    examples: {
      request: {
        channel: "#general",
        message: "Hello from MCP!",
      },
      response: {
        channel: "#general",
        messageId: "1234567890.123456",
        success: true,
      },
    },
    cost: "cheap",
    appType: "slack",
  },
  {
    id: "notion-create-page",
    name: "notion.create_page",
    idempotent: false,
    inputsSchema: {
      type: "object",
      properties: {
        parentId: {
          type: "string",
          description: "Parent page ID",
          required: true,
        },
        title: {
          type: "string",
          description: "Page title",
          required: true,
        },
        content: {
          type: "string",
          description: "Page content",
        },
      },
      required: ["parentId", "title"],
    },
    outputsSchema: {
      type: "object",
      properties: {
        pageId: { type: "string" },
        url: { type: "string" },
      },
    },
    authScopes: ["notion.write"],
    examples: {
      request: {
        parentId: "page-123",
        title: "New Page",
        content: "Page content here",
      },
      response: {
        pageId: "page-456",
        url: "https://notion.so/page-456",
      },
    },
    cost: "expensive",
    appType: "notion",
  },
];

