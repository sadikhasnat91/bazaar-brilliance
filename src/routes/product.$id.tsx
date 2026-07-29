import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, Share2, Shield, Truck, RotateCcw, Store, Star, Minus, Plus, MessageSquare, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ProductCard } from "@/components/product-card";
import { getProduct, categories, formatBDT } from "@/lib/data";
import { getProductFn } from "@/lib/products-api";
import { useShop } from "@/lib/shop-context";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$id")({
  head: ({ params }) => {
    const p = getProduct(params.id);
    return {
      meta: [
        { title: `${p?.title ?? "Product"} — Bazaar` },
        { name: "description", content: p?.description?.slice(0, 155) ?? "Shop on Bazaar" },
        { property: "og:title", content: p?.title ?? "Product" },
        { property: "og:description", content: p?.description?.slice(0, 155) ?? "" },
        { property: "og:url", content: `/product/${params.id}` },
        { property: "og:image", content: p?.image ?? "" },
        { name: "twitter:image", content: p?.image ?? "" },
      ],
      links: [{ rel: "canonical", href: `/product/${params.id}` }],
    };
  },
  loader: async ({ params }) => {
    // Try live DB first, fall back to static data for SSR pre-rendering
    const p = await getProductFn({ data: params.id }).catch(() => null) ?? getProduct(params.id);
    if (!p) throw notFound();
    return { product: p };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-3xl font-black">Product not found</h1>
      <Button asChild className="mt-4"><Link to="/">Back to home</Link></Button>
    </div>
  ),
});

