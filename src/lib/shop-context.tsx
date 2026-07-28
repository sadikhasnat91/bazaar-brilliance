import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { products, type Product } from "./data";

type CartItem = { id: string; qty: number };
type Ctx = {
  cart: CartItem[];
  wishlist: string[];
  recent: string[];
  addToCart: (id: string, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  markViewed: (id: string) => void;
  cartCount: number;
  cartTotal: number;
  cartProducts: Array<{ product: Product; qty: number }>;
};

const ShopCtx = createContext<Ctx | null>(null);
const KEY_CART = "shop_cart_v1";
const KEY_WISH = "shop_wish_v1";
const KEY_RECENT = "shop_recent_v1";

function safeLoad<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { return JSON.parse(localStorage.getItem(key) || "") as T; } catch { return fallback; }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCart(safeLoad(KEY_CART, []));
    setWishlist(safeLoad(KEY_WISH, []));
    setRecent(safeLoad(KEY_RECENT, []));
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(KEY_CART, JSON.stringify(cart)); }, [cart, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem(KEY_WISH, JSON.stringify(wishlist)); }, [wishlist, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem(KEY_RECENT, JSON.stringify(recent)); }, [recent, hydrated]);

  const addToCart = (id: string, qty = 1) => {
    setCart((c) => {
      const existing = c.find((i) => i.id === id);
      if (existing) return c.map((i) => i.id === id ? { ...i, qty: i.qty + qty } : i);
      return [...c, { id, qty }];
    });
    toast.success("Added to cart");
  };
  const removeFromCart = (id: string) => setCart((c) => c.filter((i) => i.id !== id));
  const updateQty = (id: string, qty: number) => setCart((c) => c.map((i) => i.id === id ? { ...i, qty: Math.max(1, qty) } : i));
  const clearCart = () => setCart([]);
  const toggleWishlist = (id: string) => {
    setWishlist((w) => {
      if (w.includes(id)) { toast("Removed from wishlist"); return w.filter((x) => x !== id); }
      toast.success("Added to wishlist"); return [...w, id];
    });
  };
  const isWishlisted = (id: string) => wishlist.includes(id);
  const markViewed = (id: string) => setRecent((r) => [id, ...r.filter((x) => x !== id)].slice(0, 12));

  const cartProducts = cart
    .map((i) => ({ product: products.find((p) => p.id === i.id)!, qty: i.qty }))
    .filter((x) => x.product);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cartProducts.reduce((s, { product, qty }) => s + product.price * qty, 0);

  return (
    <ShopCtx.Provider value={{ cart, wishlist, recent, addToCart, removeFromCart, updateQty, clearCart, toggleWishlist, isWishlisted, markViewed, cartCount, cartTotal, cartProducts }}>
      {children}
    </ShopCtx.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopCtx);
  if (!ctx) throw new Error("useShop must be inside ShopProvider");
  return ctx;
}
