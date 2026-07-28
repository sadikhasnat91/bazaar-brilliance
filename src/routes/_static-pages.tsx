import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Phone, MapPin, MessageCircle, Shield, Truck, RotateCcw, Package, CreditCard, Users } from "lucide-react";

type PageProps = { title: string; description: string; children: React.ReactNode; hero?: React.ReactNode };
function Page({ title, description, children, hero }: PageProps) {
  return (
    <div>
      <div className="gradient-hero text-white">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <h1 className="text-4xl md:text-5xl font-black">{title}</h1>
          <p className="mt-3 max-w-2xl text-white/85">{description}</p>
          {hero}
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-4 py-10 space-y-6 prose-neutral">{children}</div>
    </div>
  );
}

// ─── About
export const AboutRoute = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — Bazaar" }, { name: "description", content: "About Bazaar Bangladesh — mission, story, and team." }, { property: "og:title", content: "About Bazaar" }, { property: "og:url", content: "/about" }], links: [{ rel: "canonical", href: "/about" }] }),
  component: () => (
    <Page title="About Bazaar" description="Bangladesh's premium online marketplace connecting millions of shoppers with trusted local and global sellers.">
      <div className="grid gap-6 md:grid-cols-3">
        {[{ n: "12M+", l: "Happy customers" }, { n: "100k+", l: "Products" }, { n: "5,400+", l: "Sellers" }].map((s) => (
          <div key={s.l} className="rounded-2xl border bg-card p-6 text-center card-lift"><p className="text-3xl font-black text-brand">{s.n}</p><p className="mt-1 text-sm text-muted-foreground">{s.l}</p></div>
        ))}
      </div>
      <h2 className="text-2xl font-bold">Our story</h2>
      <p className="text-muted-foreground">Founded in Dhaka in 2020, Bazaar started with a simple mission: make online shopping in Bangladesh fast, trustworthy and delightful. Today we deliver to all 64 districts.</p>
      <h2 className="text-2xl font-bold">Our values</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        <li className="rounded-xl border p-4">🇧🇩 Local first — we champion Bangladeshi sellers</li>
        <li className="rounded-xl border p-4">⚡ Speed — we ship the same day when we can</li>
        <li className="rounded-xl border p-4">🛡 Trust — every seller is verified</li>
        <li className="rounded-xl border p-4">💚 Care — real Bangla-speaking support 24/7</li>
      </ul>
    </Page>
  ),
});

// ─── Contact
export const ContactRoute = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — Bazaar" }, { name: "description", content: "Get in touch with Bazaar Bangladesh." }, { property: "og:url", content: "/contact" }], links: [{ rel: "canonical", href: "/contact" }] }),
  component: () => (
    <Page title="Contact us" description="Reach our team any time — we're here to help.">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {[{ icon: Phone, t: "Call", d: "+880 9666 999 000" }, { icon: Mail, t: "Email", d: "support@bazaar.com.bd" }, { icon: MapPin, t: "HQ", d: "Level 12, Gulshan Trade Center, Dhaka 1212" }].map((c) => (
            <div key={c.t} className="flex items-start gap-3 rounded-2xl border bg-card p-4">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand"><c.icon className="h-5 w-5" /></div>
              <div><p className="font-semibold">{c.t}</p><p className="text-sm text-muted-foreground">{c.d}</p></div>
            </div>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); toast.success("Message sent"); }} className="rounded-2xl border bg-card p-6 space-y-3">
          <div><Label>Name</Label><Input required /></div>
          <div><Label>Email</Label><Input required type="email" /></div>
          <div><Label>Message</Label><Textarea required rows={5} /></div>
          <Button className="w-full">Send message</Button>
        </form>
      </div>
    </Page>
  ),
});