function ProductPage() {
  const { product } = Route.useLoaderData() as any;
  const { addToCart, toggleWishlist, isWishlisted, markViewed, products } = useShop();
  const navigate = useNavigate();
  const [img, setImg] = useState(0);
  const [qty, setQty] = useState(1);
  const gallery = [product.image, ...( product.gallery ?? [])];
  const wished = isWishlisted(product.id);
  const category = categories.find((c) => c.slug === product.category);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 5);
  const fbt = products.filter((p) => p.id !== product.id).slice(0, 2);

  useEffect(() => { markViewed(product.id); setImg(0); setQty(1); }, [product.id, markViewed]);

  const buyNow = () => { addToCart(product.id, qty); navigate({ to: "/checkout" }); };
  const share = async () => {
    try {
      await navigator.share?.({ title: product.title, url: window.location.href });
    } catch {
      navigator.clipboard?.writeText(window.location.href);
      toast.success("Link copied");
    }
  };

  const reviews = [
    { name: "Nusrat J.", rating: 5, text: "Exactly as described. Fast delivery to Dhanmondi.", date: "2 weeks ago" },
    { name: "Arif M.", rating: 4, text: "Great value. Packaging could be better.", date: "1 month ago" },
    { name: "Tania K.", rating: 5, text: "Genuine product with warranty. Highly recommend.", date: "3 weeks ago" },
  ];
  const questions = [
    { q: "Is cash on delivery available?", a: "Yes, COD is available across Bangladesh." },
    { q: "What is the warranty?", a: `${product.specs.Warranty ?? "1 year"} manufacturer warranty via ${product.seller}.` },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink asChild><Link to="/category/$slug" params={{ slug: product.category }}>{category?.name}</Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage className="line-clamp-1 max-w-[240px]">{product.title}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_1fr_320px]">
        {/* Gallery */}
        <div>
          <div className="group relative overflow-hidden rounded-2xl border bg-muted">
            <img src={gallery[img]} alt={product.title} className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110" />
            {product.discount > 0 && <Badge className="absolute left-3 top-3 bg-accent text-accent-foreground">-{product.discount}% OFF</Badge>}
          </div>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {gallery.map((g, i) => (
              <button key={i} onClick={() => setImg(i)} className={cn("aspect-square overflow-hidden rounded-lg border-2", i === img ? "border-brand" : "border-transparent hover:border-muted-foreground/40")}>
                <img src={g} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-brand font-semibold">{product.brand}</p>
            <h1 className="mt-1 text-2xl md:text-3xl font-bold leading-tight">{product.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-1"><Star className="h-4 w-4 fill-warning text-warning" /> <span className="font-semibold">{product.rating}</span> <span className="text-muted-foreground">({product.reviews.toLocaleString()} reviews)</span></div>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{product.sold.toLocaleString()} sold</span>
            </div>
          </div>

          <div className="rounded-2xl bg-muted/50 p-5">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-brand">{formatBDT(product.price)}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-lg text-muted-foreground line-through">{formatBDT(product.originalPrice)}</span>
                  <Badge className="bg-accent text-accent-foreground">Save {formatBDT(product.originalPrice - product.price)}</Badge>
                </>
              )}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Inclusive of all taxes · 0% EMI available</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">{product.description}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Quantity</span>
            <div className="flex items-center rounded-full border">
              <Button variant="ghost" size="icon" className="rounded-l-full" onClick={() => setQty(Math.max(1, qty - 1))}><Minus className="h-4 w-4" /></Button>
              <span className="w-10 text-center text-sm font-semibold">{qty}</span>
              <Button variant="ghost" size="icon" className="rounded-r-full" onClick={() => setQty(Math.min(product.stock, qty + 1))}><Plus className="h-4 w-4" /></Button>
            </div>
            <span className={cn("text-sm", product.stock > 10 ? "text-success" : "text-warning")}>
              <Check className="inline h-4 w-4" /> {product.stock > 10 ? "In stock" : `Only ${product.stock} left`}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button size="lg" className="flex-1 min-w-[140px]" onClick={() => addToCart(product.id, qty)}>Add to cart</Button>
            <Button size="lg" variant="secondary" className="flex-1 min-w-[140px] bg-accent text-accent-foreground hover:bg-accent/90" onClick={buyNow}>Buy now</Button>
            <Button size="lg" variant="outline" onClick={() => toggleWishlist(product.id)} aria-label="Wishlist">
              <Heart className={cn("h-4 w-4", wished && "fill-destructive text-destructive")} />
            </Button>
            <Button size="lg" variant="outline" onClick={share} aria-label="Share"><Share2 className="h-4 w-4" /></Button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { icon: Truck, title: "Free delivery", desc: "Over ৳999" },
              { icon: Shield, title: "Warranty", desc: product.specs.Warranty ?? "1 year" },
              { icon: RotateCcw, title: "7-day return", desc: "Easy returns" },
              { icon: Store, title: "Sold by", desc: product.seller },
            ].map((f) => (
              <div key={f.title} className="flex items-center gap-2 rounded-xl border p-2">
                <f.icon className="h-4 w-4 text-brand shrink-0" />
                <div className="min-w-0"><p className="font-medium">{f.title}</p><p className="text-muted-foreground truncate">{f.desc}</p></div>
              </div>
            ))}
          </div>
        </div>

        {/* Seller card */}
        <aside className="space-y-4">
          <div className="rounded-2xl border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl gradient-brand text-white font-black">{product.seller[0]}</div>
              <div className="min-w-0">
                <p className="font-semibold truncate">{product.seller}</p>
                <p className="text-xs text-muted-foreground">Verified seller · 4.8 ★</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg bg-muted p-2"><p className="font-semibold">98%</p><p className="text-muted-foreground">Positive</p></div>
              <div className="rounded-lg bg-muted p-2"><p className="font-semibold">1.2k</p><p className="text-muted-foreground">Products</p></div>
              <div className="rounded-lg bg-muted p-2"><p className="font-semibold">24h</p><p className="text-muted-foreground">Response</p></div>
            </div>
            <Button asChild variant="outline" className="mt-4 w-full"><Link to="/seller">Visit store <ChevronRight className="h-4 w-4" /></Link></Button>
          </div>
          <div className="rounded-2xl border bg-card p-5">
            <p className="font-semibold mb-3">Delivery to Dhaka</p>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between"><span>Standard (2-3 days)</span><span className="font-semibold">৳60</span></li>
              <li className="flex justify-between"><span>Express (24h)</span><span className="font-semibold">৳150</span></li>
              <li className="flex justify-between"><span>Cash on delivery</span><span className="text-success font-semibold">Available</span></li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Tabs: specs, reviews, Q&A */}
      <div className="mt-12">
        <Tabs defaultValue="specs">
          <TabsList>
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviews.toLocaleString()})</TabsTrigger>
            <TabsTrigger value="qa">Q&A</TabsTrigger>
          </TabsList>
          <TabsContent value="specs" className="mt-4">
            <div className="rounded-2xl border bg-card p-6">
              <dl className="grid gap-3 sm:grid-cols-2">
                {Object.entries(product.specs).map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b pb-2">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="font-medium">{String(v)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-4">
            <div className="grid gap-6 md:grid-cols-[280px_1fr]">
              <div className="rounded-2xl border bg-card p-6 text-center h-fit">
                <p className="text-5xl font-black">{product.rating}</p>
                <div className="mt-1 flex justify-center gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={cn("h-4 w-4", i < Math.round(product.rating) ? "fill-warning text-warning" : "text-muted")} />)}</div>
                <p className="mt-1 text-sm text-muted-foreground">{product.reviews.toLocaleString()} reviews</p>
                <Button className="mt-4 w-full">Write a review</Button>
              </div>
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r.name} className="rounded-2xl border bg-card p-5">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{r.name}</p>
                      <span className="text-xs text-muted-foreground">{r.date}</span>
                    </div>
                    <div className="mt-1 flex gap-0.5">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-warning text-warning" />)}</div>
                    <p className="mt-2 text-sm">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="qa" className="mt-4">
            <div className="space-y-3">
              {questions.map((q) => (
                <div key={q.q} className="rounded-2xl border bg-card p-5">
                  <p className="font-semibold flex items-start gap-2"><MessageSquare className="h-4 w-4 mt-0.5 text-brand" /> {q.q}</p>
                  <p className="mt-2 text-sm text-muted-foreground pl-6">{q.a}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* FBT */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Frequently bought together</h2>
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border bg-card p-4">
          {[product, ...fbt].map((p, i) => (
            <div key={p.id} className="flex items-center gap-3">
              <Link to="/product/$id" params={{ id: p.slug }} className="flex items-center gap-2">
                <img src={p.image} alt="" className="h-20 w-20 rounded-lg object-cover" />
                <div className="min-w-0 max-w-[180px]">
                  <p className="line-clamp-2 text-sm">{p.title}</p>
                  <p className="text-brand font-bold">{formatBDT(p.price)}</p>
                </div>
              </Link>
              {i < 2 && <Plus className="h-5 w-5 text-muted-foreground" />}
            </div>
          ))}
          <div className="ml-auto text-right">
            <p className="text-sm text-muted-foreground">Bundle price</p>
            <p className="text-2xl font-black text-brand">{formatBDT([product, ...fbt].reduce((s, p) => s + p.price, 0))}</p>
            <Button className="mt-2" onClick={() => [product, ...fbt].forEach((p) => addToCart(p.id))}>Add all to cart</Button>
          </div>
        </div>
      </div>

      {/* Related */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Related products</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {related.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
