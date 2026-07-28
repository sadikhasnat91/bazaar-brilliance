import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Package, Truck, RotateCcw, CreditCard, MessageCircle } from "lucide-react";
export const Route = createFileRoute("/help")({
  head: () => ({ meta: [{ title: "Help center — Bazaar" }, { name: "description", content: "Help articles and support." }, { property: "og:url", content: "/help" }], links: [{ rel: "canonical", href: "/help" }] }),
  component: () => (
    <div>
      <div className="gradient-hero text-white"><div className="mx-auto max-w-5xl px-4 py-14"><h1 className="text-4xl md:text-5xl font-black">Help center</h1><p className="mt-3 text-white/85">Find answers or reach our team.</p></div></div>
      <div className="mx-auto max-w-5xl px-4 py-10 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[{icon:Package,t:"Orders",h:"/track"},{icon:Truck,t:"Delivery",h:"/faq"},{icon:RotateCcw,t:"Returns",h:"/refund"},{icon:CreditCard,t:"Payments",h:"/faq"}].map(c=>(<Link key={c.t} to={c.h} className="rounded-2xl border bg-card p-6 card-lift"><c.icon className="h-6 w-6 text-brand"/><p className="mt-3 font-semibold">{c.t}</p><p className="text-xs text-muted-foreground">Learn more</p></Link>))}</div>
        <div className="rounded-2xl border bg-card p-6 text-center"><MessageCircle className="mx-auto h-8 w-8 text-brand"/><p className="mt-3 font-semibold">Still need help?</p><Button asChild className="mt-3"><Link to="/contact">Contact support</Link></Button></div>
      </div>
    </div>
  ),
});
