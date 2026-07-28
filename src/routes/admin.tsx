import { createFileRoute, Link } from "@tanstack/react-router";
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, BarChart3, MessageSquare, Settings, Star, TrendingUp, ArrowUp, ArrowDown, DollarSign, Boxes, ClipboardList, Bell, LogOut } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { products, formatBDT, categories } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Bazaar" }, { name: "robots", content: "noindex" }] }),
  component: AdminPanel,
});

const revenueData = [
  { m: "Jan", revenue: 420000, orders: 340 },
  { m: "Feb", revenue: 510000, orders: 410 },
  { m: "Mar", revenue: 480000, orders: 380 },
  { m: "Apr", revenue: 620000, orders: 480 },
  { m: "May", revenue: 720000, orders: 560 },
  { m: "Jun", revenue: 890000, orders: 680 },
  { m: "Jul", revenue: 940000, orders: 720 },
];
const categoryData = categories.slice(0, 5).map((c, i) => ({ name: c.name, value: [32, 24, 18, 14, 12][i] }));
const COLORS = ["#2563eb", "#f97316", "#22c55e", "#a855f7", "#eab308"];

const recentOrders = [
  { id: "BZ483920", customer: "Sadia Rahman", total: 12490, status: "Delivered" },
  { id: "BZ483919", customer: "Mahin Ahmed", total: 3890, status: "Shipped" },
  { id: "BZ483918", customer: "Rifat Hossain", total: 8990, status: "Packed" },
  { id: "BZ483917", customer: "Tania Khan", total: 2290, status: "Pending" },
  { id: "BZ483916", customer: "Arif Islam", total: 5490, status: "Delivered" },
];

const recentCustomers = [
  { name: "Nusrat J.", city: "Dhaka", orders: 12, spent: 48200 },
  { name: "Mahin A.", city: "Chattogram", orders: 8, spent: 32900 },
  { name: "Rifat H.", city: "Sylhet", orders: 4, spent: 12400 },
  { name: "Tania K.", city: "Khulna", orders: 6, spent: 24800 },
];

