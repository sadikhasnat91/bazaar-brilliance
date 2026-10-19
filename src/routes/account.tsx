import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useSearch } from "@tanstack/react-router";
import { User, Package, Heart, MapPin, Bell, Settings as SettingsIcon, Star, LogOut, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { formatBDT } from "@/lib/data";
import { useShop } from "@/lib/shop-context";
import { ProductCard } from "@/components/product-card";
import { toast } from "sonner";

const searchSchema = z.object({ tab: z.string().optional().default("dashboard") });

export const Route = createFileRoute("/account")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "My account — Bazaar" }, { name: "robots", content: "noindex" }] }),
  component: AccountPage,
});

const mockOrders = [
  { id: "BZ483920", date: "Jul 22, 2026", total: 12490, status: "Delivered", items: 3 },
  { id: "BZ483911", date: "Jul 10, 2026", total: 3990, status: "Shipped", items: 1 },
  { id: "BZ483802", date: "Jun 28, 2026", total: 8990, status: "Delivered", items: 2 },
  { id: "BZ483720", date: "Jun 12, 2026", total: 2290, status: "Cancelled", items: 1 },
];

const mockAddresses = [
  { label: "Home", name: "Rifat Hossain", line: "House 12, Road 4, Dhanmondi", city: "Dhaka 1209", phone: "+8801700000000", isDefault: true },
  { label: "Office", name: "Rifat Hossain", line: "Gulshan Trade Center, 12th floor", city: "Dhaka 1212", phone: "+8801700000000", isDefault: false },
];

const mockNotifications = [
  { title: "Order BZ483920 delivered", desc: "Enjoy your new headphones!", time: "2 hours ago", type: "success" },
  { title: "Flash sale starting", desc: "Up to 60% off electronics — starts in 1h", time: "5 hours ago", type: "info" },
  { title: "Coupon expiring soon", desc: "WELCOME10 expires in 2 days", time: "1 day ago", type: "warning" },
];

