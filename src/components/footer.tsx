import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter, Youtube, Smartphone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const sections = [
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Careers", to: "/careers" },
      { label: "Contact", to: "/contact" },
      { label: "Press", to: "/about" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", to: "/help" },
      { label: "Track Order", to: "/track" },
      { label: "FAQ", to: "/faq" },
      { label: "Returns", to: "/refund" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Use", to: "/terms" },
      { label: "Refund Policy", to: "/refund" },
      { label: "Cookies", to: "/privacy" },
    ],
  },
  {
    title: "Sell",
    links: [
      { label: "Sell on Bazaar", to: "/seller" },
      { label: "Seller Center", to: "/seller" },
      { label: "Fulfilment", to: "/help" },
      { label: "Advertise", to: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-xl gradient-brand font-black">B</div>
              <span className="text-2xl font-black">Bazaar<span className="text-accent">.</span></span>
            </Link>
            <p className="text-sm text-primary-foreground/70 max-w-sm">
              Bangladesh's premium marketplace — 100k+ products from trusted local and global sellers, delivered fast across the country.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 max-w-sm">
              <Input placeholder="Enter your email" className="bg-white/10 border-white/20 text-white placeholder:text-white/60" />
              <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">Subscribe</Button>
            </form>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/20"><Facebook className="h-4 w-4" /></a>
              <a href="#" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/20"><Instagram className="h-4 w-4" /></a>
              <a href="#" aria-label="Twitter" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/20"><Twitter className="h-4 w-4" /></a>
              <a href="#" aria-label="YouTube" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/20"><Youtube className="h-4 w-4" /></a>
            </div>
          </div>
          {sections.map((s) => (
            <div key={s.title}>
              <p className="font-semibold mb-3">{s.title}</p>
              <ul className="space-y-2 text-sm text-primary-foreground/70">
                {s.links.map((l) => (
                  <li key={l.label}><Link to={l.to} className="hover:text-white">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 text-sm text-primary-foreground/70">
            <Smartphone className="h-4 w-4" />
            <span>Get the app</span>
            <a href="#" className="rounded-lg bg-white/10 px-3 py-1.5 text-xs hover:bg-white/20">App Store</a>
            <a href="#" className="rounded-lg bg-white/10 px-3 py-1.5 text-xs hover:bg-white/20">Google Play</a>
          </div>
          <p className="text-xs text-primary-foreground/60">© {new Date().getFullYear()} Bazaar Bangladesh Ltd. All rights reserved. Prices in BDT.</p>
        </div>
      </div>
    </footer>
  );
}
