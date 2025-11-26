import { v4 as uuidv4 } from "uuid";

export interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "overdue" | "cancelled";
  plan: string;
  seats: number;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
}

export const mockInvoices: Invoice[] = [
  {
    id: uuidv4(),
    number: "INV-2024-001",
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 99.00,
    currency: "USD",
    status: "paid",
    plan: "Pro",
    seats: 5,
    items: [
      {
        description: "Pro Plan - 5 seats",
        quantity: 1,
        unitPrice: 99.00,
        total: 99.00,
      },
    ],
  },
  {
    id: uuidv4(),
    number: "INV-2024-002",
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 199.00,
    currency: "USD",
    status: "pending",
    plan: "Team",
    seats: 10,
    items: [
      {
        description: "Team Plan - 10 seats",
        quantity: 1,
        unitPrice: 199.00,
        total: 199.00,
      },
    ],
  },
  {
    id: uuidv4(),
    number: "INV-2024-003",
    date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 99.00,
    currency: "USD",
    status: "paid",
    plan: "Pro",
    seats: 5,
    items: [
      {
        description: "Pro Plan - 5 seats",
        quantity: 1,
        unitPrice: 99.00,
        total: 99.00,
      },
    ],
  },
];

