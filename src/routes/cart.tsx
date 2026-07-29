import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag, Tag } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useShop } from "@/lib/shop-context";
import { formatBDT } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — Bazaar" }, { name: "description", content: "Your shopping cart" }, { name: "robots", content: "noindex" }] }),
  component: CartPage,
});

function CartPage() {
  const { cartProducts, cartTotal, updateQty, removeFromCart, clearCart, products } = useShop();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const shipping = cartTotal > 999 || cartTotal === 0 ? 0 : 60;
  const total = Math.max(0, cartTotal - discount) + shipping;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "BAZAAR2K" && cartTotal >= 5000) {
      setDiscount(2000);
      toast.success("Coupon applied — ৳2,000 off");
    } else if (coupon.toUpperCase() === "WELCOME10") {
      setDiscount(Math.round(cartTotal * 0.1));
      toast.success("Coupon applied — 10% off");
    } else {
      setDiscount(0);
      toast.error("Invalid coupon");
    }
  };

  if (cartProducts.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="grid h-24 w-24 mx-auto place-items-center rounded-full bg-muted"><ShoppingBag className="h-10 w-10 text-muted-foreground" /></div>
        <h1 className="mt-6 text-3xl font-black">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Discover thousands of great products.</p>
        <Button asChild size="lg" className="mt-6"><Link to="/">Start shopping</Link></Button>
        <div className="mt-16 text-left">
          <h2 className="text-xl font-bold mb-4">Recommended for you</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {products.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black">Shopping cart</h1>
        <Button variant="ghost" size="sm" onClick={clearCart}>Clear cart</Button>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {cartProducts.map(({ product, qty }) => (
            <div key={product.id} className="flex gap-4 rounded-2xl border bg-card p-4">
              <Link to="/product/$id" params={{ id: product.slug }} className="shrink-0">
                <img src={product.image} alt={product.title} className="h-24 w-24 rounded-xl object-cover sm:h-28 sm:w-28" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to="/product/$id" params={{ id: product.slug }} className="font-medium line-clamp-2 hover:text-brand">{product.title}</Link>
                <p className="mt-1 text-xs text-muted-foreground">{product.brand} · {product.seller}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <div className="flex items-center rounded-full border">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-l-full" onClick={() => updateQty(product.id, qty - 1)}><Minus className="h-3 w-3" /></Button>
                    <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-r-full" onClick={() => updateQty(product.id, qty + 1)}><Plus className="h-3 w-3" /></Button>
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeFromCart(product.id)}>
                    <Trash2 className="h-4 w-4 mr-1" /> Remove
                  </Button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-brand">{formatBDT(product.price * qty)}</p>
                <p className="text-xs text-muted-foreground line-through">{formatBDT(product.originalPrice * qty)}</p>
              </div>
            </div>
          ))}
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border bg-card p-5">
            <p className="font-semibold flex items-center gap-2"><Tag className="h-4 w-4" /> Apply coupon</p>
            <div className="mt-3 flex gap-2">
              <Input placeholder="BAZAAR2K" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
              <Button onClick={applyCoupon}>Apply</Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Try WELCOME10 or BAZAAR2K (min ৳5,000)</p>
          </div>
          <div className="rounded-2xl border bg-card p-5">
            <p className="font-semibold">Order summary</p>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatBDT(cartTotal)}</dd></div>
              <div className="flex justify-between"><dt>Shipping</dt><dd>{shipping === 0 ? "Free" : formatBDT(shipping)}</dd></div>
              {discount > 0 && <div className="flex justify-between text-success"><dt>Discount</dt><dd>-{formatBDT(discount)}</dd></div>}
              <div className="border-t pt-2 flex justify-between text-lg font-bold"><dt>Total</dt><dd className="text-brand">{formatBDT(total)}</dd></div>
            </dl>
            <Button asChild size="lg" className="mt-4 w-full"><Link to="/checkout">Proceed to checkout</Link></Button>
            <Button asChild variant="outline" size="sm" className="mt-2 w-full"><Link to="/">Continue shopping</Link></Button>
          </div>
        </aside>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">You might also like</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {products.slice(10, 15).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
