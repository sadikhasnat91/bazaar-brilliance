import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Package, PackageCheck, Truck, Home, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/track")({
  head: () => ({ meta: [{ title: "Track order — Bazaar" }, { name: "description", content: "Track your Bazaar order in real time" }] }),
  component: TrackPage,
});

const steps = [
  { key: "pending", label: "Pending", icon: Clock, date: "Jul 22, 09:14 AM" },
  { key: "confirmed", label: "Confirmed", icon: Check, date: "Jul 22, 09:32 AM" },
  { key: "packed", label: "Packed", icon: Package, date: "Jul 22, 02:45 PM" },
  { key: "shipped", label: "Shipped", icon: Truck, date: "Jul 23, 10:11 AM" },
  { key: "out", label: "Out for delivery", icon: MapPin, date: "Jul 24, 08:00 AM" },
  { key: "delivered", label: "Delivered", icon: PackageCheck, date: "Jul 24, 11:47 AM" },
];

function TrackPage() {
  const [id, setId] = useState("BZ483920");
  const current = 5; // delivered

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-black">Track your order</h1>
      <p className="mt-1 text-muted-foreground">Enter your order ID to see real-time status</p>

      <form onSubmit={(e) => e.preventDefault()} className="mt-6 flex gap-2">
        <Input value={id} onChange={(e) => setId(e.target.value)} placeholder="e.g. BZ483920" className="rounded-full" />
        <Button className="rounded-full">Track</Button>
      </form>

      <div className="mt-8 rounded-3xl border bg-card p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">Order ID</p>
            <p className="text-2xl font-black font-mono">{id}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Estimated delivery</p>
            <p className="font-semibold">Jul 24, 2026</p>
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
                  <div className={cn("grid h-10 w-10 place-items-center rounded-full border-2 z-10", done ? "bg-success text-success-foreground border-success" : "bg-background border-border text-muted-foreground", active && "ring-4 ring-success/20")}>
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

        <div className="mt-8 flex gap-3">
          <Button asChild><Link to="/account" search={{ tab: "orders" }}>Order details</Link></Button>
          <Button variant="outline" asChild><Link to="/help">Need help?</Link></Button>
        </div>
      </div>
    </div>
  );
}