function AccountPage() {
  const { tab } = useSearch({ from: "/account" });
  const { wishlist, products } = useShop();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    setIsAdmin(typeof window !== "undefined" && localStorage.getItem("bazaar_admin_authenticated") === "true");
  }, []);

  if (isAdmin === null) return null;

  if (!isAdmin) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-destructive/10 text-destructive mb-4">
          <Lock className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-black">Admin Access Required</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          Dashboard and order management are restricted to administrator accounts. Random visitors cannot access this page.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link to="/admin">Sign In as Admin</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">Back to Marketplace</Link>
          </Button>
        </div>
      </div>
    );
  }

  const nav = [
    { v: "dashboard", label: "Dashboard", icon: User },
    { v: "orders", label: "Orders", icon: Package },
    { v: "wishlist", label: "Wishlist", icon: Heart },
    { v: "reviews", label: "Reviews", icon: Star },
    { v: "addresses", label: "Addresses", icon: MapPin },
    { v: "notifications", label: "Notifications", icon: Bell },
    { v: "settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="rounded-3xl gradient-hero p-6 sm:p-8 text-white">
        <div className="flex flex-wrap items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-white/20 text-2xl font-black">R</div>
          <div>
            <p className="text-sm text-white/70">Welcome back</p>
            <h1 className="text-2xl font-black">Rifat Hossain</h1>
            <p className="text-sm text-white/80">Gold member since 2024 · 42 orders</p>
          </div>
          <Button variant="secondary" className="ml-auto bg-white text-primary hover:bg-white/90"><LogOut className="h-4 w-4 mr-2" />Log out</Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border bg-card p-3 h-fit sticky top-32">
          <nav className="space-y-1">
            {nav.map((n) => (
              <Link key={n.v} to="/account" search={{ tab: n.v }} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted ${tab === n.v ? "bg-muted font-semibold" : ""}`}>
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            ))}
          </nav>
        </aside>

        <div>
          <Tabs value={tab}>
            <TabsList className="lg:hidden mb-4 flex-wrap h-auto">
              {nav.map((n) => (
                <TabsTrigger key={n.v} value={n.v} asChild>
                  <Link to="/account" search={{ tab: n.v }}>{n.label}</Link>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-4">
                {[
                  { label: "Total orders", value: "42", icon: Package },
                  { label: "Wishlist", value: String(wishlist.length), icon: Heart },
                  { label: "Reviews", value: "12", icon: Star },
                  { label: "Reward points", value: "2,450", icon: Bell },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl border bg-card p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                      <s.icon className="h-4 w-4 text-brand" />
                    </div>
                    <p className="mt-2 text-2xl font-black">{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border bg-card p-6">
                <div className="flex items-center justify-between mb-4"><p className="font-semibold">Recent orders</p><Link to="/account" search={{ tab: "orders" }} className="text-sm text-brand">View all</Link></div>
                <OrdersList orders={mockOrders.slice(0, 3)} />
              </div>
            </TabsContent>

            <TabsContent value="orders">
              <div className="rounded-2xl border bg-card p-6">
                <p className="font-semibold mb-4">All orders</p>
                <OrdersList orders={mockOrders} />
              </div>
            </TabsContent>

            <TabsContent value="wishlist">
              {wishlist.length === 0 ? (
                <div className="rounded-2xl border bg-card p-16 text-center">
                  <p className="text-5xl">💝</p>
                  <p className="mt-4 font-semibold">Your wishlist is empty</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                  {wishlist.map((id) => products.find((p) => p.id === id)).filter(Boolean).map((p) => p && <ProductCard key={p.id} product={p} />)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="reviews">
              <div className="rounded-2xl border bg-card p-6 space-y-4">
                <p className="font-semibold">Your reviews</p>
                {products.slice(0, 3).map((p) => (
                  <div key={p.id} className="flex gap-4 border-b pb-4 last:border-0">
                    <img src={p.image} alt="" className="h-16 w-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <Link to="/product/$id" params={{ id: p.slug }} className="font-medium hover:text-brand">{p.title}</Link>
                      <div className="mt-1 flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-warning text-warning" />)}</div>
                      <p className="mt-1 text-sm text-muted-foreground">Great product, arrived on time and works perfectly.</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="addresses">
              <div className="grid gap-4 md:grid-cols-2">
                {mockAddresses.map((a) => (
                  <div key={a.label} className="rounded-2xl border bg-card p-6">
                    <div className="flex items-start justify-between">
                      <div><p className="font-semibold">{a.label}</p>{a.isDefault && <Badge className="mt-1">Default</Badge>}</div>
                      <div className="flex gap-2"><Button variant="ghost" size="sm">Edit</Button><Button variant="ghost" size="sm" className="text-destructive">Delete</Button></div>
                    </div>
                    <p className="mt-3 text-sm">{a.name}</p>
                    <p className="text-sm text-muted-foreground">{a.line}</p>
                    <p className="text-sm text-muted-foreground">{a.city}</p>
                    <p className="text-sm text-muted-foreground">{a.phone}</p>
                  </div>
                ))}
                <button className="rounded-2xl border-2 border-dashed p-6 text-center hover:border-brand hover:text-brand">+ Add new address</button>
              </div>
            </TabsContent>

            <TabsContent value="notifications">
              <div className="rounded-2xl border bg-card divide-y">
                {mockNotifications.map((n, i) => (
                  <div key={i} className="flex items-start gap-3 p-4">
                    <div className={`h-2 w-2 mt-2 rounded-full ${n.type === "success" ? "bg-success" : n.type === "warning" ? "bg-warning" : "bg-brand"}`} />
                    <div className="flex-1"><p className="font-medium">{n.title}</p><p className="text-sm text-muted-foreground">{n.desc}</p></div>
                    <span className="text-xs text-muted-foreground shrink-0">{n.time}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="space-y-6">
                <form onSubmit={(e) => { e.preventDefault(); toast.success("Profile updated"); }} className="rounded-2xl border bg-card p-6 space-y-4">
                  <p className="font-semibold">Profile</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><Label>First name</Label><Input defaultValue="Rifat" /></div>
                    <div><Label>Last name</Label><Input defaultValue="Hossain" /></div>
                    <div><Label>Email</Label><Input defaultValue="rifat@example.com" /></div>
                    <div><Label>Phone</Label><Input defaultValue="+8801700000000" /></div>
                  </div>
                  <Button>Save profile</Button>
                </form>
                <form onSubmit={(e) => { e.preventDefault(); toast.success("Password changed"); }} className="rounded-2xl border bg-card p-6 space-y-4">
                  <p className="font-semibold flex items-center gap-2"><Lock className="h-4 w-4" /> Change password</p>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div><Label>Current</Label><Input type="password" /></div>
                    <div><Label>New</Label><Input type="password" /></div>
                    <div><Label>Confirm</Label><Input type="password" /></div>
                  </div>
                  <Button>Update password</Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function OrdersList({ orders }: { orders: typeof mockOrders }) {
  const statusColor: Record<string, string> = { Delivered: "bg-success text-success-foreground", Shipped: "bg-brand text-brand-foreground", Cancelled: "bg-destructive text-destructive-foreground", Pending: "bg-warning text-warning-foreground" };
  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <div key={o.id} className="flex flex-wrap items-center gap-3 rounded-xl border p-4">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-muted"><Package className="h-5 w-5" /></div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{o.id}</p>
            <p className="text-xs text-muted-foreground">{o.date} · {o.items} item{o.items > 1 && "s"}</p>
          </div>
          <Badge className={statusColor[o.status] || ""}>{o.status}</Badge>
          <p className="font-bold text-brand">{formatBDT(o.total)}</p>
          <Link to="/track" className="text-sm text-brand hover:underline">Track</Link>
        </div>
      ))}
    </div>
  );
}
