import { Node, Edge } from "reactflow";
import { NodeData } from "./sampleNodes";

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: Node<NodeData>[];
  edges: Edge[];
  timeSaved: string;
}

export const sampleTemplates: Template[] = [
  {
    id: "template-1",
    name: "Gmail → Jira Triage",
    description: "Auto-create Jira tickets from unread emails",
    category: "Productivity",
    timeSaved: "2h/week",
    nodes: [
      {
        id: "t1-1",
        type: "cardNode",
        position: { x: 0, y: 0 },
        data: {
          title: "Get Unread Emails",
          app: "Gmail",
          functionName: "listEmails",
          params: { label: "inbox", unread: true },
          status: "idle"
        }
      },
      {
        id: "t1-2",
        type: "cardNode",
        position: { x: 300, y: 0 },
        data: {
          title: "Extract Ticket Info",
          app: "Internal",
          functionName: "extractInfo",
          params: {},
          status: "idle"
        }
      },
      {
        id: "t1-3",
        type: "cardNode",
        position: { x: 600, y: 0 },
        data: {
          title: "Create Jira Tickets",
          app: "Jira",
          functionName: "createTickets",
          params: { project: "PROJ" },
          status: "idle"
        }
      }
    ],
    edges: [
      { id: "t1-e1", source: "t1-1", target: "t1-2", type: "smoothstep" },
      { id: "t1-e2", source: "t1-2", target: "t1-3", type: "smoothstep" }
    ]
  },
  {
    id: "template-2",
    name: "Daily Standup Summary",
    description: "Collect updates and generate summaries",
    category: "Communication",
    timeSaved: "30min/day",
    nodes: [
      {
        id: "t2-1",
        type: "cardNode",
        position: { x: 0, y: 0 },
        data: {
          title: "Collect Slack Updates",
          app: "Slack",
          functionName: "getMessages",
          params: { channel: "#standup" },
          status: "idle"
        }
      },
      {
        id: "t2-2",
        type: "cardNode",
        position: { x: 300, y: 0 },
        data: {
          title: "Generate Summary",
          app: "Internal",
          functionName: "summarize",
          params: { mode: "standup" },
          status: "idle"
        }
      },
      {
        id: "t2-3",
        type: "cardNode",
        position: { x: 600, y: 0 },
        data: {
          title: "Post Summary",
          app: "Slack",
          functionName: "postMessage",
          params: { channel: "#team" },
          status: "idle"
        }
      }
    ],
    edges: [
      { id: "t2-e1", source: "t2-1", target: "t2-2", type: "smoothstep" },
      { id: "t2-e2", source: "t2-2", target: "t2-3", type: "smoothstep" }
    ]
  },
  {
    id: "template-3",
    name: "Support Escalation",
    description: "Auto-escalate critical issues",
    category: "Support",
    timeSaved: "1h/day",
    nodes: [
      {
        id: "t3-1",
        type: "cardNode",
        position: { x: 0, y: 0 },
        data: {
          title: "Monitor Support Channel",
          app: "Slack",
          functionName: "monitorChannel",
          params: { channel: "#support" },
          status: "idle"
        }
      },
      {
        id: "t3-2",
        type: "cardNode",
        position: { x: 300, y: 0 },
        data: {
          title: "Check Priority",
          app: "Internal",
          functionName: "checkPriority",
          params: { threshold: "high" },
          status: "idle"
        }
      },
      {
        id: "t3-3",
        type: "cardNode",
        position: { x: 600, y: 0 },
        data: {
          title: "Create Jira Ticket",
          app: "Jira",
          functionName: "createTicket",
          params: { priority: "Critical" },
          status: "idle"
        }
      }
    ],
    edges: [
      { id: "t3-e1", source: "t3-1", target: "t3-2", type: "smoothstep" },
      { id: "t3-e2", source: "t3-2", target: "t3-3", type: "smoothstep" }
    ]
  }
];

