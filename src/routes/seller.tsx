import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Users, Truck, Shield } from "lucide-react";
export const Route = createFileRoute("/seller")({
  head: () => ({ meta: [{ title: "Sell on Bazaar" }, { name: "description", content: "Reach millions — join as a seller." }, { property: "og:url", content: "/seller" }], links: [{ rel: "canonical", href: "/seller" }] }),
  component: () => (
    <div>
      <div className="gradient-hero text-white"><div className="mx-auto max-w-5xl px-4 py-14"><h1 className="text-4xl md:text-5xl font-black">Sell on Bazaar</h1><p className="mt-3 text-white/85">Reach 12M+ shoppers across Bangladesh.</p></div></div>
      <div className="mx-auto max-w-5xl px-4 py-10 space-y-6">
        <div className="grid gap-4 md:grid-cols-3">{[{i:Users,t:"12M+ buyers"},{i:Truck,t:"Fulfilment support"},{i:Shield,t:"Verified payments"}].map(f=>(<div key={f.t} className="rounded-2xl border bg-card p-6 text-center card-lift"><f.i className="mx-auto h-8 w-8 text-brand"/><p className="mt-3 font-semibold">{f.t}</p></div>))}</div>
        <div className="rounded-2xl gradient-hero p-8 text-white text-center"><h3 className="text-2xl font-black">Start selling today</h3><Button asChild className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90"><Link to="/register">Create seller account</Link></Button></div>
      </div>
    </div>
  ),
});
