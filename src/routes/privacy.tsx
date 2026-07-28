import { createFileRoute } from "@tanstack/react-router";
const sections = [
  { t: "Data we collect", b: "Account, order and delivery information used to fulfil your orders." },
  { t: "How we use it", b: "To ship orders, personalise recommendations and communicate with you." },
  { t: "Your rights", b: "Request access, export or deletion at privacy@bazaar.com.bd." },
];
export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy policy — Bazaar" }, { name: "description", content: "How Bazaar protects your data." }, { property: "og:url", content: "/privacy" }], links: [{ rel: "canonical", href: "/privacy" }] }),
  component: () => (
    <div>
      <div className="gradient-hero text-white"><div className="mx-auto max-w-5xl px-4 py-14"><h1 className="text-4xl md:text-5xl font-black">Privacy policy</h1><p className="mt-3 text-white/85">Last updated: Jul 2026</p></div></div>
      <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">{sections.map(s=>(<div key={s.t}><h2 className="text-xl font-bold">{s.t}</h2><p className="mt-2 text-muted-foreground">{s.b}</p></div>))}</div>
    </div>
  ),
});
