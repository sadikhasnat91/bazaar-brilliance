import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Cpu, Shirt, Sofa, Sparkles, ShoppingBasket, Dumbbell, Baby, Car, Palette, Truck, Shield, Headphones, RefreshCw, Clock, Flame, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { categories, heroSlides, brandLogos, promoBanners, formatBDT } from "@/lib/data";
import { useShop } from "@/lib/shop-context";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getCarouselFn, getAdsFn, getBrandsFn } from "@/lib/products-api";

const iconMap = { Cpu, Shirt, Sofa, Sparkles, ShoppingBasket, Dumbbell, Baby, Car, Palette } as const;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bazaar — Bangladesh's Premium Online Marketplace" },
      { name: "description", content: "Shop electronics, fashion, home & living, grocery and more in BDT. Fast delivery, secure payments, cash on delivery." },
      { property: "og:title", content: "Bazaar — Bangladesh's Premium Online Marketplace" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function HeroCarousel({ slides }: { slides: any[] }) {
  const [i, setI] = useState(0);
  useEffect(() => { setI(0); }, [slides.length]);
  useEffect(() => {
    if (slides.length === 0) return;
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, [slides.length]);
  if (slides.length === 0) return null;
  return (
    <div className="relative overflow-hidden rounded-3xl shadow-card">
      <div className="relative w-full h-[250px] sm:h-[320px] md:h-[380px] lg:h-[420px]">
        {slides.map((slide: any, idx: number) => (
          <div key={idx} className={cn("absolute inset-0 transition-opacity duration-700", idx === i ? "opacity-100" : "opacity-0")}>
            <img src={slide.image_url || slide.image} alt={slide.caption || slide.title || "Slide"} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/50 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="px-6 sm:px-12 max-w-xl text-white">
                {(slide.tag) && <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground animate-float-up">{slide.tag}</span>}
                <h2 className="mt-3 text-2xl sm:text-4xl lg:text-5xl font-black leading-tight animate-float-up">{slide.caption || slide.title}</h2>
                {(slide.sub_caption || slide.subtitle) && <p className="mt-3 text-white/85 text-base sm:text-lg animate-float-up">{slide.sub_caption || slide.subtitle}</p>}
                {(slide.target_url || slide.href) && (
                  <Button asChild size="lg" className="mt-6 rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link to={slide.target_url || slide.href}>{slide.cta || "Shop Now"} <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => setI((x) => (x - 1 + slides.length) % slides.length)} className="absolute left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-white/80 backdrop-blur hover:bg-white" aria-label="Previous">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button onClick={() => setI((x) => (x + 1) % slides.length)} className="absolute right-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-white/80 backdrop-blur hover:bg-white" aria-label="Next">
        <ChevronRight className="h-5 w-5" />
      </button>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
        {slides.map((_: any, idx: number) => (
          <button key={idx} onClick={() => setI(idx)} className={cn("h-1.5 rounded-full transition-all", idx === i ? "w-8 bg-white" : "w-1.5 bg-white/60")} aria-label={`Slide ${idx + 1}`} />
        ))}
      </div>
    </div>
  );
}

function CountdownBadge() {
  const [t, setT] = useState({ h: 4, m: 32, s: 18 });
  useEffect(() => {
    const iv = setInterval(() => {
      setT((cur) => {
        let { h, m, s } = cur;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 5; m = 0; s = 0; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(iv);
  }, []);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex items-center gap-1 text-sm">
      <Clock className="h-4 w-4" />
      <span>Ends in</span>
      {(["h", "m", "s"] as const).map((k) => (
        <span key={k} className="rounded-md bg-primary px-2 py-0.5 font-mono text-primary-foreground">{pad(t[k])}</span>
      ))}
    </div>
  );
}

function Section({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Home() {
  const { recent, products } = useShop();
  const recentProducts = recent.map((id) => products.find((p) => p.id === id)).filter(Boolean).slice(0, 6);
  // Derive product sections dynamically from live DB-backed products
  const flashSale = products.filter((p) => p.badge === "flash").slice(0, 6);
  const newArrivals = products.filter((p) => p.badge === "new").slice(0, 6);
  const featured = products.filter((p) => p.badge === "trending" || p.badge === "bestseller").slice(0, 12);

  // Dynamic carousel & ads from admin panel
  const { data: dbSlides = [] } = useQuery({ queryKey: ["carousel"], queryFn: () => getCarouselFn() });
  const { data: dbAds = [] } = useQuery({ queryKey: ["ads"], queryFn: () => getAdsFn() });
  const { data: dbBrands = [] } = useQuery({ queryKey: ["brands"], queryFn: () => getBrandsFn() });

  const activeSlides = dbSlides.filter((s: any) => s.active);
  const carouselSlides = activeSlides.length > 0 ? activeSlides : heroSlides;
  const activeAds = dbAds.filter((a: any) => a.active);
  const activeBrands = dbBrands.filter((brand: any) => brand.active);
  const brandCards = (activeBrands.length > 0 ? activeBrands : brandLogos).map((brand: any, index: number) => ({
    id: brand.id ?? `${brand.name}-${index}`,
    name: brand.name,
    image_url: brand.image_url ?? brand.image,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      <HeroCarousel slides={carouselSlides} />

      {/* Trust bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Truck, title: "Free delivery", desc: "Orders over ৳999" },
          { icon: Shield, title: "Secure payment", desc: "bKash, card, COD" },
          { icon: RefreshCw, title: "7-day returns", desc: "Hassle-free" },
          { icon: Headphones, title: "24/7 support", desc: "Bangla & English" },
        ].map((f) => (
          <div key={f.title} className="flex items-center gap-3 rounded-2xl border bg-card p-4 card-lift">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand"><f.icon className="h-5 w-5" /></div>
            <div className="min-w-0">
              <p className="font-semibold text-sm">{f.title}</p>
              <p className="text-xs text-muted-foreground truncate">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Categories */}
      <Section title="Shop by category" action={<Button variant="ghost" asChild><Link to="/category/$slug" params={{ slug: "electronics" }}>All categories <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>}>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((c) => {
            const Icon = iconMap[c.icon as keyof typeof iconMap];
            return (
              <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} className="group flex flex-col items-center gap-2 rounded-2xl border bg-card p-4 text-center card-lift">
                <div className="grid h-14 w-14 place-items-center rounded-2xl gradient-brand text-white group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-medium leading-tight">{c.name}</span>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* Flash sale */}
      <Section
        title="⚡ Flash Sale"
        subtitle="Grab it before it's gone"
        action={
          <div className="flex items-center gap-3">
            <CountdownBadge />
            <Button variant="ghost" asChild><Link to="/search" search={{ q: "" }}>See all <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
          </div>
        }
      >
        <div className="rounded-3xl gradient-accent p-1">
          <div className="rounded-[calc(theme(borderRadius.3xl)-4px)] bg-background p-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {flashSale.slice(0, 6).map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </div>
      </Section>

      {/* Promo cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {promoBanners.map((p) => (
          <Link key={p.title} to={p.href} className="group relative overflow-hidden rounded-2xl">
            <img src={p.image} alt="" className="aspect-[2/1] w-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center px-6 text-white">
              <h3 className="text-xl font-bold">{p.title}</h3>
              <p className="mt-1 text-sm text-white/85">{p.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Trending */}
      <Section title="Trending now" subtitle="Loved by shoppers this week" action={<Button variant="ghost" asChild><Link to="/category/$slug" params={{ slug: "electronics" }}>View all <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>}>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {featured.slice(0, 12).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </Section>

      {/* Ad banners — dynamic from admin, fallback to static */}
      {activeAds.length > 0 ? (
        <div className={cn("grid gap-4", activeAds.length > 1 ? "md:grid-cols-2" : "")}>
          {activeAds.map((ad: any) => (
            <a key={ad.id} href={ad.link_url || "#"} target="_blank" rel="noreferrer" className="group relative overflow-hidden rounded-3xl block">
              <img src={ad.image_url} alt={ad.title} className="w-full aspect-[3/1] object-cover transition-transform duration-500 group-hover:scale-105" onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/ad-${ad.id}/1200/400`; }} />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent" />
              <div className="absolute inset-0 flex items-center px-8">
                <div className="text-white">
                  <p className="text-2xl font-black">{ad.title}</p>
                  <p className="mt-1 text-white/80 text-sm">Tap to learn more →</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-3xl gradient-hero p-8 sm:p-12 text-white">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold"><Flame className="h-3 w-3" /> Limited offer</span>
              <h3 className="mt-3 text-3xl sm:text-4xl font-black">Get up to ৳2,000 off</h3>
              <p className="mt-1 text-white/80">On your first order over ৳5,000. Use code <span className="rounded bg-white/20 px-2 py-0.5 font-mono">BAZAAR2K</span></p>
            </div>
            <Button size="lg" asChild className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90"><Link to="/category/$slug" params={{ slug: "electronics" }}>Start shopping</Link></Button>
          </div>
        </div>
      )}

      {/* New arrivals */}
      <Section title="New arrivals" subtitle="Fresh drops just in">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {newArrivals.slice(0, 6).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </Section>

      {/* Top selling + collections split */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-black">Top selling</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[...products].sort((a, b) => b.sold - a.sold).slice(0, 6).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-black">Collections</h2>
          {categories.slice(0, 4).map((c) => (
            <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} className="group relative block overflow-hidden rounded-2xl">
              <img src={c.banner} alt={c.name} className="aspect-[3/1] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-between px-4 text-white">
                <div>
                  <p className="text-lg font-bold">{c.name}</p>
                  <p className="text-xs text-white/80">Shop now</p>
                </div>
                <ArrowRight className="h-5 w-5" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Best brands */}
      <Section title="Best brands">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />
          <div className="flex w-max gap-3 animate-marquee-reverse hover:[animation-play-state:paused]">
            {[...brandCards, ...brandCards].map((b, i) => (
              <div key={`${b.id}-${i}`} className="grid w-28 aspect-square place-items-center rounded-xl border bg-card p-3 text-center card-lift shrink-0">
                {b.image_url ? (
                  <img
                    src={b.image_url}
                    alt={b.name}
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                      if (fallback) fallback.classList.remove("hidden");
                    }}
                  />
                ) : null}
                <span className={cn("text-xs font-semibold", b.image_url ? "hidden" : "")}>{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Popular shops */}
      <Section title="Popular sellers" subtitle="Trusted stores loved across Bangladesh">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {["Aurora Official BD", "TechHub Dhaka", "HomeCraft Dhaka", "Rang Bangla Store"].map((s, i) => (
            <div key={s} className="rounded-2xl border bg-card p-5 card-lift">
              <div className={cn("grid h-14 w-14 place-items-center rounded-2xl text-white font-black text-lg", i % 2 ? "gradient-accent" : "gradient-brand")}>{s[0]}</div>
              <p className="mt-3 font-semibold">{s}</p>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-warning text-warning" /> 4.8 · {Math.floor(Math.random() * 900 + 300)} products
              </div>
              <Button asChild size="sm" variant="outline" className="mt-3 w-full"><Link to="/seller">Visit store</Link></Button>
            </div>
          ))}
        </div>
      </Section>

      {/* Recently viewed */}
      {recentProducts.length > 0 && (
        <Section title="Recently viewed">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {recentProducts.map((p) => p && <ProductCard key={p.id} product={p} />)}
          </div>
        </Section>
      )}

      {/* Reviews */}
      <Section title="What our customers say">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { name: "Sadia R.", city: "Dhaka", text: "Delivery was next-day and packaging was fantastic. Bazaar is now my go-to for electronics!", rating: 5 },
            { name: "Mahin A.", city: "Chattogram", text: "Bought a saree for my mom — quality is even better than expected. Will order again.", rating: 5 },
            { name: "Rifat H.", city: "Sylhet", text: "Great prices during flash sale. Support team resolved my query in Bangla within minutes.", rating: 4 },
          ].map((r) => (
            <div key={r.name} className="rounded-2xl border bg-card p-6 card-lift">
              <div className="flex gap-1 text-warning">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
              <p className="mt-3 text-sm text-muted-foreground">"{r.text}"</p>
              <p className="mt-4 text-sm font-semibold">{r.name}<span className="text-muted-foreground font-normal"> · {r.city}</span></p>
            </div>
          ))}
        </div>
      </Section>

      {/* App download */}
      <div className="grid gap-8 rounded-3xl bg-primary p-8 sm:p-12 text-primary-foreground md:grid-cols-2 md:items-center">
        <div>
          <h3 className="text-3xl font-black">Shop faster on the Bazaar app</h3>
          <p className="mt-2 text-primary-foreground/75">Exclusive app-only deals, faster checkout and real-time order tracking.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#" className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-3 hover:bg-white/20">📱 App Store</a>
            <a href="#" className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-3 hover:bg-white/20">🤖 Google Play</a>
          </div>
        </div>
        <div className="glass rounded-3xl p-8 text-center text-foreground">
          <p className="text-6xl">📱</p>
          <p className="mt-2 font-semibold">4.8 ★ · 500k+ downloads</p>
        </div>
      </div>

      {/* Newsletter */}
      <div className="rounded-3xl border bg-card p-8 text-center">
        <h3 className="text-2xl font-black">Never miss a deal</h3>
        <p className="mt-1 text-sm text-muted-foreground">Get flash-sale alerts and exclusive coupons.</p>
        <form onSubmit={(e) => e.preventDefault()} className="mx-auto mt-4 flex max-w-md gap-2">
          <input type="email" required placeholder="you@example.com" className="flex-1 rounded-full border bg-background px-4 py-2 text-sm outline-none focus:border-brand" />
          <Button type="submit" className="rounded-full">Subscribe</Button>
        </form>
      </div>
    </div>
  );
}
