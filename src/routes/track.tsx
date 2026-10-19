import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Package, PackageCheck, Truck, Home, MapPin, Clock, ShieldCheck, CreditCard, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/track")({
  head: () => ({ meta: [{ title: "Track order — Bazaar" }, { name: "description", content: "Track your Bazaar order in real time" }] }),
  component: TrackPage,
});

const steps = [
  { key: "pending", label: "Pending", icon: Clock, date: "Aug 02, 08:14 PM" },
  { key: "confirmed", label: "Payment Confirmed", icon: Check, date: "Aug 02, 08:15 PM" },
  { key: "packed", label: "Packed", icon: Package, date: "Aug 02, 08:45 PM" },
  { key: "shipped", label: "Shipped", icon: Truck, date: "Aug 03, 10:11 AM" },
  { key: "out", label: "Out for delivery", icon: MapPin, date: "Aug 03, 02:00 PM" },
  { key: "delivered", label: "Delivered", icon: PackageCheck, date: "Aug 03, 04:47 PM" },
];

function TrackPage() {
  const [id, setId] = useState("BZ483920");
  const current = 1; // Payment confirmed & processing

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-black">Track your order</h1>
      <p className="mt-1 text-muted-foreground">Enter your order ID to see real-time payment & delivery status</p>

      <form onSubmit={(e) => e.preventDefault()} className="mt-6 flex gap-2">
        <Input value={id} onChange={(e) => setId(e.target.value)} placeholder="e.g. BZ483920" className="rounded-full" />
        <Button className="rounded-full font-bold">Track</Button>
      </form>

      <div className="mt-8 rounded-3xl border bg-card p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-6">
          <div>
            <p className="text-sm text-muted-foreground">Order ID</p>
            <p className="text-2xl font-black font-mono">{id}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Payment Status</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-300 font-bold">
                ✓ PAID VIA BKASH
              </Badge>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Gateway Transaction ID</p>
            <p className="font-mono font-bold text-slate-700 dark:text-slate-300">BKSH-9X82F14</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Delivery to</p>
            <p className="font-semibold">Dhanmondi, Dhaka</p>
          </div>
        </div>

        <div className="mt-8 relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />
          <ol className="space-y-6">
            {steps.map((s, i) => {
              const done = i <= current;
              const active = i === current;
              return (
                <li key={s.key} className="relative flex items-start gap-4">
                  <div className={cn("grid h-10 w-10 place-items-center rounded-full border-2 z-10", done ? "bg-emerald-500 text-white border-emerald-500" : "bg-background border-border text-muted-foreground", active && "ring-4 ring-emerald-500/20")}>
                    <s.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className={cn("font-semibold", !done && "text-muted-foreground")}>{s.label}</p>
                    <p className="text-xs text-muted-foreground">{done ? s.date : "Pending"}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-8 flex gap-3 border-t pt-6">
          <Button asChild className="font-bold"><Link to="/account" search={{ tab: "orders" }}>Order details</Link></Button>
          <Button variant="outline" asChild><Link to="/help">Need help?</Link></Button>
        </div>
      </div>
    </div>
  );
}
