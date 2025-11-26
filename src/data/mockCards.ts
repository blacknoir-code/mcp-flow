import { mockFunctions } from "./mockFunctions";

export interface Card {
  id: string;
  name: string;
  app: string;
  category: string;
  type: "action" | "query" | "transform" | "logic";
  tags: string[];
  description: string;
  complexity: "basic" | "advanced";
  inputSchema: any;
  outputSchema: any;
  examples: {
    request: any;
    response: any;
  };
  icon?: string;
}

export const mockCards: Card[] = [
  {
    id: "gmail.getUnread",
    name: "Get Unread Emails",
    app: "Gmail",
    category: "email",
    type: "query",
    tags: ["email", "inbox", "unread"],
    description: "Fetch unread emails from the inbox with optional filters.",
    complexity: "basic",
    inputSchema: {
      type: "object",
      properties: {
        label: { type: "string", description: "Gmail label", default: "inbox" },
        unread: { type: "boolean", description: "Filter unread only", default: true },
        limit: { type: "number", description: "Max results", default: 10 },
      },
    },
    outputSchema: {
      type: "object",
      properties: {
        emails: { type: "array", items: { type: "object" } },
        count: { type: "number" },
      },
    },
    examples: {
      request: { label: "inbox", unread: true, limit: 10 },
      response: {
        emails: [{ id: "e1", subject: "Test", from: "test@example.com" }],
        count: 1,
      },
    },
  },
  {
    id: "gmail.sendEmail",
    name: "Send Email",
    app: "Gmail",
    category: "email",
    type: "action",
    tags: ["email", "send", "compose"],
    description: "Send an email via Gmail.",
    complexity: "basic",
    inputSchema: {
      type: "object",
      properties: {
        to: { type: "string", description: "Recipient email", required: true },
        subject: { type: "string", description: "Email subject", required: true },
        body: { type: "string", description: "Email body", required: true },
      },
      required: ["to", "subject", "body"],
    },
    outputSchema: {
      type: "object",
      properties: {
        messageId: { type: "string" },
        success: { type: "boolean" },
      },
    },
    examples: {
      request: { to: "user@example.com", subject: "Hello", body: "Test email" },
      response: { messageId: "msg-123", success: true },
    },
  },
  {
    id: "jira.updateTicket",
    name: "Update Jira Ticket",
    app: "Jira",
    category: "tickets",
    type: "action",
    tags: ["ticket", "update", "jira"],
    description: "Update an existing Jira ticket with new status or fields.",
    complexity: "basic",
    inputSchema: {
      type: "object",
      properties: {
        ticketId: { type: "string", description: "Jira ticket ID", required: true },
        status: { type: "string", enum: ["To Do", "In Progress", "Done"], description: "New status" },
        project: { type: "string", description: "Project key", default: "PROJ" },
      },
      required: ["ticketId"],
    },
    outputSchema: {
      type: "object",
      properties: {
        updated: { type: "array", items: { type: "string" } },
        failures: { type: "array" },
      },
    },
    examples: {
      request: { ticketId: "PROJ-123", status: "In Progress" },
      response: { updated: ["PROJ-123"], failures: [] },
    },
  },
  {
    id: "jira.createTicket",
    name: "Create Jira Ticket",
    app: "Jira",
    category: "tickets",
    type: "action",
    tags: ["ticket", "create", "jira"],
    description: "Create a new Jira ticket.",
    complexity: "basic",
    inputSchema: {
      type: "object",
      properties: {
        project: { type: "string", description: "Project key", required: true },
        summary: { type: "string", description: "Ticket summary", required: true },
        description: { type: "string", description: "Ticket description" },
        issueType: { type: "string", enum: ["Bug", "Task", "Story"], default: "Task" },
      },
      required: ["project", "summary"],
    },
    outputSchema: {
      type: "object",
      properties: {
        ticketId: { type: "string" },
        key: { type: "string" },
        url: { type: "string" },
      },
    },
    examples: {
      request: { project: "PROJ", summary: "New task", issueType: "Task" },
      response: { ticketId: "12345", key: "PROJ-124", url: "https://jira.example.com/PROJ-124" },
    },
  },
  {
    id: "slack.sendMessage",
    name: "Send Slack Message",
    app: "Slack",
    category: "communication",
    type: "action",
    tags: ["slack", "message", "post"],
    description: "Send a message to a Slack channel.",
    complexity: "basic",
    inputSchema: {
      type: "object",
      properties: {
        channel: { type: "string", description: "Slack channel", default: "#general" },
        message: { type: "string", description: "Message text", required: true },
        threadTs: { type: "string", description: "Thread timestamp (optional)" },
      },
      required: ["channel", "message"],
    },
    outputSchema: {
      type: "object",
      properties: {
        channel: { type: "string" },
        messageId: { type: "string" },
        success: { type: "boolean" },
      },
    },
    examples: {
      request: { channel: "#general", message: "Hello from MCP!" },
      response: { channel: "#general", messageId: "1234567890.123456", success: true },
    },
  },
  {
    id: "slack.getChannels",
    name: "Get Slack Channels",
    app: "Slack",
    category: "communication",
    type: "query",
    tags: ["slack", "channels", "list"],
    description: "Retrieve list of Slack channels.",
    complexity: "basic",
    inputSchema: {
      type: "object",
      properties: {
        types: { type: "array", items: { type: "string" }, description: "Channel types", default: ["public_channel"] },
        excludeArchived: { type: "boolean", description: "Exclude archived", default: true },
      },
    },
    outputSchema: {
      type: "object",
      properties: {
        channels: { type: "array", items: { type: "object" } },
        count: { type: "number" },
      },
    },
    examples: {
      request: { types: ["public_channel"], excludeArchived: true },
      response: { channels: [{ id: "C123", name: "general" }], count: 1 },
    },
  },
  {
    id: "notion.createPage",
    name: "Create Notion Page",
    app: "Notion",
    category: "data",
    type: "action",
    tags: ["notion", "page", "create"],
    description: "Create a new page in Notion.",
    complexity: "advanced",
    inputSchema: {
      type: "object",
      properties: {
        parentId: { type: "string", description: "Parent page ID", required: true },
        title: { type: "string", description: "Page title", required: true },
        content: { type: "string", description: "Page content (markdown)" },
      },
      required: ["parentId", "title"],
    },
    outputSchema: {
      type: "object",
      properties: {
        pageId: { type: "string" },
        url: { type: "string" },
      },
    },
    examples: {
      request: { parentId: "page-123", title: "New Page", content: "Content here" },
      response: { pageId: "page-456", url: "https://notion.so/page-456" },
    },
  },
  {
    id: "transform.filter",
    name: "Filter Data",
    app: "Transform",
    category: "transform",
    type: "transform",
    tags: ["filter", "data", "transform"],
    description: "Filter an array of data based on conditions.",
    complexity: "basic",
    inputSchema: {
      type: "object",
      properties: {
        data: { type: "array", description: "Input array", required: true },
        condition: { type: "string", description: "Filter condition (JSON path)", required: true },
      },
      required: ["data", "condition"],
    },
    outputSchema: {
      type: "object",
      properties: {
        filtered: { type: "array" },
        count: { type: "number" },
      },
    },
    examples: {
      request: { data: [{ id: 1, status: "active" }], condition: "$.status == 'active'" },
      response: { filtered: [{ id: 1, status: "active" }], count: 1 },
    },
  },
  {
    id: "transform.map",
    name: "Map Data",
    app: "Transform",
    category: "transform",
    type: "transform",
    tags: ["map", "data", "transform"],
    description: "Transform each item in an array using a mapping function.",
    complexity: "advanced",
    inputSchema: {
      type: "object",
      properties: {
        data: { type: "array", description: "Input array", required: true },
        mapping: { type: "string", description: "Mapping expression", required: true },
      },
      required: ["data", "mapping"],
    },
    outputSchema: {
      type: "object",
      properties: {
        mapped: { type: "array" },
      },
    },
    examples: {
      request: { data: [{ name: "Alice" }], mapping: "$.name.toUpperCase()" },
      response: { mapped: [{ name: "ALICE" }] },
    },
  },
  {
    id: "logic.if",
    name: "If Condition",
    app: "Logic",
    category: "logic",
    type: "logic",
    tags: ["if", "condition", "logic"],
    description: "Conditional branching based on a condition.",
    complexity: "basic",
    inputSchema: {
      type: "object",
      properties: {
        condition: { type: "boolean", description: "Condition to evaluate", required: true },
        trueValue: { type: "any", description: "Value if true" },
        falseValue: { type: "any", description: "Value if false" },
      },
      required: ["condition"],
    },
    outputSchema: {
      type: "object",
      properties: {
        result: { type: "any" },
      },
    },
    examples: {
      request: { condition: true, trueValue: "Yes", falseValue: "No" },
      response: { result: "Yes" },
    },
  },
  {
    id: "logic.switch",
    name: "Switch Case",
    app: "Logic",
    category: "logic",
    type: "logic",
    tags: ["switch", "case", "logic"],
    description: "Multi-way branching based on a value.",
    complexity: "advanced",
    inputSchema: {
      type: "object",
      properties: {
        value: { type: "string", description: "Value to match", required: true },
        cases: { type: "object", description: "Case mappings", required: true },
        default: { type: "any", description: "Default value" },
      },
      required: ["value", "cases"],
    },
    outputSchema: {
      type: "object",
      properties: {
        result: { type: "any" },
      },
    },
    examples: {
      request: { value: "a", cases: { a: "Alpha", b: "Beta" }, default: "Unknown" },
      response: { result: "Alpha" },
    },
  },
  {
    id: "ai.summarize",
    name: "Summarize Text",
    app: "AI",
    category: "ai",
    type: "transform",
    tags: ["ai", "summarize", "text"],
    description: "Generate a summary of text using AI.",
    complexity: "advanced",
    inputSchema: {
      type: "object",
      properties: {
        text: { type: "string", description: "Text to summarize", required: true },
        maxLength: { type: "number", description: "Max summary length", default: 100 },
      },
      required: ["text"],
    },
    outputSchema: {
      type: "object",
      properties: {
        summary: { type: "string" },
        length: { type: "number" },
      },
    },
    examples: {
      request: { text: "Long text here...", maxLength: 100 },
      response: { summary: "Short summary", length: 50 },
    },
  },
  {
    id: "webhook.trigger",
    name: "Trigger Webhook",
    app: "Webhook",
    category: "data",
    type: "action",
    tags: ["webhook", "trigger", "http"],
    description: "Trigger an external webhook URL.",
    complexity: "basic",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "Webhook URL", required: true },
        method: { type: "string", enum: ["GET", "POST", "PUT"], default: "POST" },
        body: { type: "object", description: "Request body" },
        headers: { type: "object", description: "Custom headers" },
      },
      required: ["url"],
    },
    outputSchema: {
      type: "object",
      properties: {
        statusCode: { type: "number" },
        response: { type: "object" },
      },
    },
    examples: {
      request: { url: "https://example.com/webhook", method: "POST", body: { event: "test" } },
      response: { statusCode: 200, response: { success: true } },
    },
  },
  {
    id: "utils.delay",
    name: "Delay",
    app: "Utils",
    category: "utils",
    type: "logic",
    tags: ["delay", "wait", "utils"],
    description: "Wait for a specified duration before continuing.",
    complexity: "basic",
    inputSchema: {
      type: "object",
      properties: {
        duration: { type: "number", description: "Delay in milliseconds", required: true, default: 1000 },
      },
      required: ["duration"],
    },
    outputSchema: {
      type: "object",
      properties: {
        waited: { type: "number" },
      },
    },
    examples: {
      request: { duration: 2000 },
      response: { waited: 2000 },
    },
  },
  {
    id: "utils.log",
    name: "Log Data",
    app: "Utils",
    category: "utils",
    type: "transform",
    tags: ["log", "debug", "utils"],
    description: "Log data to console or file for debugging.",
    complexity: "basic",
    inputSchema: {
      type: "object",
      properties: {
        data: { type: "any", description: "Data to log", required: true },
        level: { type: "string", enum: ["info", "warn", "error"], default: "info" },
      },
      required: ["data"],
    },
    outputSchema: {
      type: "object",
      properties: {
        logged: { type: "boolean" },
      },
    },
    examples: {
      request: { data: { test: "value" }, level: "info" },
      response: { logged: true },
    },
  },
];

