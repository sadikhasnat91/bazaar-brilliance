import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, Heart, Menu, Mic, Search, ShoppingCart, User, ChevronDown } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { categories } from "@/lib/data";
import { useShop } from "@/lib/shop-context";
import { cn } from "@/lib/utils";

export function Header() {
  const { cartCount, wishlist, products } = useShop();
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setFocus(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const suggestions = q
    ? products.filter((p) => p.title.toLowerCase().includes(q.toLowerCase())).slice(0, 6)
    : [];

  const submitSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    navigate({ to: "/search", search: { q } });
    setFocus(false);
  };

  const popularSearches = ["iPhone 15", "Saree", "Air fryer", "Cricket bat", "Vitamin C"];

  return (
    <header className={cn("sticky top-0 z-40 w-full border-b transition-all", scrolled ? "bg-background/90 backdrop-blur-md shadow-soft" : "bg-background")}>
      {/* Announcement */}
      <div className="bg-primary text-primary-foreground text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5">
          <div className="hidden md:flex items-center gap-4">
            <span>🚚 Free delivery on orders over ৳999</span>
            <span className="opacity-70">|</span>
            <span>Cash on Delivery • bKash • Card</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/track" className="hover:underline">Track order</Link>
            <span className="opacity-40">|</span>
            <Link to="/help" className="hover:underline">Help</Link>
            <span className="opacity-40">|</span>
            <Link to="/seller" className="hover:underline">Sell on Bazaar</Link>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <div className="mt-6 flex flex-col gap-1">
              <p className="px-2 pb-2 text-xs font-semibold uppercase text-muted-foreground">Shop</p>
              {categories.map((c) => (
                <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} className="rounded-lg px-3 py-2 text-sm hover:bg-muted">
                  {c.name}
                </Link>
              ))}
              <p className="mt-4 px-2 pb-2 text-xs font-semibold uppercase text-muted-foreground">Account</p>
              <Link to="/account" className="rounded-lg px-3 py-2 text-sm hover:bg-muted">Dashboard</Link>
              <Link to="/wishlist" className="rounded-lg px-3 py-2 text-sm hover:bg-muted">Wishlist</Link>
              <Link to="/track" className="rounded-lg px-3 py-2 text-sm hover:bg-muted">Track order</Link>
              <Link to="/admin" className="rounded-lg px-3 py-2 text-sm hover:bg-muted">Admin panel</Link>
            </div>
          </SheetContent>
        </Sheet>

        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="grid h-9 w-9 place-items-center rounded-xl gradient-brand text-white font-black">B</div>
          <span className="text-xl font-black tracking-tight hidden sm:inline">Bazaar<span className="text-accent">.</span></span>
        </Link>

        <div ref={wrapRef} className="relative flex-1 max-w-2xl">
          <form onSubmit={submitSearch} className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => setFocus(true)}
              placeholder="Search 100k+ products, brands and categories"
              className="h-11 rounded-full border-2 pl-10 pr-24 focus-visible:border-brand focus-visible:ring-brand/20"
            />
            <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-1">
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-full" aria-label="Voice search">
                <Mic className="h-4 w-4" />
              </Button>
              <Button type="submit" size="sm" className="rounded-full">Search</Button>
            </div>
          </form>

          {focus && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border bg-popover shadow-card animate-float-up">
              {suggestions.length > 0 ? (
                <div>
                  <p className="border-b px-4 py-2 text-xs font-semibold uppercase text-muted-foreground">Suggestions</p>
                  {suggestions.map((p) => (
                    <Link key={p.id} to="/product/$id" params={{ id: p.slug }} onClick={() => setFocus(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-muted">
                      <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm">{p.title}</p>
                        <p className="text-xs text-muted-foreground">{p.brand} • {p.subcategory}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Popular searches</p>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((s) => (
                        <button key={s} onClick={() => { setQ(s); navigate({ to: "/search", search: { q: s } }); setFocus(false); }} className="rounded-full border px-3 py-1 text-xs hover:bg-muted">
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Browse categories</p>
                    <div className="grid grid-cols-2 gap-1">
                      {categories.slice(0, 6).map((c) => (
                        <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} onClick={() => setFocus(false)} className="rounded-lg px-2 py-1.5 text-sm hover:bg-muted">
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Link to="/notifications" className="hidden md:grid relative h-10 w-10 place-items-center rounded-full hover:bg-muted" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
          </Link>
          <Link to="/wishlist" className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-muted" aria-label="Wishlist">
            <Heart className="h-5 w-5" />
            {wishlist.length > 0 && (
              <Badge className="absolute -right-1 -top-1 h-5 min-w-5 justify-center rounded-full bg-accent px-1 text-[10px] text-accent-foreground">{wishlist.length}</Badge>
            )}
          </Link>
          <Link to="/cart" className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-muted" aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge className="absolute -right-1 -top-1 h-5 min-w-5 justify-center rounded-full bg-accent px-1 text-[10px] text-accent-foreground">{cartCount}</Badge>
            )}
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Account">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link to="/login">Login</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/register">Register</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link to="/account">Dashboard</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/account" search={{ tab: "orders" }}>Orders</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/wishlist">Wishlist</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/account" search={{ tab: "settings" }}>Settings</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link to="/admin">Admin Panel</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Category bar (mega nav) */}
      <nav className="hidden lg:block border-t bg-background">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 py-1.5 text-sm">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 font-semibold">
                <Menu className="h-4 w-4" /> All categories <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
              {categories.map((c) => (
                <DropdownMenuItem key={c.slug} asChild>
                  <Link to="/category/$slug" params={{ slug: c.slug }}>{c.name}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {categories.slice(0, 7).map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className={cn("rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground", pathname.includes(c.slug) && "bg-muted text-foreground")}
            >
              {c.name}
            </Link>
          ))}
          <span className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
            <span>EN | BN</span>
            <span>BDT ৳</span>
          </span>
        </div>
      </nav>
    </header>
  );
}