// ─── Help
export const HelpRoute = createFileRoute("/help")({
  head: () => ({ meta: [{ title: "Help center — Bazaar" }, { name: "description", content: "Help articles, order support and returns." }, { property: "og:url", content: "/help" }], links: [{ rel: "canonical", href: "/help" }] }),
  component: () => (
    <Page title="Help center" description="Find answers to common questions or reach our team.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[{ icon: Package, t: "Orders", h: "/track" }, { icon: Truck, t: "Delivery", h: "/faq" }, { icon: RotateCcw, t: "Returns", h: "/refund" }, { icon: CreditCard, t: "Payments", h: "/faq" }].map((c) => (
          <Link key={c.t} to={c.h} className="rounded-2xl border bg-card p-6 card-lift">
            <c.icon className="h-6 w-6 text-brand" /><p className="mt-3 font-semibold">{c.t}</p><p className="text-xs text-muted-foreground">Learn more</p>
          </Link>
        ))}
      </div>
      <div className="rounded-2xl border bg-card p-6 text-center">
        <MessageCircle className="mx-auto h-8 w-8 text-brand" />
        <p className="mt-3 font-semibold">Still need help?</p>
        <Button asChild className="mt-3"><Link to="/contact">Contact support</Link></Button>
      </div>
    </Page>
  ),
});

// ─── FAQ
export const FaqRoute = createFileRoute("/faq")({
  head: () => ({ meta: [{ title: "FAQ — Bazaar" }, { name: "description", content: "Frequently asked questions about shopping on Bazaar." }, { property: "og:url", content: "/faq" }], links: [{ rel: "canonical", href: "/faq" }] }),
  component: () => (
    <Page title="Frequently asked questions" description="Everything you need to know about ordering, payment and delivery.">
      <Accordion type="single" collapsible className="rounded-2xl border bg-card px-4">
        {[
          { q: "How long does delivery take?", a: "Standard delivery is 2-3 business days across Bangladesh. Express delivery in Dhaka is 24 hours." },
          { q: "What payment methods are supported?", a: "Cash on delivery, bKash, Nagad, credit/debit cards and 0% EMI on select products." },
          { q: "How do I return an item?", a: "Open the order in your account, tap Return and follow the steps. You have 7 days from delivery." },
          { q: "Are prices in BDT?", a: "Yes, every price on Bazaar is in Bangladeshi Taka (৳)." },
          { q: "Do you deliver outside Dhaka?", a: "Yes — we deliver to all 64 districts in Bangladesh." },
        ].map((f) => (
          <AccordionItem key={f.q} value={f.q}><AccordionTrigger>{f.q}</AccordionTrigger><AccordionContent>{f.a}</AccordionContent></AccordionItem>
        ))}
      </Accordion>
    </Page>
  ),
});

const LegalBody = ({ intro, sections }: { intro: string; sections: { t: string; b: string }[] }) => (
  <>
    <p className="text-muted-foreground">{intro}</p>
    {sections.map((s) => (<div key={s.t}><h2 className="text-xl font-bold">{s.t}</h2><p className="mt-2 text-muted-foreground">{s.b}</p></div>))}
  </>
);

export const PrivacyRoute = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy policy — Bazaar" }, { name: "description", content: "How Bazaar collects, uses and protects your data." }, { property: "og:url", content: "/privacy" }], links: [{ rel: "canonical", href: "/privacy" }] }),
  component: () => (<Page title="Privacy policy" description="Last updated: Jul 2026"><LegalBody intro="Bazaar respects your privacy. This policy explains what data we collect and how we use it." sections={[
    { t: "Data we collect", b: "Account details, order history, delivery addresses and device information used to improve the service." },
    { t: "How we use it", b: "To fulfil orders, personalise recommendations, prevent fraud and communicate about your account." },
    { t: "Your rights", b: "You may request access, export or deletion of your personal data anytime at privacy@bazaar.com.bd." },
  ]} /></Page>),
});

export const TermsRoute = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms of use — Bazaar" }, { name: "description", content: "Terms and conditions for using Bazaar." }, { property: "og:url", content: "/terms" }], links: [{ rel: "canonical", href: "/terms" }] }),
  component: () => (<Page title="Terms of use" description="Please read these terms carefully."><LegalBody intro="By using Bazaar you agree to the following terms." sections={[
    { t: "Accounts", b: "You are responsible for maintaining the confidentiality of your login." },
    { t: "Orders", b: "Orders are subject to availability and acceptance. We reserve the right to cancel." },
    { t: "Prohibited use", b: "You may not misuse the service, attempt to circumvent security, or resell products for fraudulent purposes." },
  ]} /></Page>),
});

