import { createFileRoute, useSearch } from "@tanstack/react-router";
import { Search as SearchIcon } from "lucide-react";
import { z } from "zod";
import { ProductCard } from "@/components/product-card";
import { useShop } from "@/lib/shop-context";

const searchSchema = z.object({ q: z.string().optional().default("") });

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Search — Bazaar" }, { name: "description", content: "Search across Bazaar's catalogue" }] }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = useSearch({ from: "/search" });
  const { products } = useShop();
  const query = (q || "").toLowerCase();
  const results = query
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.subcategory.toLowerCase().includes(query) ||
          p.seller.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query))
      )
    : products;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex items-center gap-3">
        <SearchIcon className="h-6 w-6 text-brand" />
        <h1 className="text-2xl font-black">
          {query ? <>Results for "<span className="text-brand">{q}</span>"</> : "All products"}
        </h1>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{results.length} product{results.length !== 1 && "s"} found</p>
      {results.length === 0 ? (
        <div className="mt-12 rounded-2xl border bg-card p-16 text-center">
          <p className="text-5xl">🔍</p>
          <p className="mt-4 font-semibold">No products found</p>
          <p className="mt-1 text-sm text-muted-foreground">Try a different keyword.</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {results.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
