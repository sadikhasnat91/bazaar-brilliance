import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { formatBDT, type Product } from "@/lib/data";
import { useShop } from "@/lib/shop-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const wished = isWishlisted(product.id);
  return (
    <div className={cn("group relative flex flex-col overflow-hidden rounded-2xl border bg-card card-lift", className)}>
      <Link to="/product/$id" params={{ id: product.slug }} className="relative block aspect-square overflow-hidden bg-muted">
        <img loading="lazy" src={product.image} alt={product.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        {product.discount > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">-{product.discount}%</span>
        )}
        {product.badge && (
          <span className="absolute right-2 top-2 rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">{product.badge}</span>
        )}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
          className="absolute bottom-2 right-2 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-foreground shadow-sm opacity-0 transition-all group-hover:opacity-100 hover:scale-110"
          aria-label="Toggle wishlist"
        >
          <Heart className={cn("h-4 w-4", wished && "fill-destructive text-destructive")} />
        </button>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link to="/product/$id" params={{ id: product.slug }} className="line-clamp-2 text-sm font-medium leading-snug hover:text-brand">
          {product.title}
        </Link>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
          <span className="font-medium text-foreground">{product.rating}</span>
          <span>({product.reviews.toLocaleString()})</span>
          <span className="mx-1">•</span>
          <span>{product.sold.toLocaleString()} sold</span>
        </div>
        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-lg font-bold text-brand">{formatBDT(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-muted-foreground line-through">{formatBDT(product.originalPrice)}</span>
          )}
        </div>
        <Button size="sm" className="w-full" onClick={() => addToCart(product.id)}>Add to cart</Button>
      </div>
    </div>
  );
}