export const RefundRoute = createFileRoute("/refund")({
  head: () => ({ meta: [{ title: "Refund policy — Bazaar" }, { name: "description", content: "Return and refund policy for Bazaar orders." }, { property: "og:url", content: "/refund" }], links: [{ rel: "canonical", href: "/refund" }] }),
  component: () => (<Page title="Refund policy" description="Easy 7-day returns on eligible items."><LegalBody intro="If you're not satisfied, most items can be returned within 7 days of delivery." sections={[
    { t: "Eligibility", b: "Item must be unused, in original packaging with all tags." },
    { t: "How to return", b: "Go to My orders → Return. Our courier will pick up the item free of charge in Dhaka & Chattogram." },
    { t: "Refund timeline", b: "Refunds are processed within 5-7 business days to the original payment method." },
  ]} /></Page>),
});

export const CareersRoute = createFileRoute("/careers")({
  head: () => ({ meta: [{ title: "Careers — Bazaar" }, { name: "description", content: "Join Bazaar Bangladesh — open roles across engineering, operations and design." }, { property: "og:url", content: "/careers" }], links: [{ rel: "canonical", href: "/careers" }] }),
  component: () => (
    <Page title="Careers at Bazaar" description="Build the future of e-commerce in Bangladesh with us.">
      <div className="grid gap-3">
        {[{ t: "Senior Frontend Engineer", loc: "Dhaka · Full-time" }, { t: "Product Designer", loc: "Remote · Full-time" }, { t: "Warehouse Operations Lead", loc: "Chattogram · Full-time" }, { t: "Customer Support (Bangla)", loc: "Dhaka · Full-time" }].map((j) => (
          <div key={j.t} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-5 card-lift">
            <div><p className="font-semibold">{j.t}</p><p className="text-xs text-muted-foreground">{j.loc}</p></div>
            <Button variant="outline" asChild><Link to="/contact">Apply</Link></Button>
          </div>
        ))}
      </div>
    </Page>
  ),
});

export const SellerRoute = createFileRoute("/seller")({
  head: () => ({ meta: [{ title: "Sell on Bazaar" }, { name: "description", content: "Reach millions of customers — join Bazaar as a seller." }, { property: "og:url", content: "/seller" }], links: [{ rel: "canonical", href: "/seller" }] }),
  component: () => (
    <Page title="Sell on Bazaar" description="Reach 12M+ shoppers across Bangladesh. Free onboarding, low commissions, powerful seller tools.">
      <div className="grid gap-4 md:grid-cols-3">
        {[{ i: Users, t: "12M+ buyers" }, { i: Truck, t: "Fulfilment support" }, { i: Shield, t: "Verified payments" }].map((f) => (
          <div key={f.t} className="rounded-2xl border bg-card p-6 text-center card-lift"><f.i className="mx-auto h-8 w-8 text-brand" /><p className="mt-3 font-semibold">{f.t}</p></div>
        ))}
      </div>
      <div className="rounded-2xl gradient-hero p-8 text-white text-center">
        <h3 className="text-2xl font-black">Start selling today</h3>
        <Button asChild className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90"><Link to="/register">Create seller account</Link></Button>
      </div>
    </Page>
  ),
});

export const NotificationsRoute = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Bazaar" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-black mb-6">Notifications</h1>
      <div className="rounded-2xl border bg-card divide-y">
        {[
          { t: "Your order BZ483920 was delivered", d: "Enjoy your headphones!", time: "2h ago" },
          { t: "Flash sale starts in 1h", d: "Up to 60% off electronics", time: "5h ago" },
          { t: "Coupon expiring soon", d: "WELCOME10 expires in 2 days", time: "1d ago" },
          { t: "Price drop on your wishlist", d: "SonicWave X7 is now ৳8,990", time: "3d ago" },
        ].map((n, i) => (
          <div key={i} className="flex items-start gap-3 p-4">
            <div className="h-2 w-2 mt-2 rounded-full bg-brand" />
            <div className="flex-1"><p className="font-medium">{n.t}</p><p className="text-sm text-muted-foreground">{n.d}</p></div>
            <span className="text-xs text-muted-foreground shrink-0">{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  ),
});
