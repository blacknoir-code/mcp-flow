import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Invoice } from "@/data/mockInvoices";
import { mockInvoices } from "@/data/mockInvoices";
import { v4 as uuidv4 } from "uuid";

export type Plan = "free" | "pro" | "team" | "enterprise";

interface PaymentMethod {
  id: string;
  type: "card";
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

interface UsageMetrics {
  workflowsExecuted: number;
  runMinutes: number;
  integrationCalls: number;
  month: string;
}

interface BillingState {
  plan: Plan;
  seats: number;
  nextBillingDate: string;
  invoices: Invoice[];
  paymentMethods: PaymentMethod[];
  usageMetrics: UsageMetrics[];

  changePlan: (newPlan: Plan) => void;
  updateSeats: (seats: number) => void;
  addInvoice: (invoice: Omit<Invoice, "id">) => void;
  addPaymentMethod: (method: Omit<PaymentMethod, "id">) => void;
  removePaymentMethod: (methodId: string) => void;
  setDefaultPaymentMethod: (methodId: string) => void;
  updateUsageMetrics: (metrics: UsageMetrics) => void;
}

export const useBillingStore = create<BillingState>()(
  persist(
    (set) => ({
      plan: "pro",
      seats: 5,
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      invoices: mockInvoices,
      paymentMethods: [
        {
          id: "pm-1",
          type: "card",
          last4: "4242",
          brand: "visa",
          expiryMonth: 12,
          expiryYear: 2025,
          isDefault: true,
        },
      ],
      usageMetrics: [
        {
          workflowsExecuted: 1250,
          runMinutes: 4500,
          integrationCalls: 8900,
          month: new Date().toISOString().slice(0, 7),
        },
      ],

      changePlan: (newPlan) =>
        set((state) => ({
          plan: newPlan,
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })),

      updateSeats: (seats) => set({ seats }),

      addInvoice: (invoice) =>
        set((state) => ({
          invoices: [{ ...invoice, id: uuidv4() }, ...state.invoices],
        })),

      addPaymentMethod: (method) =>
        set((state) => ({
          paymentMethods: [...state.paymentMethods, { ...method, id: `pm-${Date.now()}` }],
        })),

      removePaymentMethod: (methodId) =>
        set((state) => ({
          paymentMethods: state.paymentMethods.filter((m) => m.id !== methodId),
        })),

      setDefaultPaymentMethod: (methodId) =>
        set((state) => ({
          paymentMethods: state.paymentMethods.map((m) => ({
            ...m,
            isDefault: m.id === methodId,
          })),
        })),

      updateUsageMetrics: (metrics) =>
        set((state) => {
          const existing = state.usageMetrics.find((m) => m.month === metrics.month);
          if (existing) {
            return {
              usageMetrics: state.usageMetrics.map((m) =>
                m.month === metrics.month ? metrics : m
              ),
            };
          }
          return {
            usageMetrics: [...state.usageMetrics, metrics],
          };
        }),
    }),
    {
      name: "billing-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

