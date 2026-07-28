import { createFileRoute, Link } from "@tanstack/react-router";
export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — Bazaar" }, { name: "description", content: "About Bazaar Bangladesh — mission and story." }, { property: "og:title", content: "About Bazaar" }, { property: "og:url", content: "/about" }], links: [{ rel: "canonical", href: "/about" }] }),
  component: () => (
    <div>
      <div className="gradient-hero text-white"><div className="mx-auto max-w-5xl px-4 py-14"><h1 className="text-4xl md:text-5xl font-black">About Bazaar</h1><p className="mt-3 max-w-2xl text-white/85">Bangladesh's premium marketplace connecting millions of shoppers with trusted sellers.</p></div></div>
      <div className="mx-auto max-w-5xl px-4 py-10 space-y-6">
        <div className="grid gap-6 md:grid-cols-3">{[{n:"12M+",l:"Customers"},{n:"100k+",l:"Products"},{n:"5,400+",l:"Sellers"}].map(s=>(<div key={s.l} className="rounded-2xl border bg-card p-6 text-center card-lift"><p className="text-3xl font-black text-brand">{s.n}</p><p className="mt-1 text-sm text-muted-foreground">{s.l}</p></div>))}</div>
        <h2 className="text-2xl font-bold">Our story</h2><p className="text-muted-foreground">Founded in Dhaka in 2020, we deliver to all 64 districts with same-day options in major cities.</p>
        <Link to="/contact" className="inline-flex rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground">Contact us</Link>
      </div>
    </div>
  ),
});