function AdminPanel() {
  const nav = [
    { v: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { v: "products", label: "Products", icon: Package },
    { v: "orders", label: "Orders", icon: ShoppingCart },
    { v: "customers", label: "Customers", icon: Users },
    { v: "coupons", label: "Coupons", icon: Tag },
    { v: "analytics", label: "Analytics", icon: BarChart3 },
    { v: "reviews", label: "Reviews", icon: Star },
    { v: "messages", label: "Messages", icon: MessageSquare },
    { v: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6">
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border bg-card p-4 h-fit sticky top-32">
          <div className="mb-4 flex items-center gap-2 px-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg gradient-brand text-white text-sm font-black">A</div>
            <p className="font-black">Admin</p>
          </div>
          <Tabs defaultValue="dashboard" orientation="vertical" className="w-full">
            <TabsList className="flex-col h-auto w-full bg-transparent p-0 items-stretch">
              {nav.map((n) => (
                <TabsTrigger key={n.v} value={n.v} className="justify-start gap-2 data-[state=active]:bg-muted">
                  <n.icon className="h-4 w-4" /> {n.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="lg:hidden" />
          </Tabs>
          <Button variant="ghost" className="mt-4 w-full justify-start gap-2 text-muted-foreground"><LogOut className="h-4 w-4" /> Sign out</Button>
        </aside>

        <div>
          <Tabs defaultValue="dashboard">
            <TabsList className="lg:hidden mb-4 flex-wrap h-auto">
              {nav.map((n) => <TabsTrigger key={n.v} value={n.v}>{n.label}</TabsTrigger>)}
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><h1 className="text-2xl font-black">Dashboard</h1><p className="text-sm text-muted-foreground">Overview of your store performance</p></div>
                <Button className="gap-2"><ClipboardList className="h-4 w-4" /> Export report</Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Revenue", value: "৳9.4L", change: 12.4, up: true, icon: DollarSign, color: "bg-brand/10 text-brand" },
                  { label: "Orders", value: "720", change: 8.1, up: true, icon: ShoppingCart, color: "bg-accent/10 text-accent" },
                  { label: "Customers", value: "12,480", change: 5.6, up: true, icon: Users, color: "bg-success/10 text-success" },
                  { label: "Inventory", value: String(products.length * 12), change: 2.3, up: false, icon: Boxes, color: "bg-warning/10 text-warning" },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl border bg-card p-5">
                    <div className="flex items-center justify-between">
                      <div className={cn("grid h-10 w-10 place-items-center rounded-xl", s.color)}><s.icon className="h-5 w-5" /></div>
                      <span className={cn("flex items-center gap-1 text-xs font-semibold", s.up ? "text-success" : "text-destructive")}>
                        {s.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />} {s.change}%
                      </span>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">{s.label}</p>
                    <p className="mt-1 text-2xl font-black">{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-2xl border bg-card p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold">Revenue trend</p>
                    <Badge variant="outline">Last 7 months</Badge>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <defs>
                          <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2563eb" stopOpacity={0.5} />
                            <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 90%)" />
                        <XAxis dataKey="m" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} fill="url(#g1)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="rounded-2xl border bg-card p-5">
                  <p className="font-semibold mb-2">Sales by category</p>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={80} innerRadius={40} paddingAngle={2}>
                          {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border bg-card p-5">
                  <p className="font-semibold mb-2">Orders</p>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 90%)" />
                        <XAxis dataKey="m" /><YAxis /><Tooltip />
                        <Bar dataKey="orders" fill="#f97316" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="rounded-2xl border bg-card p-5">
                  <p className="font-semibold mb-2">Visitors</p>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 90%)" />
                        <XAxis dataKey="m" /><YAxis /><Tooltip />
                        <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} dot={{ fill: "#22c55e" }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border bg-card p-5">
                  <div className="flex items-center justify-between mb-3"><p className="font-semibold">Recent orders</p><Button variant="ghost" size="sm">View all</Button></div>
                  <Table>
                    <TableHeader><TableRow><TableHead>Order</TableHead><TableHead>Customer</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {recentOrders.map((o) => (
                        <TableRow key={o.id}>
                          <TableCell className="font-mono text-xs">{o.id}</TableCell>
                          <TableCell>{o.customer}</TableCell>
                          <TableCell className="font-semibold">{formatBDT(o.total)}</TableCell>
                          <TableCell><Badge variant={o.status === "Delivered" ? "default" : "outline"}>{o.status}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="rounded-2xl border bg-card p-5">
                  <div className="flex items-center justify-between mb-3"><p className="font-semibold">Top customers</p><Button variant="ghost" size="sm">View all</Button></div>
                  <div className="space-y-3">
                    {recentCustomers.map((c) => (
                      <div key={c.name} className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-full gradient-brand text-white font-bold">{c.name[0]}</div>
                        <div className="flex-1 min-w-0"><p className="font-medium">{c.name}</p><p className="text-xs text-muted-foreground">{c.city} · {c.orders} orders</p></div>
                        <p className="font-bold text-brand">{formatBDT(c.spent)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-black">Products</h1>
                <div className="flex gap-2"><Input placeholder="Search products" className="w-56" /><Button>+ Add product</Button></div>
              </div>
              <div className="rounded-2xl border bg-card overflow-x-auto">
                <Table>
                  <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Category</TableHead><TableHead>Price</TableHead><TableHead>Stock</TableHead><TableHead>Sold</TableHead><TableHead>Rating</TableHead><TableHead></TableHead></TableRow></TableHeader>
                  <TableBody>
                    {products.slice(0, 12).map((p) => (
                      <TableRow key={p.id}>
                        <TableCell><div className="flex items-center gap-3"><img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" /><span className="line-clamp-1 max-w-[220px]">{p.title}</span></div></TableCell>
                        <TableCell><Badge variant="outline">{p.subcategory}</Badge></TableCell>
                        <TableCell className="font-semibold">{formatBDT(p.price)}</TableCell>
                        <TableCell><Badge className={cn(p.stock > 50 ? "bg-success" : p.stock > 10 ? "bg-warning" : "bg-destructive", "text-white")}>{p.stock}</Badge></TableCell>
                        <TableCell>{p.sold.toLocaleString()}</TableCell>
                        <TableCell><span className="flex items-center gap-1"><Star className="h-3 w-3 fill-warning text-warning" /> {p.rating}</span></TableCell>
                        <TableCell className="text-right"><Button variant="ghost" size="sm">Edit</Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
              <h1 className="text-2xl font-black">Orders</h1>
              <div className="rounded-2xl border bg-card overflow-x-auto">
                <Table>
                  <TableHeader><TableRow><TableHead>Order</TableHead><TableHead>Customer</TableHead><TableHead>Date</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
                  <TableBody>
                    {recentOrders.concat(recentOrders).map((o, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-mono text-xs">{o.id}</TableCell>
                        <TableCell>{o.customer}</TableCell>
                        <TableCell className="text-muted-foreground">Jul {22 - i}, 2026</TableCell>
                        <TableCell className="font-semibold">{formatBDT(o.total)}</TableCell>
                        <TableCell><Badge variant="outline">{o.status}</Badge></TableCell>
                        <TableCell className="text-right"><Button variant="ghost" size="sm">Invoice</Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="customers">
              <h1 className="text-2xl font-black mb-4">Customers</h1>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {recentCustomers.concat(recentCustomers).map((c, i) => (
                  <div key={i} className="rounded-2xl border bg-card p-4 flex gap-3 items-center">
                    <div className="grid h-12 w-12 place-items-center rounded-full gradient-brand text-white font-black">{c.name[0]}</div>
                    <div className="flex-1 min-w-0"><p className="font-semibold">{c.name}</p><p className="text-xs text-muted-foreground">{c.city}</p></div>
                    <div className="text-right"><p className="font-bold text-brand">{formatBDT(c.spent)}</p><p className="text-xs text-muted-foreground">{c.orders} orders</p></div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="coupons">
              <h1 className="text-2xl font-black mb-4">Coupons</h1>
              <div className="grid gap-3 md:grid-cols-3">
                {[{ code: "BAZAAR2K", desc: "৳2,000 off on ৳5,000+", uses: 340 }, { code: "WELCOME10", desc: "10% off first order", uses: 2100 }, { code: "FREESHIP", desc: "Free shipping", uses: 890 }].map((c) => (
                  <div key={c.code} className="rounded-2xl border-2 border-dashed border-brand/30 bg-brand/5 p-5">
                    <p className="font-mono text-xl font-black text-brand">{c.code}</p>
                    <p className="mt-1 text-sm">{c.desc}</p>
                    <p className="mt-3 text-xs text-muted-foreground">{c.uses} redemptions</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <h1 className="text-2xl font-black mb-4">Analytics</h1>
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border bg-card p-5">
                  <p className="font-semibold mb-2">Conversion rate</p>
                  <p className="text-3xl font-black">3.42% <span className="text-sm text-success">+0.4%</span></p>
                </div>
                <div className="rounded-2xl border bg-card p-5">
                  <p className="font-semibold mb-2">Avg order value</p>
                  <p className="text-3xl font-black">৳4,890 <span className="text-sm text-success">+12%</span></p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <h1 className="text-2xl font-black mb-4">Reviews</h1>
              <div className="space-y-3">
                {products.slice(0, 4).map((p) => (
                  <div key={p.id} className="flex gap-3 rounded-2xl border bg-card p-4">
                    <img src={p.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
                    <div className="flex-1"><p className="font-medium">{p.title}</p><p className="text-sm text-muted-foreground">"Excellent product, fast delivery!"</p></div>
                    <div className="flex items-center gap-1"><Star className="h-4 w-4 fill-warning text-warning" /><span className="font-semibold">{p.rating}</span></div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="messages">
              <h1 className="text-2xl font-black mb-4">Messages</h1>
              <div className="rounded-2xl border bg-card p-16 text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 font-semibold">Inbox is empty</p>
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <h1 className="text-2xl font-black mb-4">Settings</h1>
              <div className="rounded-2xl border bg-card p-6 space-y-4">
                <div><label className="text-sm font-medium">Store name</label><Input defaultValue="Bazaar Bangladesh" className="mt-1" /></div>
                <div><label className="text-sm font-medium">Support email</label><Input defaultValue="support@bazaar.com.bd" className="mt-1" /></div>
                <Button>Save changes</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
