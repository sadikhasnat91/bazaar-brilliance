import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { useShop } from "@/lib/shop-context";
import { products } from "@/lib/data";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — Bazaar" }, { name: "description", content: "Your saved products" }, { name: "robots", content: "noindex" }] }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist } = useShop();
  const items = wishlist.map((id) => products.find((p) => p.id === id)).filter(Boolean);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-3xl font-black flex items-center gap-2"><Heart className="h-8 w-8 text-destructive fill-destructive" /> My wishlist</h1>
      <p className="mt-1 text-muted-foreground">{items.length} saved item{items.length !== 1 && "s"}</p>
      {items.length === 0 ? (
        <div className="mt-12 rounded-2xl border bg-card p-16 text-center">
          <p className="text-5xl">💝</p>
          <p className="mt-4 font-semibold">Your wishlist is empty</p>
          <p className="mt-1 text-sm text-muted-foreground">Save products you love to buy later.</p>
          <Button asChild className="mt-6"><Link to="/">Discover products</Link></Button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((p) => p && <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
