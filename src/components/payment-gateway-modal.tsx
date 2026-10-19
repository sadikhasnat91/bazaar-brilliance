// payment-gateway-modal.tsx
// This modal is the real payment gateway launcher for Bazaar.
// It connects to SSLCommerz API (supporting bKash, Nagad, Rocket, Card)
// and redirects the user to the official payment portal for live transactions.

import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatBDT } from "@/lib/data";
import {
  ShieldCheck,
  Lock,
  CreditCard,
  Smartphone,
  Wallet,
  Loader2,
  Globe,
  Building2,
  PackageCheck,
  ExternalLink,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { initSslCommerzPaymentFn } from "@/lib/payment-gateway-api";

export interface PaymentSuccessResult {
  paymentMethod: "bkash" | "nagad" | "rocket" | "card" | "cod";
  paymentStatus: "Paid" | "Pending";
  transactionId: string;
  paidAt: string;
}

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  initialMethod?: string;
  onPaymentSuccess: (result: PaymentSuccessResult) => void;
}

type PaymentMethodType = "bkash" | "nagad" | "rocket" | "card" | "cod";

const methods = [
  {
    v: "bkash" as PaymentMethodType,
    label: "bKash",
    sub: "Mobile wallet payment",
    icon: Smartphone,
    color: "text-[#E2136E]",
    activeBg: "bg-[#E2136E]",
    border: "border-[#E2136E]",
  },
  {
    v: "nagad" as PaymentMethodType,
    label: "Nagad",
    sub: "Mobile wallet payment",
    icon: Wallet,
    color: "text-[#F7941D]",
    activeBg: "bg-[#F7941D]",
    border: "border-[#F7941D]",
  },
  {
    v: "rocket" as PaymentMethodType,
    label: "Rocket",
    sub: "DBBL mobile banking",
    icon: Building2,
    color: "text-[#8C3494]",
    activeBg: "bg-[#8C3494]",
    border: "border-[#8C3494]",
  },
  {
    v: "card" as PaymentMethodType,
    label: "Card",
    sub: "Visa / Mastercard / Amex",
    icon: CreditCard,
    color: "text-indigo-600",
    activeBg: "bg-indigo-700",
    border: "border-indigo-600",
  },
  {
    v: "cod" as PaymentMethodType,
    label: "COD",
    sub: "Cash on delivery",
    icon: PackageCheck,
    color: "text-emerald-600",
    activeBg: "bg-emerald-600",
    border: "border-emerald-600",
  },
];

export function PaymentGatewayModal({
  isOpen,
  onClose,
  amount,
  customerName,
  customerEmail,
  customerPhone,
  initialMethod = "bkash",
  onPaymentSuccess,
}: PaymentGatewayModalProps) {
  const [method, setMethod] = useState<PaymentMethodType>(
    (initialMethod as PaymentMethodType) || "bkash"
  );
  const [isLaunching, setIsLaunching] = useState(false);

  const selected = methods.find((m) => m.v === method)!;

  const handleLaunchGateway = async () => {
    if (method === "cod") {
      const trxId = "COD-" + Math.floor(100000 + Math.random() * 900000);
      onPaymentSuccess({
        paymentMethod: "cod",
        paymentStatus: "Pending",
        transactionId: trxId,
        paidAt: new Date().toISOString(),
      });
      return;
    }

    setIsLaunching(true);
    const toastId = toast.loading("Connecting to SSLCommerz Payment Server...");

    try {
      const orderId = "BZ" + Math.floor(100000 + Math.random() * 900000);
      const res = await initSslCommerzPaymentFn({
        data: {
          amount,
          orderId,
          customerName: customerName || "Customer",
          customerEmail: customerEmail || "customer@example.com",
          customerPhone: customerPhone || "01700000000",
          paymentMethod: method,
          baseUrl: window.location.origin,
        },
      });

      if (res.success && res.redirectUrl) {
        toast.success("Gateway session created! Redirecting to official portal...", { id: toastId });
        setTimeout(() => {
          window.location.href = res.redirectUrl!;
        }, 800);
      } else {
        toast.error(
          res.error ||
            "Could not reach SSLCommerz API. Please check your credentials in Admin > Settings.",
          { id: toastId }
        );
        setIsLaunching(false);
      }
    } catch (err: any) {
      toast.error("Gateway error: " + (err.message || "Connection failed"), { id: toastId });
      setIsLaunching(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl border bg-card shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand font-black text-white text-lg">
                B
              </div>
              <div>
                <p className="font-bold text-base leading-tight">Bazaar Secure Pay</p>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <Lock className="h-3 w-3 text-emerald-400" />
                  Powered by SSLCommerz
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 uppercase tracking-wider">Amount Due</p>
              <p className="text-xl font-black text-emerald-400">{formatBDT(amount)}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Method Picker */}
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-3">
              Select payment method
            </p>
            <div className="grid grid-cols-5 gap-2 bg-muted/60 p-1.5 rounded-xl">
              {methods.map((m) => (
                <button
                  key={m.v}
                  type="button"
                  onClick={() => setMethod(m.v)}
                  className={cn(
                    "flex flex-col items-center justify-center py-2.5 px-1 rounded-lg text-[11px] font-semibold transition-all gap-1",
                    method === m.v
                      ? `${m.activeBg} text-white shadow-md`
                      : "hover:bg-background/80 text-muted-foreground"
                  )}
                >
                  <m.icon className="h-4 w-4" />
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Method Detail */}
          {method !== "cod" ? (
            <div className="rounded-xl border bg-muted/40 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-xl text-white shrink-0",
                    selected.activeBg
                  )}
                >
                  <selected.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-base">{selected.label} Gateway</p>
                  <p className="text-xs text-muted-foreground">{selected.sub}</p>
                </div>
                <Badge
                  variant="outline"
                  className="ml-auto border-emerald-400 text-emerald-600 dark:text-emerald-400 text-[10px]"
                >
                  LIVE
                </Badge>
              </div>

              <div className="border-t pt-3 space-y-1.5 text-xs text-muted-foreground">
                <p className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  Redirected to official {selected.label} payment portal
                </p>
                <p className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  256-bit SSL encrypted. Your credentials stay private.
                </p>
                <p className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  Real-time bank authorization & transaction verification
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border bg-muted/40 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white shrink-0">
                  <PackageCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-base">Cash on Delivery</p>
                  <p className="text-xs text-muted-foreground">Pay when parcel arrives at your door</p>
                </div>
              </div>
              <div className="border-t pt-3 space-y-1.5 text-xs text-muted-foreground">
                <p className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  Free inspection upon delivery
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  Easy 7-day return policy
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              type="button"
              onClick={handleLaunchGateway}
              disabled={isLaunching}
              className={cn(
                "w-full h-12 text-base font-bold text-white shadow-lg gap-2",
                method === "cod" ? "bg-emerald-600 hover:bg-emerald-700" : `${selected.activeBg} hover:opacity-90`
              )}
            >
              {isLaunching ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Launching Gateway...
                </>
              ) : method === "cod" ? (
                <>
                  <PackageCheck className="h-5 w-5" />
                  Confirm Cash on Delivery
                </>
              ) : (
                <>
                  <Globe className="h-5 w-5" />
                  Pay {formatBDT(amount)} via {selected.label}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            <p className="text-center text-[11px] text-muted-foreground pt-1">
              {method === "cod"
                ? "Your order will be packed & shipped immediately."
                : `You'll be securely redirected to ${selected.label}'s official payment portal.`}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
