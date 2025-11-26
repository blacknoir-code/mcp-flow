import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useBillingStore } from "@/stores/billingStore";
import { appendAuditLog } from "@/stores/auditStore";
import { useToastSystem } from "./ToastSystem";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowDownTrayIcon, CreditCardIcon, PlusIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import { MetricsSparkline } from "@/components/mcp/MetricsSparkline";

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    features: ["5 workflows", "100 runs/month", "Basic support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 99,
    features: ["Unlimited workflows", "10,000 runs/month", "Priority support", "Advanced analytics"],
  },
  {
    id: "team",
    name: "Team",
    price: 199,
    features: ["Everything in Pro", "Team collaboration", "SSO", "Custom integrations"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 499,
    features: ["Everything in Team", "Dedicated support", "SLA", "Custom deployment"],
  },
];

export const BillingPage = () => {
  const { plan, seats, nextBillingDate, invoices, paymentMethods, changePlan, addPaymentMethod, removePaymentMethod, setDefaultPaymentMethod, usageMetrics } =
    useBillingStore();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [newCard, setNewCard] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });
  const toast = useToastSystem();

  const currentPlan = plans.find((p) => p.id === plan);

  const handleUpgrade = (newPlan: string) => {
    changePlan(newPlan as any);
    appendAuditLog({
      user: "current_user",
      userEmail: "user@example.com",
      eventType: "billing",
      action: "upgrade_plan",
      resource: "billing",
      metadata: { fromPlan: plan, toPlan: newPlan },
    });
    toast.showSuccess(`Upgraded to ${newPlan} plan`);
    setShowUpgradeModal(false);
  };

  const handleAddCard = () => {
    if (newCard.number && newCard.expiry && newCard.cvc && newCard.name) {
      const [month, year] = newCard.expiry.split("/");
      addPaymentMethod({
        type: "card",
        last4: newCard.number.slice(-4),
        brand: "visa",
        expiryMonth: parseInt(month),
        expiryYear: 2000 + parseInt(year),
        isDefault: paymentMethods.length === 0,
      });
      toast.showSuccess("Payment method added");
      setShowAddCardModal(false);
      setNewCard({ number: "", expiry: "", cvc: "", name: "" });
    }
  };

  const currentUsage = usageMetrics[usageMetrics.length - 1] || {
    workflowsExecuted: 0,
    runMinutes: 0,
    integrationCalls: 0,
    month: dayjs().format("YYYY-MM"),
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Current Subscription</h3>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-bold">{currentPlan?.name}</span>
                <Badge variant="outline">${currentPlan?.price}/month</Badge>
              </div>
              <p className="text-sm text-gray-500">
                {seats} seats • Next billing: {dayjs(nextBillingDate).format("MMM D, YYYY")}
              </p>
            </div>
            <Button onClick={() => setShowUpgradeModal(true)}>
              Change Plan
            </Button>
          </div>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
        <div className="space-y-2">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <CreditCardIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="font-medium">
                    •••• •••• •••• {method.last4}
                  </div>
                  <div className="text-sm text-gray-500">
                    Expires {method.expiryMonth}/{method.expiryYear}
                  </div>
                </div>
                {method.isDefault && (
                  <Badge variant="outline" className="text-xs">
                    Default
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                {!method.isDefault && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDefaultPaymentMethod(method.id)}
                  >
                    Set Default
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removePaymentMethod(method.id)}
                  className="text-red-600"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={() => setShowAddCardModal(true)}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Payment Method
        </Button>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Usage & Quotas</h3>
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="text-sm text-gray-500 mb-1">Workflows Executed</div>
            <div className="text-2xl font-bold">{currentUsage.workflowsExecuted.toLocaleString()}</div>
            <div className="text-xs text-gray-400 mt-1">This month</div>
            <MetricsSparkline
              data={usageMetrics.map((m) => m.workflowsExecuted)}
              width={100}
              height={30}
            />
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500 mb-1">Run Minutes</div>
            <div className="text-2xl font-bold">{currentUsage.runMinutes.toLocaleString()}</div>
            <div className="text-xs text-gray-400 mt-1">This month</div>
            <MetricsSparkline
              data={usageMetrics.map((m) => m.runMinutes)}
              width={100}
              height={30}
            />
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500 mb-1">Integration Calls</div>
            <div className="text-2xl font-bold">{currentUsage.integrationCalls.toLocaleString()}</div>
            <div className="text-xs text-gray-400 mt-1">This month</div>
            <MetricsSparkline
              data={usageMetrics.map((m) => m.integrationCalls)}
              width={100}
              height={30}
            />
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Invoices</h3>
        <div className="space-y-2">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">{invoice.number}</div>
                <div className="text-sm text-gray-500">
                  {dayjs(invoice.date).format("MMM D, YYYY")} • ${invoice.amount.toFixed(2)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    invoice.status === "paid"
                      ? "default"
                      : invoice.status === "pending"
                      ? "outline"
                      : "destructive"
                  }
                >
                  {invoice.status}
                </Badge>
                <Button size="sm" variant="outline">
                  <ArrowDownTrayIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Change Plan</DialogTitle>
            <DialogDescription>
              Select a plan that fits your needs
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {plans.map((p) => (
              <Card
                key={p.id}
                className={`p-4 cursor-pointer transition-all ${
                  plan === p.id ? "border-2 border-blue-500" : ""
                }`}
                onClick={() => handleUpgrade(p.id)}
              >
                <div className="font-bold text-lg mb-1">{p.name}</div>
                <div className="text-2xl font-bold mb-2">
                  ${p.price}
                  <span className="text-sm font-normal text-gray-500">/month</span>
                </div>
                <ul className="space-y-1 text-sm text-gray-600">
                  {p.features.map((feature) => (
                    <li key={feature}>• {feature}</li>
                  ))}
                </ul>
                {plan === p.id && (
                  <Badge className="mt-2">Current Plan</Badge>
                )}
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddCardModal} onOpenChange={setShowAddCardModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Add a new credit card for billing
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Card Number</Label>
              <Input
                value={newCard.number}
                onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                placeholder="1234 5678 9012 3456"
                className="mt-2"
                maxLength={19}
              />
            </div>
            <div>
              <Label>Cardholder Name</Label>
              <Input
                value={newCard.name}
                onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                placeholder="John Doe"
                className="mt-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Expiry</Label>
                <Input
                  value={newCard.expiry}
                  onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                  placeholder="MM/YY"
                  className="mt-2"
                  maxLength={5}
                />
              </div>
              <div>
                <Label>CVC</Label>
                <Input
                  value={newCard.cvc}
                  onChange={(e) => setNewCard({ ...newCard, cvc: e.target.value })}
                  placeholder="123"
                  className="mt-2"
                  maxLength={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddCardModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCard} className="bg-gradient-to-r from-primary to-electric-glow">
                Add Card
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

