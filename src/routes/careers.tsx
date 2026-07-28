import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
const jobs = [
  { t: "Senior Frontend Engineer", loc: "Dhaka · Full-time" },
  { t: "Product Designer", loc: "Remote · Full-time" },
  { t: "Warehouse Operations Lead", loc: "Chattogram · Full-time" },
  { t: "Customer Support (Bangla)", loc: "Dhaka · Full-time" },
];
export const Route = createFileRoute("/careers")({
  head: () => ({ meta: [{ title: "Careers — Bazaar" }, { name: "description", content: "Join Bazaar Bangladesh." }, { property: "og:url", content: "/careers" }], links: [{ rel: "canonical", href: "/careers" }] }),
  component: () => (
    <div>
      <div className="gradient-hero text-white"><div className="mx-auto max-w-5xl px-4 py-14"><h1 className="text-4xl md:text-5xl font-black">Careers at Bazaar</h1><p className="mt-3 text-white/85">Build the future of e-commerce with us.</p></div></div>
      <div className="mx-auto max-w-3xl px-4 py-10 space-y-3">{jobs.map(j=>(<div key={j.t} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-5 card-lift"><div><p className="font-semibold">{j.t}</p><p className="text-xs text-muted-foreground">{j.loc}</p></div><Button variant="outline" asChild><Link to="/contact">Apply</Link></Button></div>))}</div>
    </div>
  ),
});
