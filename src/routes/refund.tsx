import { createFileRoute } from "@tanstack/react-router";
const sections = [
  { t: "Eligibility", b: "Item must be unused, in original packaging with tags." },
  { t: "How to return", b: "My orders → Return. Free pickup in Dhaka & Chattogram." },
  { t: "Refund timeline", b: "5-7 business days to your original payment method." },
];
export const Route = createFileRoute("/refund")({
  head: () => ({ meta: [{ title: "Refund policy — Bazaar" }, { name: "description", content: "7-day returns on eligible items." }, { property: "og:url", content: "/refund" }], links: [{ rel: "canonical", href: "/refund" }] }),
  component: () => (
    <div>
      <div className="gradient-hero text-white"><div className="mx-auto max-w-5xl px-4 py-14"><h1 className="text-4xl md:text-5xl font-black">Refund policy</h1><p className="mt-3 text-white/85">Easy 7-day returns.</p></div></div>
      <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">{sections.map(s=>(<div key={s.t}><h2 className="text-xl font-bold">{s.t}</h2><p className="mt-2 text-muted-foreground">{s.b}</p></div>))}</div>
    </div>
  ),
});
