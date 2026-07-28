import { createFileRoute } from "@tanstack/react-router";
const sections = [
  { t: "Accounts", b: "You are responsible for maintaining the confidentiality of your login." },
  { t: "Orders", b: "Subject to availability. We reserve the right to cancel." },
  { t: "Prohibited use", b: "No misuse, circumventing security, or fraud." },
];
export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms — Bazaar" }, { name: "description", content: "Terms of use for Bazaar." }, { property: "og:url", content: "/terms" }], links: [{ rel: "canonical", href: "/terms" }] }),
  component: () => (
    <div>
      <div className="gradient-hero text-white"><div className="mx-auto max-w-5xl px-4 py-14"><h1 className="text-4xl md:text-5xl font-black">Terms of use</h1><p className="mt-3 text-white/85">Please read carefully.</p></div></div>
      <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">{sections.map(s=>(<div key={s.t}><h2 className="text-xl font-bold">{s.t}</h2><p className="mt-2 text-muted-foreground">{s.b}</p></div>))}</div>
    </div>
  ),
});
