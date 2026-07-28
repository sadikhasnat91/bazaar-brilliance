import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronRight, Grid3x3, LayoutList, SlidersHorizontal, Star } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ProductCard } from "@/components/product-card";
import { categories, getByCategory, brands, formatBDT } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => {
    const cat = categories.find((c) => c.slug === params.slug);
    return {
      meta: [
        { title: `${cat?.name ?? "Category"} — Bazaar` },
        { name: "description", content: cat?.description ?? "Shop by category on Bazaar." },
        { property: "og:title", content: `${cat?.name ?? "Category"} — Bazaar` },
        { property: "og:url", content: `/category/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/category/${params.slug}` }],
    };
  },
  loader: ({ params }) => {
    const cat = categories.find((c) => c.slug === params.slug);
    if (!cat) throw notFound();
    return { category: cat };
  },
  component: CategoryPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-3xl font-black">Category not found</h1>
      <Button asChild className="mt-4"><Link to="/">Back to home</Link></Button>
    </div>
  ),
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const all = useMemo(() => getByCategory(category.slug), [category.slug]);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSubs, setSelectedSubs] = useState<string[]>([]);
  const [price, setPrice] = useState<[number, number]>([0, 200000]);
  const [minRating, setMinRating] = useState(0);
  const [discountOnly, setDiscountOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState("popular");
  const [page, setPage] = useState(1);
  const perPage = 12;

  const filtered = all.filter((p) => {
    if (selectedBrands.length && !selectedBrands.includes(p.brand)) return false;
    if (selectedSubs.length && !selectedSubs.includes(p.subcategory)) return false;
    if (p.price < price[0] || p.price > price[1]) return false;
    if (p.rating < minRating) return false;
    if (discountOnly && p.discount < 15) return false;
    if (inStockOnly && p.stock < 1) return false;
    return true;
  });
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "rating") return b.rating - a.rating;
    if (sort === "newest") return b.id.localeCompare(a.id);
    return b.sold - a.sold;
  });
  const paged = sorted.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));

  const catBrands = Array.from(new Set(all.map((p) => p.brand)));

  const Filters = (
    <div className="space-y-6">
      <div>
        <p className="mb-2 font-semibold">Subcategory</p>
        <div className="space-y-2">
          {category.subcategories.map((s) => (
            <label key={s} className="flex items-center gap-2 text-sm">
              <Checkbox checked={selectedSubs.includes(s)} onCheckedChange={(v) => setSelectedSubs((cur) => v ? [...cur, s] : cur.filter((x) => x !== s))} />
              {s}
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 font-semibold">Brand</p>
        <div className="space-y-2 max-h-40 overflow-auto pr-1">
          {catBrands.map((b) => (
            <label key={b} className="flex items-center gap-2 text-sm">
              <Checkbox checked={selectedBrands.includes(b)} onCheckedChange={(v) => setSelectedBrands((cur) => v ? [...cur, b] : cur.filter((x) => x !== b))} />
              {b}
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 font-semibold">Price (BDT)</p>
        <Slider min={0} max={200000} step={500} value={price} onValueChange={(v) => setPrice(v as [number, number])} />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>{formatBDT(price[0])}</span><span>{formatBDT(price[1])}</span>
        </div>
      </div>
      <div>
        <p className="mb-2 font-semibold">Minimum rating</p>
        <div className="flex gap-2">
          {[0, 3, 4, 4.5].map((r) => (
            <button key={r} onClick={() => setMinRating(r)} className={cn("flex items-center gap-1 rounded-full border px-3 py-1 text-xs", minRating === r ? "bg-primary text-primary-foreground" : "hover:bg-muted")}>
              <Star className="h-3 w-3 fill-warning text-warning" /> {r === 0 ? "Any" : `${r}+`}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm"><Checkbox checked={discountOnly} onCheckedChange={(v) => setDiscountOnly(!!v)} /> Discount 15%+</label>
        <label className="flex items-center gap-2 text-sm"><Checkbox checked={inStockOnly} onCheckedChange={(v) => setInStockOnly(!!v)} /> In stock only</label>
      </div>
      <Button variant="outline" className="w-full" onClick={() => { setSelectedBrands([]); setSelectedSubs([]); setPrice([0, 200000]); setMinRating(0); setDiscountOnly(false); setInStockOnly(false); }}>
        Clear filters
      </Button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{category.name}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="relative mt-4 overflow-hidden rounded-3xl">
        <img src={category.banner} alt={category.name} className="h-40 w-full object-cover md:h-56" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 to-primary/20" />
        <div className="absolute inset-0 flex items-center px-6 sm:px-10 text-white">
          <div>
            <h1 className="text-3xl md:text-4xl font-black">{category.name}</h1>
            <p className="mt-2 max-w-lg text-white/85">{category.description}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block sticky top-32 self-start rounded-2xl border bg-card p-5">
          {Filters}
        </aside>

        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2 justify-between">
            <p className="text-sm text-muted-foreground">{sorted.length} products</p>
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden gap-1"><SlidersHorizontal className="h-4 w-4" /> Filters</Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SheetTitle className="mb-4">Filters</SheetTitle>
                  {Filters}
                </SheetContent>
              </Sheet>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most popular</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-asc">Price: low to high</SelectItem>
                  <SelectItem value="price-desc">Price: high to low</SelectItem>
                  <SelectItem value="rating">Top rated</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex rounded-lg border overflow-hidden">
                <button onClick={() => setView("grid")} className={cn("p-2", view === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted")} aria-label="Grid"><Grid3x3 className="h-4 w-4" /></button>
                <button onClick={() => setView("list")} className={cn("p-2", view === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted")} aria-label="List"><LayoutList className="h-4 w-4" /></button>
              </div>
            </div>
          </div>

          {paged.length === 0 ? (
            <div className="rounded-2xl border bg-card p-16 text-center">
              <p className="text-5xl">🛒</p>
              <p className="mt-4 font-semibold">No products match your filters</p>
              <Button className="mt-4" onClick={() => { setSelectedBrands([]); setSelectedSubs([]); setPrice([0, 200000]); setMinRating(0); }}>Reset filters</Button>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {paged.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="space-y-3">
              {paged.map((p) => (
                <Link key={p.id} to="/product/$id" params={{ id: p.slug }} className="flex gap-4 rounded-2xl border bg-card p-3 card-lift">
                  <img src={p.image} alt={p.title} className="h-32 w-32 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold line-clamp-2">{p.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3.5 w-3.5 fill-warning text-warning" /> {p.rating} ({p.reviews.toLocaleString()}) · {p.sold.toLocaleString()} sold
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-lg font-bold text-brand">{formatBDT(p.price)}</span>
                      <span className="text-xs text-muted-foreground line-through">{formatBDT(p.originalPrice)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-1">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button key={i} variant={page === i + 1 ? "default" : "outline"} size="sm" onClick={() => setPage(i + 1)}>{i + 1}</Button>
              ))}
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
