import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [{ title: "FAQ — Bazaar" }, { name: "description", content: "Frequently asked questions." }, { property: "og:url", content: "/faq" }], links: [{ rel: "canonical", href: "/faq" }] }),
  component: () => (
    <div>
      <div className="gradient-hero text-white"><div className="mx-auto max-w-5xl px-4 py-14"><h1 className="text-4xl md:text-5xl font-black">FAQ</h1><p className="mt-3 text-white/85">Ordering, payment and delivery — answered.</p></div></div>
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Accordion type="single" collapsible className="rounded-2xl border bg-card px-4">
          {[
            { q: "How long does delivery take?", a: "2-3 days across Bangladesh. Express in Dhaka is 24 hours." },
            { q: "What payment methods are supported?", a: "COD, bKash, Nagad, card and 0% EMI on select items." },
            { q: "How do I return an item?", a: "My orders → Return within 7 days of delivery." },
            { q: "Are prices in BDT?", a: "Yes, every price is in Bangladeshi Taka (৳)." },
            { q: "Do you deliver outside Dhaka?", a: "Yes — all 64 districts." },
          ].map(f => (<AccordionItem key={f.q} value={f.q}><AccordionTrigger>{f.q}</AccordionTrigger><AccordionContent>{f.a}</AccordionContent></AccordionItem>))}
        </Accordion>
      </div>
    </div>
  ),
});
