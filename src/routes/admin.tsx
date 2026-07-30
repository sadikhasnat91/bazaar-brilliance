import { createFileRoute, Link } from "@tanstack/react-router";
import {
  LayoutDashboard, Package, ShoppingCart, Users, User, Tag, BarChart3, MessageSquare,
  Settings, Star, TrendingUp, ArrowUp, ArrowDown, DollarSign, Boxes, ClipboardList,
  Bell, LogOut, Shield, Lock, Mail, Eye, EyeOff, KeyRound, Search, Plus, Trash2, Edit,
  FileText, CheckCircle2, AlertCircle, Send, Printer, RefreshCw, X, Image as ImageIcon,
  SlidersHorizontal, ToggleLeft, ToggleRight, ExternalLink, GripVertical, ChevronUp, ChevronDown
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProductsFn,
  addProductFn,
  updateProductFn,
  deleteProductFn,
  getOrdersFn,
  addOrderFn,
  updateOrderStatusFn,
  getCustomersFn,
  addCustomerFn,
  getCouponsFn,
  addCouponFn,
  deleteCouponFn,
  getMessagesFn,
  replyToMessageFn,
  getAdsFn,
  addAdFn,
  updateAdFn,
  deleteAdFn,
  getCarouselFn,
  addCarouselSlideFn,
  updateCarouselSlideFn,
  deleteCarouselSlideFn,
  getBrandsFn,
  addBrandFn,
  updateBrandFn,
  deleteBrandFn,
  getCategoryBannersFn,
  addCategoryBannerFn,
  updateCategoryBannerFn,
  deleteCategoryBannerFn,
} from "@/lib/products-api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatBDT, categories, type BrandSpotlight, type CategoryBanner, type Product } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Portal — Bazaar" }, { name: "robots", content: "noindex" }] }),
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
const MAX_GALLERY_IMAGES = 5;

function percentChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

function buildMonthlyRevenueData(orders: Order[], months = 7) {
  const now = new Date();
  const monthFrames = Array.from({ length: months }, (_, idx) => {
    const offset = months - idx - 1;
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const key = `${date.getFullYear()}-${month}`;
    const label = date.toLocaleDateString("en-US", { month: "short" });
    return { key, label };
  });

  const buckets = new Map(
    monthFrames.map(({ key, label }) => [key, { m: label, revenue: 0, orders: 0, customers: new Set<string>() }])
  );

  for (const order of orders) {
    const parsedDate = new Date(order.date);
    if (Number.isNaN(parsedDate.getTime())) continue;

    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const key = `${parsedDate.getFullYear()}-${month}`;
    const bucket = buckets.get(key);
    if (!bucket) continue;

    bucket.revenue += Number(order.total) || 0;
    bucket.orders += 1;
    bucket.customers.add((order.email || order.customer || "").toLowerCase());
  }

  return monthFrames.map(({ key }) => {
    const bucket = buckets.get(key)!;
    return {
      m: bucket.m,
      revenue: bucket.revenue,
      orders: bucket.orders,
      customers: bucket.customers.size,
    };
  });
}

type Order = {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: "Delivered" | "Shipped" | "Packed" | "Pending" | "Cancelled";
  date: string;
  itemsCount: number;
  items: Array<{ title: string; qty: number; price: number }>;
};

const initialOrders: Order[] = [
  { id: "BZ483920", customer: "Sadia Rahman", email: "sadia@example.com", total: 12490, status: "Delivered", date: "Jul 22, 2026", itemsCount: 3, items: [{ title: "SonicWave X7 ANC Headphones", qty: 1, price: 8990 }, { title: "Trailblazer Running Shoes", qty: 1, price: 3490 }] },
  { id: "BZ483919", customer: "Mahin Ahmed", email: "mahin@example.com", total: 3890, status: "Shipped", date: "Jul 21, 2026", itemsCount: 1, items: [{ title: "Silk Blend Saree — Emerald", qty: 1, price: 3890 }] },
  { id: "BZ483918", customer: "Rifat Hossain", email: "rifat@example.com", total: 8990, status: "Packed", date: "Jul 20, 2026", itemsCount: 1, items: [{ title: "PowerFlex Adjustable Dumbbell", qty: 1, price: 8990 }] },
  { id: "BZ483917", customer: "Tania Khan", email: "tania@example.com", total: 2290, status: "Pending", date: "Jul 19, 2026", itemsCount: 1, items: [{ title: "ChefPro 5L Non-Stick Wok", qty: 1, price: 2290 }] },
  { id: "BZ483916", customer: "Arif Islam", email: "arif@example.com", total: 5490, status: "Delivered", date: "Jul 18, 2026", itemsCount: 2, items: [{ title: "SG Player Edition Cricket Bat", qty: 1, price: 5490 }] },
];

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  orders: number;
  spent: number;
};

const initialCustomers: Customer[] = [
  { id: "CUST-001", name: "Nusrat Jahan", email: "nusrat@example.com", phone: "+8801711223344", city: "Dhaka", orders: 12, spent: 48200 },
  { id: "CUST-002", name: "Mahin Ahmed", email: "mahin@example.com", phone: "+8801822334455", city: "Chattogram", orders: 8, spent: 32900 },
  { id: "CUST-003", name: "Rifat Hossain", email: "rifat@example.com", phone: "+8801933445566", city: "Sylhet", orders: 4, spent: 12400 },
  { id: "CUST-004", name: "Tania Khan", email: "tania@example.com", phone: "+8801544556677", city: "Khulna", orders: 6, spent: 24800 },
  { id: "CUST-005", name: "Arif Islam", email: "arif@example.com", phone: "+8801655667788", city: "Rajshahi", orders: 5, spent: 19500 },
];

type Coupon = {
  code: string;
  desc: string;
  discount: string;
  uses: number;
  active: boolean;
};

const initialCoupons: Coupon[] = [
  { code: "BAZAAR2K", desc: "৳2,000 off on orders over ৳5,000", discount: "৳2,000 OFF", uses: 340, active: true },
  { code: "WELCOME10", desc: "10% off your first order", discount: "10% OFF", uses: 2100, active: true },
  { code: "FREESHIP", desc: "Free standard delivery across Bangladesh", discount: "FREE SHIPPING", uses: 890, active: true },
];

type CustomerMessage = {
  id: string;
  sender: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  replied: boolean;
  replyText?: string;
};

const initialMessages: CustomerMessage[] = [
  { id: "MSG-101", sender: "Kazi Farhan", email: "farhan@example.com", subject: "Express Delivery Inquiry", message: "Is same-day delivery available in Dhanmondi, Dhaka for electronics?", date: "2 hours ago", replied: false },
  { id: "MSG-102", sender: "Sumaiya Akter", email: "sumaiya@example.com", subject: "Warranty details for Aurora Pro", message: "Does the 1-year warranty cover accidental damage?", date: "5 hours ago", replied: false },
  { id: "MSG-103", sender: "Tanvir Hasan", email: "tanvir@example.com", subject: "bKash Cashback Query", message: "I paid via bKash but haven't received the cashback SMS yet.", date: "1 day ago", replied: true, replyText: "Cashback takes up to 24 hours to process from bKash gateway." },
];

function AdminLoginGatekeeper({ onLogin }: { onLogin: () => void }) {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const storedId = localStorage.getItem("bazaar_admin_id") || "admin";
      const storedPass = localStorage.getItem("bazaar_admin_password") || "admin123";

      if (adminId.trim() === storedId && password === storedPass) {
        toast.success("Authenticated as Administrator");
        onLogin();
      } else {
        setError("Invalid Admin ID or Password.");
        toast.error("Access denied — Invalid admin credentials");
      }
      setLoading(false);
    }, 350);
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl gradient-hero text-white shadow-soft">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Admin Portal</h1>
          <p className="text-sm text-muted-foreground">Private area — Direct URL access only</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl border bg-card p-8 shadow-card space-y-4">
          {error && (
            <div className="rounded-xl bg-destructive/10 p-3 text-xs text-destructive font-medium border border-destructive/20">
              {error}
            </div>
          )}

          <div>
            <Label className="text-xs font-semibold uppercase text-muted-foreground">Admin ID</Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                required
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="Enter Admin ID"
                className="pl-9 h-11 rounded-xl"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold uppercase text-muted-foreground">Password</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 pr-10 h-11 rounded-xl"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full rounded-xl font-bold" disabled={loading}>
            {loading ? "Authenticating..." : "Sign In to Admin Panel"}
          </Button>

          <p className="text-center text-xs text-muted-foreground pt-2">
            Return to <Link to="/" className="text-brand font-semibold hover:underline">Marketplace Home</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Dynamic States
  const queryClient = useQueryClient();

  // Products Query/Mutations
  const { data: productList = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProductsFn(),
  });

  const addProductMut = useMutation({
    mutationFn: (data: Product) => addProductFn({ data }),
    onSuccess: () => queryClient.refetchQueries({ queryKey: ["products"] })
  });

  const updateProductMut = useMutation({
    mutationFn: (data: Product) => updateProductFn({ data }),
    onSuccess: () => queryClient.refetchQueries({ queryKey: ["products"] })
  });

  const deleteProductMut = useMutation({
    mutationFn: (data: string) => deleteProductFn({ data }),
    onSuccess: () => queryClient.refetchQueries({ queryKey: ["products"] })
  });

  // Orders Query/Mutations
  const { data: orderList = [], isLoading: isLoadingOrders } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrdersFn(),
  });

  const addOrderMut = useMutation({
    mutationFn: (data: any) => addOrderFn({ data }),
    onSuccess: () => queryClient.refetchQueries({ queryKey: ["orders"] })
  });

  const updateOrderStatusMut = useMutation({
    mutationFn: (data: { id: string; status: string }) => updateOrderStatusFn({ data }),
    onSuccess: () => queryClient.refetchQueries({ queryKey: ["orders"] })
  });

  // Customers Query/Mutations
  const { data: customerList = [], isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["customers"],
    queryFn: () => getCustomersFn(),
  });

  const addCustomerMut = useMutation({
    mutationFn: (data: any) => addCustomerFn({ data }),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["customers"] });
    }
  });

  // Coupons Query/Mutations
  const { data: couponList = [], isLoading: isLoadingCoupons } = useQuery({
    queryKey: ["coupons"],
    queryFn: () => getCouponsFn(),
  });

  const addCouponMut = useMutation({
    mutationFn: (data: any) => addCouponFn({ data }),
    onSuccess: () => queryClient.refetchQueries({ queryKey: ["coupons"] })
  });

  const deleteCouponMut = useMutation({
    mutationFn: (code: string) => deleteCouponFn({ data: code }),
    onSuccess: () => queryClient.refetchQueries({ queryKey: ["coupons"] })
  });

  // Messages Query/Mutations
  const { data: messageList = [], isLoading: isLoadingMessages } = useQuery({
    queryKey: ["messages"],
    queryFn: () => getMessagesFn(),
  });

  const replyToMessageMut = useMutation({
    mutationFn: (data: { id: string; replyText: string }) => replyToMessageFn({ data }),
    onSuccess: () => queryClient.refetchQueries({ queryKey: ["messages"] })
  });

  // Advertisements Query/Mutations
  const { data: adsList = [] } = useQuery({
    queryKey: ["ads"],
    queryFn: () => getAdsFn(),
  });
  const addAdMut = useMutation({
    mutationFn: (data: any) => addAdFn({ data }),
    onSuccess: () => queryClient.refetchQueries({ queryKey: ["ads"] })
  });
  const updateAdMut = useMutation({
    mutationFn: (data: any) => updateAdFn({ data }),
    onSuccess: () => queryClient.refetchQueries({ queryKey: ["ads"] })
  });
  const deleteAdMut = useMutation({
    mutationFn: (id: number) => deleteAdFn({ data: id }),
    onSuccess: () => queryClient.refetchQueries({ queryKey: ["ads"] })
  });

  // Carousel Query/Mutations
  const { data: slidesList = [] } = useQuery({
    queryKey: ["carousel"],
    queryFn: () => getCarouselFn(),
  });
  const addSlideMut = useMutation({
    mutationFn: (data: any) => addCarouselSlideFn({ data }),
    onSuccess: () => queryClient.refetchQueries({ queryKey: ["carousel"] })
  });
  const updateSlideMut = useMutation({
    mutationFn: (data: any) => updateCarouselSlideFn({ data }),
    onSuccess: () => queryClient.refetchQueries({ queryKey: ["carousel"] })
  });
  const deleteSlideMut = useMutation({
    mutationFn: (id: number) => deleteCarouselSlideFn({ data: id }),
    onSuccess: () => queryClient.refetchQueries({ queryKey: ["carousel"] })
  });

  const { data: brandList = [] } = useQuery({
    queryKey: ["brands"],
    queryFn: () => getBrandsFn(),
  });
  const addBrandMut = useMutation({
    mutationFn: (data: any) => addBrandFn({ data }),
    onSuccess: () => queryClient.refetchQueries({ queryKey: ["brands"] })
  });
  const updateBrandMut = useMutation({
    mutationFn: (data: BrandSpotlight) => updateBrandFn({ data }),
    onSuccess: () => queryClient.refetchQueries({ queryKey: ["brands"] })
  });
  const deleteBrandMut = useMutation({
    mutationFn: (id: number) => deleteBrandFn({ data: id }),
    onSuccess: () => queryClient.refetchQueries({ queryKey: ["brands"] })
  });

  const { data: catBannerList = [] } = useQuery({
    queryKey: ["categoryBanners"],
    queryFn: () => getCategoryBannersFn(),
  });
  const addCatBannerMut = useMutation({
    mutationFn: (data: any) => addCategoryBannerFn({ data }),
    onSuccess: () => queryClient.refetchQueries({ queryKey: ["categoryBanners"] })
  });
  const updateCatBannerMut = useMutation({
    mutationFn: (data: CategoryBanner) => updateCategoryBannerFn({ data }),
    onSuccess: () => queryClient.refetchQueries({ queryKey: ["categoryBanners"] })
  });
  const deleteCatBannerMut = useMutation({
    mutationFn: (id: number) => deleteCategoryBannerFn({ data: id }),
    onSuccess: () => queryClient.refetchQueries({ queryKey: ["categoryBanners"] })
  });

  const [prodSearch, setProdSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [addProdDialogOpen, setAddProdDialogOpen] = useState(false);
  const [newProdForm, setNewProdForm] = useState({
    title: "", price: "", stock: "", category: "electronics", subcategory: "General", brand: "Bazaar", description: "",
    image: "", gallery: ["", "", "", "", ""] as string[], warranty: "1 Year", specs: { Warranty: "1 Year" } as Record<string, string>
  });

  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");
  const [viewingInvoice, setViewingInvoice] = useState<Order | null>(null);
  const [addOrderDialogOpen, setAddOrderDialogOpen] = useState(false);
  const [newOrderForm, setNewOrderForm] = useState({ customer: "", email: "", total: "", status: "Pending" as Order["status"] });

  const [customerSearch, setCustomerSearch] = useState("");
  const [addCustDialogOpen, setAddCustDialogOpen] = useState(false);
  const [newCustForm, setNewCustForm] = useState({ name: "", email: "", phone: "", city: "Dhaka" });

  const [addCouponDialogOpen, setAddCouponDialogOpen] = useState(false);
  const [newCouponForm, setNewCouponForm] = useState({ code: "", desc: "", discount: "" });

  const [replyingMessage, setReplyingMessage] = useState<CustomerMessage | null>(null);
  const [replyInputText, setReplyInputText] = useState("");

  // Advertisements State
  const [addAdDialogOpen, setAddAdDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<any | null>(null);
  const [newAdForm, setNewAdForm] = useState({ title: "", image_url: "", link_url: "#", active: true });

  // Carousel Slides State
  const [addSlideDialogOpen, setAddSlideDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<any | null>(null);
  const [newSlideForm, setNewSlideForm] = useState({ image_url: "", caption: "", sub_caption: "", target_url: "#", position: 0, active: true });

  const [addBrandDialogOpen, setAddBrandDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandSpotlight | null>(null);
  const [newBrandForm, setNewBrandForm] = useState({ name: "", image_url: "", position: 0, active: true });

  // Category Banners State
  const [addCatBannerDialogOpen, setAddCatBannerDialogOpen] = useState(false);
  const [editingCatBanner, setEditingCatBanner] = useState<CategoryBanner | null>(null);
  const [newCatBannerForm, setNewCatBannerForm] = useState({ category_slug: "electronics", image_url: "", title: "", subtitle: "", link_url: "#", position: 0, active: true });
  const [catBannerFilterSlug, setCatBannerFilterSlug] = useState("all");

  const [adminIdInput, setAdminIdInput] = useState(() => (typeof window !== "undefined" ? localStorage.getItem("bazaar_admin_id") || "admin" : "admin"));
  const [adminPassInput, setAdminPassInput] = useState(() => (typeof window !== "undefined" ? localStorage.getItem("bazaar_admin_password") || "admin123" : "admin123"));

  const [storeSettings, setStoreSettings] = useState({
    storeName: "Bazaar Bangladesh",
    supportEmail: "support@bazaar.com.bd",
    contactPhone: "+880 9666 999 000",
    currency: "BDT (৳)",
    commissionRate: "5%"
  });

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem("bazaar_admin_authenticated") === "true");
  }, []);

  const handleLogin = () => {
    localStorage.setItem("bazaar_admin_authenticated", "true");
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("bazaar_admin_authenticated");
    setIsAuthenticated(false);
    toast("Signed out of Admin Panel");
  };

  // Product Actions
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdForm.title || !newProdForm.price) return;
    const newId = String(productList.length + 101).padStart(3, "0");
    const galleryArr = newProdForm.gallery.map((s) => s.trim()).filter(Boolean);
    const finalGallery = galleryArr.length > 0 ? galleryArr : [`https://picsum.photos/seed/newprod-${newId}-1/1000/1000`];

    const finalSpecs: Record<string, string> = {
      ...(newProdForm.specs || {}),
      Warranty: newProdForm.warranty || "1 Year"
    };

    const created: Product = {
      id: newId,
      slug: `${newProdForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${newId}`,
      title: newProdForm.title,
      description: newProdForm.description || "Premium product available on Bazaar Bangladesh.",
      price: Number(newProdForm.price) || 1000,
      originalPrice: Math.round((Number(newProdForm.price) || 1000) * 1.2),
      discount: 15,
      image: newProdForm.image.trim() || `https://picsum.photos/seed/newprod-${newId}/800/800`,
      gallery: finalGallery,
      rating: 5.0,
      reviews: 1,
      sold: 0,
      stock: Number(newProdForm.stock) || 50,
      brand: newProdForm.brand || "Bazaar",
      seller: "Bazaar Official",
      category: newProdForm.category,
      subcategory: newProdForm.subcategory,
      tags: ["new", "featured"],
      specs: finalSpecs,
      badge: "new"
    };

    await addProductMut.mutateAsync(created);
    setAddProdDialogOpen(false);
    setNewProdForm({
      title: "", price: "", stock: "", category: "electronics", subcategory: "General", brand: "Bazaar", description: "",
      image: "", gallery: ["", "", "", "", ""], warranty: "1 Year", specs: { Warranty: "1 Year" }
    });
    toast.success(`Product "${created.title}" created successfully!`);
  };

  const handleSaveEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    let finalSpecs = editingProduct.specs;
    if (typeof finalSpecs === 'string') {
      try {
        finalSpecs = JSON.parse(finalSpecs);
      } catch (err) {
        toast.error("Invalid Specifications JSON format!");
        return;
      }
    }

    const cleanGallery = (Array.isArray(editingProduct.gallery) ? editingProduct.gallery : [])
      .map((s) => String(s).trim())
      .filter(Boolean);

    const finalProduct = { ...editingProduct, specs: finalSpecs, gallery: cleanGallery };
    await updateProductMut.mutateAsync(finalProduct);
    setEditingProduct(null);
    toast.success(`Product "${editingProduct.title}" updated`);
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteProductMut.mutateAsync(id);
    setEditingProduct(null);
    toast.success("Product deleted successfully");
  };

  // Order Actions
  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order["status"]) => {
    await updateOrderStatusMut.mutateAsync({ id: orderId, status: newStatus });
    toast.success(`Order ${orderId} status changed to ${newStatus}`);
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderForm.customer || !newOrderForm.total) return;
    const newId = "BZ" + Math.floor(484000 + Math.random() * 1000);
    const created: Order = {
      id: newId,
      customer: newOrderForm.customer,
      email: newOrderForm.email || "customer@example.com",
      total: Number(newOrderForm.total) || 1500,
      status: newOrderForm.status,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      itemsCount: 1,
      items: [{ title: "Custom Order Item", qty: 1, price: Number(newOrderForm.total) || 1500 }]
    };
    await addOrderMut.mutateAsync(created);
    setAddOrderDialogOpen(false);
    setNewOrderForm({ customer: "", email: "", total: "", status: "Pending" });
    toast.success(`Order ${newId} placed successfully!`);
  };

  // Customer Actions
  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustForm.name) return;
    const newId = `CUST-${Math.floor(100000 + Math.random() * 900000)}`;
    const created: Customer = {
      id: newId,
      name: newCustForm.name,
      email: newCustForm.email || `${newCustForm.name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      phone: newCustForm.phone || "+8801700000000",
      city: newCustForm.city || "Dhaka",
      orders: 0,
      spent: 0
    };
    await addCustomerMut.mutateAsync(created);
    setAddCustDialogOpen(false);
    setNewCustForm({ name: "", email: "", phone: "", city: "Dhaka" });
    toast.success(`Customer "${created.name}" added successfully`);
  };

  // Coupon Actions
  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponForm.code) return;
    const created: Coupon = {
      code: newCouponForm.code.toUpperCase().trim(),
      desc: newCouponForm.desc || "Special promo coupon",
      discount: newCouponForm.discount || "10% OFF",
      uses: 0,
      active: true
    };
    await addCouponMut.mutateAsync(created);
    setAddCouponDialogOpen(false);
    setNewCouponForm({ code: "", desc: "", discount: "" });
    toast.success(`Coupon ${created.code} created`);
  };

  const handleDeleteCoupon = async (code: string) => {
    await deleteCouponMut.mutateAsync(code);
    toast.success(`Coupon ${code} removed`);
  };

  // Message Reply
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingMessage || !replyInputText.trim()) return;
    await replyToMessageMut.mutateAsync({ id: replyingMessage.id, replyText: replyInputText });
    toast.success(`Reply sent to ${replyingMessage.sender}`);
    setReplyingMessage(null);
    setReplyInputText("");
  };

  // CSV Export Report
  const handleExportReport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Order ID,Customer,Total (BDT),Status,Date"]
        .concat(orderList.map((o) => `${o.id},"${o.customer}",${o.total},${o.status},${o.date}`))
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bazaar_sales_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Sales report exported as CSV");
  };

  if (isAuthenticated === null) return null;

  if (!isAuthenticated) {
    return <AdminLoginGatekeeper onLogin={handleLogin} />;
  }

  // Filtered product list
  const filteredProducts = productList.filter((p) =>
    p.title.toLowerCase().includes(prodSearch.toLowerCase()) ||
    p.brand.toLowerCase().includes(prodSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(prodSearch.toLowerCase())
  );

  // Filtered order list
  const filteredOrders = orderList.filter((o) => {
    const matchesSearch = o.customer.toLowerCase().includes(orderSearch.toLowerCase()) || o.id.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === "All" || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered customers list
  const filteredCustomers = customerList.filter((c) =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.city.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const monthlyRevenueData = buildMonthlyRevenueData(orderList, 7);
  const currentMonthStats = monthlyRevenueData.at(-1) ?? { revenue: 0, orders: 0, customers: 0 };
  const previousMonthStats = monthlyRevenueData.at(-2) ?? { revenue: 0, orders: 0, customers: 0 };

  const totalRevenue = orderList.reduce((acc, order) => acc + (Number(order.total) || 0), 0);
  const totalOrders = orderList.length;
  const uniqueOrderCustomers = new Set(orderList.map((o) => (o.email || o.customer || "").toLowerCase()).filter(Boolean)).size;
  const totalCustomers = Math.max(customerList.length, uniqueOrderCustomers);
  const activeProducts = productList.filter((p) => p.stock > 0).length;
  const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const revenueChange = percentChange(currentMonthStats.revenue, previousMonthStats.revenue);
  const ordersChange = percentChange(currentMonthStats.orders, previousMonthStats.orders);
  const customersChange = percentChange(currentMonthStats.customers, previousMonthStats.customers);
  const activeProductsChange = percentChange(activeProducts, productList.length);

  const categorySalesData = categories
    .map((category) => ({
      name: category.name,
      value: productList
        .filter((product) => product.category === category.slug)
        .reduce((sum, product) => sum + (Number(product.sold) || 0), 0),
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const pieCategoryData =
    categorySalesData.length > 0
      ? categorySalesData
      : categories.slice(0, 5).map((category) => ({ name: category.name, value: 1 }));

  const topCustomers = [...customerList].sort((a, b) => b.spent - a.spent).slice(0, 4);
  const deliveredOrders = orderList.filter((order) => order.status === "Delivered").length;
  const deliveredRate = totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0;

  const nav = [
    { v: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { v: "products", label: "Products", icon: Package },
    { v: "orders", label: "Orders", icon: ShoppingCart },
    { v: "customers", label: "Customers", icon: Users },
    { v: "coupons", label: "Coupons", icon: Tag },
    { v: "analytics", label: "Analytics", icon: BarChart3 },
    { v: "reviews", label: "Reviews", icon: Star },
    { v: "messages", label: "Messages", icon: MessageSquare },
    { v: "advertisements", label: "Advertisements", icon: ImageIcon },
    { v: "carousel", label: "Carousel Slider", icon: SlidersHorizontal },
    { v: "brands", label: "Brands", icon: ImageIcon },
    { v: "cat-banners", label: "Category Banners", icon: SlidersHorizontal },
    { v: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6">
      <Tabs defaultValue="dashboard" className="w-full">
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="rounded-2xl border bg-card p-4 h-fit sticky top-32 shadow-soft">
            <div className="mb-4 flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-lg gradient-brand text-white text-sm font-black">A</div>
                <p className="font-black text-base">Admin Portal</p>
              </div>
              <Badge variant="outline" className="text-[10px] bg-success/10 text-success border-success/30 font-semibold">Live</Badge>
            </div>
            <TabsList className="flex-col h-auto w-full bg-transparent p-0 items-stretch space-y-1">
              {nav.map((n) => (
                <TabsTrigger key={n.v} value={n.v} className="justify-start gap-2.5 px-3 py-2.5 rounded-xl font-medium data-[state=active]:bg-brand data-[state=active]:text-white">
                  <n.icon className="h-4 w-4" /> {n.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <Button variant="ghost" onClick={handleLogout} className="mt-6 w-full justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl">
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </aside>

          <div>
            <TabsList className="lg:hidden mb-4 flex-wrap h-auto">
              {nav.map((n) => <TabsTrigger key={n.v} value={n.v}>{n.label}</TabsTrigger>)}
            </TabsList>

            {/* DASHBOARD TAB */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-black">Dashboard Overview</h1>
                  <p className="text-sm text-muted-foreground">Real-time statistics & store operations</p>
                </div>
                <Button className="gap-2 rounded-xl" onClick={handleExportReport}>
                  <ClipboardList className="h-4 w-4" /> Export CSV Report
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Total Revenue", value: formatBDT(totalRevenue), change: revenueChange, up: revenueChange >= 0, icon: DollarSign, color: "bg-brand/10 text-brand" },
                  { label: "Total Orders", value: String(totalOrders), change: ordersChange, up: ordersChange >= 0, icon: ShoppingCart, color: "bg-accent/10 text-accent" },
                  { label: "Total Customers", value: String(totalCustomers), change: customersChange, up: customersChange >= 0, icon: Users, color: "bg-success/10 text-success" },
                  { label: "Active Products", value: String(activeProducts), change: activeProductsChange, up: activeProductsChange >= 0, icon: Boxes, color: "bg-warning/10 text-warning" },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl border bg-card p-5 shadow-soft">
                    <div className="flex items-center justify-between">
                      <div className={cn("grid h-10 w-10 place-items-center rounded-xl", s.color)}><s.icon className="h-5 w-5" /></div>
                      <span className={cn("flex items-center gap-1 text-xs font-semibold", s.up ? "text-success" : "text-destructive")}>
                        {s.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />} {Math.abs(s.change).toFixed(1)}%
                      </span>
                    </div>
                    <p className="mt-4 text-xs font-medium text-muted-foreground uppercase">{s.label}</p>
                    <p className="mt-1 text-2xl font-black">{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-2xl border bg-card p-5 shadow-soft">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold">Revenue Trend</p>
                    <Badge variant="outline">Last 7 months</Badge>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyRevenueData}>
                        <defs>
                          <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2563eb" stopOpacity={0.5} />
                            <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 90%)" />
                        <XAxis dataKey="m" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatBDT(Number(value))} />
                        <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} fill="url(#g1)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-2xl border bg-card p-5 shadow-soft">
                  <p className="font-semibold mb-2">Sales by Category</p>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieCategoryData} dataKey="value" nameKey="name" outerRadius={80} innerRadius={40} paddingAngle={2}>
                          {pieCategoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border bg-card p-5 shadow-soft">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold">Recent Orders</p>
                    <Badge variant="secondary">{orderList.length} total</Badge>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow><TableHead>Order ID</TableHead><TableHead>Customer</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead></TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderList.slice(0, 5).map((o) => (
                        <TableRow key={o.id}>
                          <TableCell className="font-mono text-xs font-bold">{o.id}</TableCell>
                          <TableCell>{o.customer}</TableCell>
                          <TableCell className="font-semibold">{formatBDT(o.total)}</TableCell>
                          <TableCell>
                            <Badge className={o.status === "Delivered" ? "bg-success text-white" : o.status === "Shipped" ? "bg-brand text-white" : "bg-warning text-white"}>
                              {o.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="rounded-2xl border bg-card p-5 shadow-soft">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold">Top Customers</p>
                    <Badge variant="outline">{customerList.length} registered</Badge>
                  </div>
                  <div className="space-y-3">
                    {topCustomers.map((c) => (
                      <div key={c.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors">
                        <div className="grid h-10 w-10 place-items-center rounded-full gradient-brand text-white font-bold">{c.name[0]}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.city} · {c.orders} orders</p>
                        </div>
                        <p className="font-bold text-brand text-sm">{formatBDT(c.spent)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* PRODUCTS TAB */}
            <TabsContent value="products" className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-black">Products Catalogue</h1>
                  <p className="text-sm text-muted-foreground">{filteredProducts.length} items available</p>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search title, brand, category..."
                      value={prodSearch}
                      onChange={(e) => setProdSearch(e.target.value)}
                      className="pl-9 w-64 rounded-xl"
                    />
                  </div>

                  {/* Add Product Modal */}
                  <Dialog open={addProdDialogOpen} onOpenChange={setAddProdDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2 rounded-xl"><Plus className="h-4 w-4" /> Add Product</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg max-h-[90vh] flex flex-col p-6">
                      <DialogHeader>
                        <DialogTitle>Add New Product</DialogTitle>
                        <DialogDescription>Create a new item in Bazaar catalogue</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateProduct} className="flex-1 overflow-y-auto space-y-4 pr-1 py-2">
                        <div>
                          <Label>Product Title</Label>
                          <Input required value={newProdForm.title} onChange={(e) => setNewProdForm({ ...newProdForm, title: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Price (BDT ৳)</Label>
                            <Input type="number" required value={newProdForm.price} onChange={(e) => setNewProdForm({ ...newProdForm, price: e.target.value })} />
                          </div>
                          <div>
                            <Label>Stock Quantity</Label>
                            <Input type="number" required value={newProdForm.stock} onChange={(e) => setNewProdForm({ ...newProdForm, stock: e.target.value })} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Category</Label>
                            <Select value={newProdForm.category} onValueChange={(val) => setNewProdForm({ ...newProdForm, category: val })}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {categories.map((c) => (
                                  <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Brand</Label>
                            <Input value={newProdForm.brand} onChange={(e) => setNewProdForm({ ...newProdForm, brand: e.target.value })} />
                          </div>
                        </div>

                        {/* Image Links & Warranty */}
                        <div className="space-y-3 pt-2 border-t">
                          <div>
                            <Label>Main Image URL</Label>
                            <div className="flex gap-2 items-center">
                              <Input
                                value={newProdForm.image}
                                onChange={(e) => setNewProdForm({ ...newProdForm, image: e.target.value })}
                                className="flex-1"
                              />
                              {newProdForm.image && (
                                <img src={newProdForm.image} alt="Preview" className="h-9 w-9 rounded object-cover border shrink-0" onError={(e) => (e.currentTarget.style.display = 'none')} />
                              )}
                            </div>
                          </div>

                          <div>
                            <Label>Additional Gallery Images (up to {MAX_GALLERY_IMAGES})</Label>
                            <div className="space-y-2">
                              {newProdForm.gallery.map((url, i) => (
                                <div key={i} className="flex gap-2 items-center">
                                  <Input
                                    placeholder={`Image ${i + 1} URL`}
                                    value={url}
                                    onChange={(e) => {
                                      const gallery = [...newProdForm.gallery];
                                      gallery[i] = e.target.value;
                                      setNewProdForm({ ...newProdForm, gallery });
                                    }}
                                    className="flex-1"
                                  />
                                  {url && (
                                    <img src={url} alt={`Preview ${i + 1}`} className="h-9 w-9 rounded object-cover border shrink-0" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <Label>Warranty Period</Label>
                            <Input
                              value={newProdForm.warranty}
                              onChange={(e) => setNewProdForm({ ...newProdForm, warranty: e.target.value })}
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Description</Label>
                          <Textarea value={newProdForm.description} onChange={(e) => setNewProdForm({ ...newProdForm, description: e.target.value })} rows={3} />
                        </div>

                        {/* Custom Dynamic Specifications */}
                        <div className="space-y-2 pt-2 border-t">
                          <div className="flex items-center justify-between">
                            <Label className="font-semibold">Dynamic Specifications</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const currentSpecs = { ...newProdForm.specs };
                                currentSpecs[`Feature ${Object.keys(currentSpecs).length + 1}`] = "";
                                setNewProdForm({ ...newProdForm, specs: currentSpecs });
                              }}
                            >
                              + Add Specification
                            </Button>
                          </div>

                          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                            {Object.entries(newProdForm.specs || {}).map(([k, v], idx) => (
                              <div key={idx} className="flex gap-2 items-center">
                                <Input
                                  placeholder="Spec Name (e.g. Color)"
                                  value={k}
                                  className="flex-1 text-xs"
                                  onChange={(e) => {
                                    const newKey = e.target.value;
                                    const newSpecs: Record<string, string> = {};
                                    Object.entries(newProdForm.specs || {}).forEach(([oldK, oldV], i) => {
                                      if (i === idx) newSpecs[newKey] = oldV;
                                      else newSpecs[oldK] = oldV;
                                    });
                                    setNewProdForm({ ...newProdForm, specs: newSpecs });
                                  }}
                                />
                                <Input
                                  placeholder="Value (e.g. Midnight Blue)"
                                  value={v}
                                  className="flex-1 text-xs"
                                  onChange={(e) => {
                                    const newVal = e.target.value;
                                    const newSpecs: Record<string, string> = {};
                                    Object.entries(newProdForm.specs || {}).forEach(([oldK, oldV], i) => {
                                      if (i === idx) newSpecs[oldK] = newVal;
                                      else newSpecs[oldK] = oldV;
                                    });
                                    setNewProdForm({ ...newProdForm, specs: newSpecs });
                                  }}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive h-8 w-8 p-0 shrink-0"
                                  onClick={() => {
                                    const newSpecs: Record<string, string> = {};
                                    Object.entries(newProdForm.specs || {}).forEach(([oldK, oldV], i) => {
                                      if (i !== idx) newSpecs[oldK] = oldV;
                                    });
                                    setNewProdForm({ ...newProdForm, specs: newSpecs });
                                  }}
                                >
                                  ✕
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <DialogFooter className="sticky bottom-0 bg-background pt-3 border-t flex justify-end gap-2 z-10">
                          <Button type="button" variant="outline" onClick={() => setAddProdDialogOpen(false)}>Cancel</Button>
                          <Button type="submit" className="bg-primary text-primary-foreground font-bold">Create Product</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="rounded-2xl border bg-card overflow-x-auto shadow-soft">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Sold</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover border" />
                            <div className="min-w-0 max-w-[240px]">
                              <p className="font-semibold text-sm truncate">{p.title}</p>
                              <p className="text-xs text-muted-foreground">{p.brand}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="outline" className="capitalize">{p.category}</Badge></TableCell>
                        <TableCell className="font-bold text-brand">{formatBDT(p.price)}</TableCell>
                        <TableCell>
                          <Badge className={p.stock > 50 ? "bg-success text-white" : p.stock > 10 ? "bg-warning text-white" : "bg-destructive text-white"}>
                            {p.stock} units
                          </Badge>
                        </TableCell>
                        <TableCell>{p.sold.toLocaleString()}</TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1 font-semibold text-sm">
                            <Star className="h-3.5 w-3.5 fill-warning text-warning" /> {p.rating}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button size="sm" variant="ghost" onClick={() => setEditingProduct(p)} aria-label="Edit">
                              <Edit className="h-4 w-4 text-brand" /> Edit
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteProduct(p.id)} className="text-destructive hover:text-destructive" aria-label="Delete">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Edit Product Modal */}
              {editingProduct && (
                <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
                  <DialogContent className="max-w-lg max-h-[90vh] flex flex-col p-6">
                    <DialogHeader>
                      <DialogTitle>Edit Product #{editingProduct.id}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSaveEditProduct} className="flex-1 overflow-y-auto space-y-4 pr-1 py-2">
                      <div>
                        <Label>Title</Label>
                        <Input value={editingProduct.title} onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })} />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Price (BDT ৳)</Label>
                          <Input type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })} />
                        </div>
                        <div>
                          <Label>Original Price (BDT ৳)</Label>
                          <Input type="number" value={editingProduct.originalPrice || 0} onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Discount (%)</Label>
                          <Input type="number" value={editingProduct.discount || 0} onChange={(e) => setEditingProduct({ ...editingProduct, discount: Number(e.target.value) })} />
                        </div>
                        <div>
                          <Label>Stock</Label>
                          <Input type="number" value={editingProduct.stock} onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Brand</Label>
                          <Input value={editingProduct.brand} onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })} />
                        </div>
                        <div>
                          <Label>Category</Label>
                          <Select value={editingProduct.category} onValueChange={(val) => setEditingProduct({ ...editingProduct, category: val })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {categories.map((c) => (
                                <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Image Links & Gallery */}
                      <div className="space-y-3 pt-2 border-t">
                        <div>
                          <Label>Main Image URL</Label>
                          <div className="flex gap-2 items-center">
                            <Input
                              value={editingProduct.image}
                              onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                              className="flex-1"
                            />
                            {editingProduct.image && (
                              <img src={editingProduct.image} alt="Preview" className="h-9 w-9 rounded object-cover border shrink-0" onError={(e) => (e.currentTarget.style.display = 'none')} />
                            )}
                          </div>
                        </div>

                        <div>
                          <Label>Additional Gallery Images (up to {MAX_GALLERY_IMAGES})</Label>
                          <div className="space-y-2">
                            {Array.from({ length: MAX_GALLERY_IMAGES }, (_, i) => editingProduct.gallery?.[i] ?? "").map((url, i) => (
                              <div key={i} className="flex gap-2 items-center">
                                <Input
                                  placeholder={`Image ${i + 1} URL`}
                                  value={url}
                                  onChange={(e) => {
                                    const gallery = Array.from({ length: MAX_GALLERY_IMAGES }, (_, j) => editingProduct.gallery?.[j] ?? "");
                                    gallery[i] = e.target.value;
                                    setEditingProduct({ ...editingProduct, gallery });
                                  }}
                                  className="flex-1"
                                />
                                {url && (
                                  <img src={url} alt={`Preview ${i + 1}`} className="h-9 w-9 rounded object-cover border shrink-0" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Subcategory</Label>
                          <Input value={editingProduct.subcategory || ""} onChange={(e) => setEditingProduct({ ...editingProduct, subcategory: e.target.value })} />
                        </div>
                        <div>
                          <Label>Badge</Label>
                          <Select
                            value={editingProduct.badge || "none"}
                            onValueChange={(val) => setEditingProduct({ ...editingProduct, badge: val === "none" ? undefined : (val as any) })}
                          >
                            <SelectTrigger><SelectValue placeholder="Select badge" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="flash">⚡ Flash</SelectItem>
                              <SelectItem value="new">✨ New</SelectItem>
                              <SelectItem value="trending">🔥 Trending</SelectItem>
                              <SelectItem value="bestseller">🏆 Bestseller</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label>Description</Label>
                        <Textarea value={editingProduct.description || ""} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} rows={3} />
                      </div>

                      {/* User-friendly Product Specifications */}
                      <div className="space-y-2 pt-2 border-t">
                        <div className="flex items-center justify-between">
                          <Label className="font-semibold">Specifications</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const currentSpecs = typeof editingProduct.specs === 'object' && editingProduct.specs ? { ...editingProduct.specs } : {};
                              currentSpecs[`Feature ${Object.keys(currentSpecs).length + 1}`] = "";
                              setEditingProduct({ ...editingProduct, specs: currentSpecs });
                            }}
                          >
                            + Add Specification
                          </Button>
                        </div>

                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {(() => {
                            const specObj = typeof editingProduct.specs === 'object' && editingProduct.specs ? editingProduct.specs : {};
                            const specEntries = Object.entries(specObj);

                            if (specEntries.length === 0) {
                              return <p className="text-xs text-muted-foreground italic">No specifications added yet.</p>;
                            }

                            return specEntries.map(([k, v], idx) => (
                              <div key={idx} className="flex gap-2 items-center">
                                <Input
                                  placeholder="Spec Name (e.g. Warranty)"
                                  value={k}
                                  className="flex-1 text-xs"
                                  onChange={(e) => {
                                    const newKey = e.target.value;
                                    const newSpecs: Record<string, any> = {};
                                    specEntries.forEach(([oldK, oldV], i) => {
                                      if (i === idx) newSpecs[newKey] = oldV;
                                      else newSpecs[oldK] = oldV;
                                    });
                                    setEditingProduct({ ...editingProduct, specs: newSpecs });
                                  }}
                                />
                                <Input
                                  placeholder="Value (e.g. 1 Year)"
                                  value={String(v)}
                                  className="flex-1 text-xs"
                                  onChange={(e) => {
                                    const newVal = e.target.value;
                                    const newSpecs: Record<string, any> = {};
                                    specEntries.forEach(([oldK, oldV], i) => {
                                      if (i === idx) newSpecs[oldK] = newVal;
                                      else newSpecs[oldK] = oldV;
                                    });
                                    setEditingProduct({ ...editingProduct, specs: newSpecs });
                                  }}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive h-8 w-8 p-0 shrink-0"
                                  onClick={() => {
                                    const newSpecs: Record<string, any> = {};
                                    specEntries.forEach(([oldK, oldV], i) => {
                                      if (i !== idx) newSpecs[oldK] = oldV;
                                    });
                                    setEditingProduct({ ...editingProduct, specs: newSpecs });
                                  }}
                                >
                                  ✕
                                </Button>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>

                      <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t flex justify-between items-center sm:justify-between z-10">
                        <Button type="button" variant="destructive" onClick={() => handleDeleteProduct(editingProduct.id)}>Delete</Button>
                        <div className="flex gap-2">
                          <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>Cancel</Button>
                          <Button type="submit" className="bg-primary text-primary-foreground font-bold">Save Changes</Button>
                        </div>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </TabsContent>

            {/* ORDERS TAB */}
            <TabsContent value="orders" className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-black">Orders Management</h1>
                  <p className="text-sm text-muted-foreground">{filteredOrders.length} orders shown</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search Customer or Order ID..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="pl-9 w-60 rounded-xl"
                    />
                  </div>
                  <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                    <SelectTrigger className="w-36 rounded-xl"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Statuses</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Packed">Packed</SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Add Order Modal */}
                  <Dialog open={addOrderDialogOpen} onOpenChange={setAddOrderDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2 rounded-xl"><Plus className="h-4 w-4" /> Create Order</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Create New Order</DialogTitle>
                        <DialogDescription>Manually record a customer order</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateOrder} className="space-y-4 py-2">
                        <div>
                          <Label>Customer Name</Label>
                          <Input required value={newOrderForm.customer} onChange={(e) => setNewOrderForm({ ...newOrderForm, customer: e.target.value })} placeholder="Farhan Ahmed" />
                        </div>
                        <div>
                          <Label>Customer Email</Label>
                          <Input type="email" value={newOrderForm.email} onChange={(e) => setNewOrderForm({ ...newOrderForm, email: e.target.value })} placeholder="farhan@example.com" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Total Amount (BDT ৳)</Label>
                            <Input type="number" required value={newOrderForm.total} onChange={(e) => setNewOrderForm({ ...newOrderForm, total: e.target.value })} placeholder="3500" />
                          </div>
                          <div>
                            <Label>Initial Status</Label>
                            <Select value={newOrderForm.status} onValueChange={(val) => setNewOrderForm({ ...newOrderForm, status: val as Order["status"] })}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Packed">Packed</SelectItem>
                                <SelectItem value="Shipped">Shipped</SelectItem>
                                <SelectItem value="Delivered">Delivered</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setAddOrderDialogOpen(false)}>Cancel</Button>
                          <Button type="submit">Place Order</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="rounded-2xl border bg-card overflow-x-auto shadow-soft">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status Action</TableHead>
                      <TableHead className="text-right">Invoice</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="font-mono text-xs font-bold">{o.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold text-sm">{o.customer}</p>
                            <p className="text-xs text-muted-foreground">{o.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{o.date}</TableCell>
                        <TableCell>{o.itemsCount} item{o.itemsCount > 1 && "s"}</TableCell>
                        <TableCell className="font-bold text-brand">{formatBDT(o.total)}</TableCell>
                        <TableCell>
                          <Select value={o.status} onValueChange={(val) => handleUpdateOrderStatus(o.id, val as Order["status"])}>
                            <SelectTrigger className="h-8 w-32 rounded-lg text-xs font-semibold">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Packed">Packed</SelectItem>
                              <SelectItem value="Shipped">Shipped</SelectItem>
                              <SelectItem value="Delivered">Delivered</SelectItem>
                              <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" className="rounded-lg gap-1" onClick={() => setViewingInvoice(o)}>
                            <FileText className="h-3.5 w-3.5" /> Invoice
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Invoice Modal */}
              {viewingInvoice && (
                <Dialog open={!!viewingInvoice} onOpenChange={(open) => !open && setViewingInvoice(null)}>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex justify-between items-center">
                        <span>Invoice #{viewingInvoice.id}</span>
                        <Badge>{viewingInvoice.status}</Badge>
                      </DialogTitle>
                      <DialogDescription>Customer: {viewingInvoice.customer} ({viewingInvoice.email})</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 py-2 border-y my-2 text-sm">
                      <p className="font-semibold text-xs uppercase text-muted-foreground">Order Items:</p>
                      {viewingInvoice.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-xs">{item.title}</p>
                            <p className="text-[10px] text-muted-foreground">Qty: {item.qty}</p>
                          </div>
                          <span className="font-bold text-xs">{formatBDT(item.price * item.qty)}</span>
                        </div>
                      ))}
                      <div className="border-t pt-2 flex justify-between font-bold text-base">
                        <span>Total Paid</span>
                        <span className="text-brand">{formatBDT(viewingInvoice.total)}</span>
                      </div>
                    </div>
                    <DialogFooter className="flex justify-between sm:justify-between">
                      <Button variant="outline" size="sm" onClick={() => { window.print(); }}>
                        <Printer className="h-4 w-4 mr-1" /> Print
                      </Button>
                      <Button size="sm" onClick={() => setViewingInvoice(null)}>Close</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </TabsContent>

            {/* CUSTOMERS TAB */}
            <TabsContent value="customers" className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-black">Customer Accounts</h1>
                  <p className="text-sm text-muted-foreground">{filteredCustomers.length} registered shoppers</p>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search customer name or city..."
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      className="pl-9 w-60 rounded-xl"
                    />
                  </div>

                  <Dialog open={addCustDialogOpen} onOpenChange={setAddCustDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2 rounded-xl"><Plus className="h-4 w-4" /> Add Customer</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add Customer</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleAddCustomer} className="space-y-3 py-2">
                        <div><Label>Full Name</Label><Input required value={newCustForm.name} onChange={(e) => setNewCustForm({ ...newCustForm, name: e.target.value })} placeholder="Kazi Musfiq" /></div>
                        <div><Label>Email</Label><Input type="email" value={newCustForm.email} onChange={(e) => setNewCustForm({ ...newCustForm, email: e.target.value })} placeholder="kazi@example.com" /></div>
                        <div className="grid grid-cols-2 gap-3">
                          <div><Label>Phone</Label><Input value={newCustForm.phone} onChange={(e) => setNewCustForm({ ...newCustForm, phone: e.target.value })} placeholder="+8801700000000" /></div>
                          <div><Label>City</Label><Input value={newCustForm.city} onChange={(e) => setNewCustForm({ ...newCustForm, city: e.target.value })} placeholder="Dhaka" /></div>
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setAddCustDialogOpen(false)}>Cancel</Button>
                          <Button type="submit">Save Customer</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {filteredCustomers.map((c) => (
                  <div key={c.id} className="rounded-2xl border bg-card p-5 shadow-soft space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-full gradient-brand text-white font-black text-lg">{c.name[0]}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-base truncate">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.city} · {c.phone}</p>
                      </div>
                    </div>
                    <div className="border-t pt-3 flex justify-between text-xs">
                      <div><p className="text-muted-foreground">Orders</p><p className="font-bold text-sm">{c.orders}</p></div>
                      <div className="text-right"><p className="text-muted-foreground">Total Spent</p><p className="font-bold text-sm text-brand">{formatBDT(c.spent)}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* COUPONS TAB */}
            <TabsContent value="coupons" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black">Coupons & Promos</h1>
                  <p className="text-sm text-muted-foreground">Active promotional discount codes</p>
                </div>
                <Dialog open={addCouponDialogOpen} onOpenChange={setAddCouponDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 rounded-xl"><Plus className="h-4 w-4" /> Create Coupon</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader><DialogTitle>New Coupon</DialogTitle></DialogHeader>
                    <form onSubmit={handleAddCoupon} className="space-y-3 py-2">
                      <div><Label>Coupon Code</Label><Input required value={newCouponForm.code} onChange={(e) => setNewCouponForm({ ...newCouponForm, code: e.target.value })} placeholder="EID2026" /></div>
                      <div><Label>Discount Label</Label><Input value={newCouponForm.discount} onChange={(e) => setNewCouponForm({ ...newCouponForm, discount: e.target.value })} placeholder="20% OFF" /></div>
                      <div><Label>Description</Label><Input value={newCouponForm.desc} onChange={(e) => setNewCouponForm({ ...newCouponForm, desc: e.target.value })} placeholder="20% off on all fashion items" /></div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setAddCouponDialogOpen(false)}>Cancel</Button>
                        <Button type="submit">Add Coupon</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {couponList.map((c) => (
                  <div key={c.code} className="relative rounded-2xl border-2 border-dashed border-brand/40 bg-brand/5 p-5 shadow-soft flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-2xl font-black text-brand tracking-wider">{c.code}</span>
                        <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => handleDeleteCoupon(c.code)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="mt-2 text-sm font-medium">{c.desc}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-brand/20 flex justify-between items-center text-xs text-muted-foreground">
                      <span>{c.uses.toLocaleString()} redemptions</span>
                      <Badge className="bg-brand text-white">{c.discount}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* ANALYTICS TAB */}
            <TabsContent value="analytics" className="space-y-4">
              <h1 className="text-2xl font-black">Store Analytics & Performance</h1>
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border bg-card p-6 shadow-soft space-y-2">
                  <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground">Delivered Rate</p>
                  <p className="text-4xl font-black">{deliveredRate.toFixed(2)}% <span className={cn("text-sm font-bold", ordersChange >= 0 ? "text-success" : "text-destructive")}>{ordersChange >= 0 ? "+" : ""}{ordersChange.toFixed(1)}% vs previous month</span></p>
                  <p className="text-xs text-muted-foreground pt-1">Share of orders that reached delivered status.</p>
                </div>
                <div className="rounded-2xl border bg-card p-6 shadow-soft space-y-2">
                  <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground">Average Order Value (AOV)</p>
                  <p className="text-4xl font-black">{formatBDT(Math.round(aov))} <span className={cn("text-sm font-bold", revenueChange >= 0 ? "text-success" : "text-destructive")}>{revenueChange >= 0 ? "+" : ""}{revenueChange.toFixed(1)}% vs previous month</span></p>
                  <p className="text-xs text-muted-foreground pt-1">Calculated from live order totals and order count.</p>
                </div>
              </div>

              <div className="rounded-2xl border bg-card p-5 shadow-soft space-y-3">
                <p className="font-semibold">Monthly Orders Growth</p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 90%)" />
                      <XAxis dataKey="m" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="orders" fill="#2563eb" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>

            {/* REVIEWS TAB */}
            <TabsContent value="reviews" className="space-y-4">
              <h1 className="text-2xl font-black">Product Reviews & Feedback</h1>
              <div className="space-y-3">
                {productList.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex gap-4 rounded-2xl border bg-card p-4 shadow-soft">
                    <img src={p.image} alt="" className="h-14 w-14 rounded-xl object-cover border" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm line-clamp-1">{p.title}</p>
                      <div className="flex items-center gap-1 my-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-warning text-warning" />
                        ))}
                        <span className="text-xs font-bold ml-1">{p.rating}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">"Authentic product, fast delivery to Dhaka. High quality packaging."</p>
                    </div>
                    <Button size="sm" variant="outline" className="h-8 text-xs self-center" onClick={() => toast.success("Review verified")}>Verify</Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* MESSAGES TAB */}
            <TabsContent value="messages" className="space-y-4">
              <h1 className="text-2xl font-black">Customer Messages</h1>
              <div className="space-y-3">
                {messageList.map((m) => (
                  <div key={m.id} className="rounded-2xl border bg-card p-5 shadow-soft space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-base">{m.subject}</p>
                        <p className="text-xs text-muted-foreground">From: {m.sender} ({m.email}) · {m.date}</p>
                      </div>
                      <Badge className={m.replied ? "bg-success text-white" : "bg-warning text-white"}>
                        {m.replied ? "Replied" : "Pending"}
                      </Badge>
                    </div>
                    <p className="text-sm bg-muted/40 p-3 rounded-xl">{m.message}</p>

                    {m.replied && m.replyText && (
                      <div className="bg-brand/10 p-3 rounded-xl border border-brand/20 text-xs space-y-1">
                        <p className="font-bold text-brand">Admin Reply:</p>
                        <p>{m.replyText}</p>
                      </div>
                    )}

                    {!m.replied && (
                      <Button size="sm" className="gap-1 rounded-lg" onClick={() => setReplyingMessage(m)}>
                        <Send className="h-3.5 w-3.5" /> Reply to Customer
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Reply Modal */}
              {replyingMessage && (
                <Dialog open={!!replyingMessage} onOpenChange={(open) => !open && setReplyingMessage(null)}>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Reply to {replyingMessage.sender}</DialogTitle>
                      <DialogDescription>Subject: {replyingMessage.subject}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSendReply} className="space-y-3 py-2">
                      <div>
                        <Label>Message Reply</Label>
                        <Textarea required value={replyInputText} onChange={(e) => setReplyInputText(e.target.value)} placeholder="Write your response to the customer..." rows={4} />
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setReplyingMessage(null)}>Cancel</Button>
                        <Button type="submit">Send Response</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </TabsContent>

            {/* SETTINGS TAB */}
            <TabsContent value="settings" className="space-y-6">
              <h1 className="text-2xl font-black">Store & Security Configuration</h1>

              {/* Admin Credentials Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!adminIdInput.trim() || !adminPassInput) {
                    toast.error("Admin ID and Password cannot be empty");
                    return;
                  }
                  localStorage.setItem("bazaar_admin_id", adminIdInput.trim());
                  localStorage.setItem("bazaar_admin_password", adminPassInput);
                  toast.success("Admin ID and Password updated successfully! Only new credentials will work.");
                }}
                className="rounded-2xl border bg-card p-6 shadow-soft space-y-4 max-w-2xl"
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-brand" />
                  <h2 className="text-lg font-bold">Admin Login Credentials</h2>
                </div>
                <p className="text-xs text-muted-foreground">Change your Admin ID and Password used to access this Admin Portal.</p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Admin ID</Label>
                    <Input
                      value={adminIdInput}
                      onChange={(e) => setAdminIdInput(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Admin Password</Label>
                    <Input
                      type="text"
                      value={adminPassInput}
                      onChange={(e) => setAdminPassInput(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
                <Button type="submit" size="lg" className="rounded-xl">Update Admin Credentials</Button>
              </form>

              {/* Store Configuration */}
              <form onSubmit={(e) => { e.preventDefault(); toast.success("Store settings updated successfully"); }} className="rounded-2xl border bg-card p-6 shadow-soft space-y-4 max-w-2xl">
                <h2 className="text-lg font-bold">Store Details</h2>
                <div>
                  <Label>Store Name</Label>
                  <Input value={storeSettings.storeName} onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })} className="mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Support Email</Label>
                    <Input value={storeSettings.supportEmail} onChange={(e) => setStoreSettings({ ...storeSettings, supportEmail: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label>Contact Phone</Label>
                    <Input value={storeSettings.contactPhone} onChange={(e) => setStoreSettings({ ...storeSettings, contactPhone: e.target.value })} className="mt-1" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Default Currency</Label>
                    <Input value={storeSettings.currency} onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label>Admin Commission Rate</Label>
                    <Input value={storeSettings.commissionRate} onChange={(e) => setStoreSettings({ ...storeSettings, commissionRate: e.target.value })} className="mt-1" />
                  </div>
                </div>
                <Button type="submit" size="lg" className="rounded-xl">Save Store Settings</Button>
              </form>
            </TabsContent>

            {/* ADVERTISEMENTS TAB */}
            <TabsContent value="advertisements" className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-black">Advertisements</h1>
                  <p className="text-sm text-muted-foreground">{adsList.length} advertisement{adsList.length !== 1 ? "s" : ""} configured</p>
                </div>
                <Dialog open={addAdDialogOpen} onOpenChange={setAddAdDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 rounded-xl"><Plus className="h-4 w-4" /> Add Advertisement</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Add Advertisement</DialogTitle>
                      <DialogDescription>Create a new promotional advertisement banner</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      if (!newAdForm.title || !newAdForm.image_url) return;
                      await addAdMut.mutateAsync(newAdForm);
                      setAddAdDialogOpen(false);
                      setNewAdForm({ title: "", image_url: "", link_url: "#", active: true });
                      toast.success("Advertisement created!");
                    }} className="space-y-4 pt-2">
                      <div>
                        <Label>Ad Title</Label>
                        <Input required value={newAdForm.title} onChange={(e) => setNewAdForm({ ...newAdForm, title: e.target.value })} className="mt-1" />
                      </div>
                      <div>
                        <Label>Image URL</Label>
                        <div className="flex gap-2 items-center mt-1">
                          <Input required value={newAdForm.image_url} onChange={(e) => setNewAdForm({ ...newAdForm, image_url: e.target.value })} className="flex-1" />
                          {newAdForm.image_url && <img src={newAdForm.image_url} alt="preview" className="h-9 w-14 object-cover rounded border shrink-0" onError={(e) => (e.currentTarget.style.display = 'none')} />}
                        </div>
                      </div>
                      <div>
                        <Label>Target Link URL</Label>
                        <Input value={newAdForm.link_url} onChange={(e) => setNewAdForm({ ...newAdForm, link_url: e.target.value })} className="mt-1" />
                      </div>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => setNewAdForm({ ...newAdForm, active: !newAdForm.active })} className="text-brand">
                          {newAdForm.active ? <ToggleRight className="h-7 w-7" /> : <ToggleLeft className="h-7 w-7 text-muted-foreground" />}
                        </button>
                        <Label>{newAdForm.active ? "Active (visible on site)" : "Inactive (hidden)"}</Label>
                      </div>
                      <DialogFooter>
                        <Button type="submit" className="rounded-xl">Create Advertisement</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {adsList.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed bg-muted/20 p-16 text-center">
                  <ImageIcon className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="font-semibold text-muted-foreground">No advertisements yet</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Add your first ad banner to display promotions on the homepage</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {adsList.map((ad: any) => (
                    <div key={ad.id} className={cn("rounded-2xl border bg-card shadow-soft overflow-hidden", !ad.active && "opacity-60")}>
                      <div className="relative">
                        <img src={ad.image_url} alt={ad.title} className="w-full h-40 object-cover" onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/ad-${ad.id}/800/400`; }} />
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Badge className={ad.active ? "bg-success text-white" : "bg-muted text-muted-foreground"}>{ad.active ? "Active" : "Inactive"}</Badge>
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        <p className="font-bold">{ad.title}</p>
                        <a href={ad.link_url} target="_blank" rel="noreferrer" className="text-xs text-brand flex items-center gap-1 hover:underline">
                          <ExternalLink className="h-3 w-3" /> {ad.link_url}
                        </a>
                        <div className="flex gap-2 pt-1">
                          <Dialog open={editingAd?.id === ad.id} onOpenChange={(o) => { if (!o) setEditingAd(null); }}>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="gap-1 rounded-lg" onClick={() => setEditingAd({ ...ad })}>
                                <Edit className="h-3 w-3" /> Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                              <DialogHeader><DialogTitle>Edit Advertisement</DialogTitle></DialogHeader>
                              {editingAd && (
                                <form onSubmit={async (e) => {
                                  e.preventDefault();
                                  await updateAdMut.mutateAsync(editingAd);
                                  setEditingAd(null);
                                  toast.success("Advertisement updated!");
                                }} className="space-y-4 pt-2">
                                  <div>
                                    <Label>Ad Title</Label>
                                    <Input required value={editingAd.title} onChange={(e) => setEditingAd({ ...editingAd, title: e.target.value })} className="mt-1" />
                                  </div>
                                  <div>
                                    <Label>Image URL</Label>
                                    <div className="flex gap-2 items-center mt-1">
                                      <Input required value={editingAd.image_url} onChange={(e) => setEditingAd({ ...editingAd, image_url: e.target.value })} className="flex-1" />
                                      {editingAd.image_url && <img src={editingAd.image_url} alt="preview" className="h-9 w-14 object-cover rounded border shrink-0" onError={(e) => (e.currentTarget.style.display = 'none')} />}
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Target Link URL</Label>
                                    <Input value={editingAd.link_url} onChange={(e) => setEditingAd({ ...editingAd, link_url: e.target.value })} className="mt-1" />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button type="button" onClick={() => setEditingAd({ ...editingAd, active: !editingAd.active })} className="text-brand">
                                      {editingAd.active ? <ToggleRight className="h-7 w-7" /> : <ToggleLeft className="h-7 w-7 text-muted-foreground" />}
                                    </button>
                                    <Label>{editingAd.active ? "Active" : "Inactive"}</Label>
                                  </div>
                                  <DialogFooter>
                                    <Button type="submit" className="rounded-xl">Save Changes</Button>
                                  </DialogFooter>
                                </form>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button size="sm" variant="ghost" className="gap-1 rounded-lg text-destructive hover:bg-destructive/10"
                            onClick={async () => { await deleteAdMut.mutateAsync(Number(ad.id)); toast.success("Advertisement deleted"); }}>
                            <Trash2 className="h-3 w-3" /> Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* CAROUSEL SLIDER TAB */}
            <TabsContent value="carousel" className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-black">Carousel Slider</h1>
                  <p className="text-sm text-muted-foreground">{slidesList.length} slide{slidesList.length !== 1 ? "s" : ""} — displayed on homepage in order</p>
                </div>
                <Dialog open={addSlideDialogOpen} onOpenChange={setAddSlideDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 rounded-xl" disabled={slidesList.length >= 5}>
                      <Plus className="h-4 w-4" /> Add Slide {slidesList.length >= 5 && "(max 5)"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Add Carousel Slide</DialogTitle>
                      <DialogDescription>Max 5 slides. Only active slides are shown on the homepage.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      if (!newSlideForm.image_url) return;
                      await addSlideMut.mutateAsync({ ...newSlideForm, position: slidesList.length });
                      setAddSlideDialogOpen(false);
                      setNewSlideForm({ image_url: "", caption: "", sub_caption: "", target_url: "#", position: 0, active: true });
                      toast.success("Carousel slide added!");
                    }} className="space-y-4 pt-2">
                      <div>
                        <Label>Slide Image URL</Label>
                        <div className="flex gap-2 items-center mt-1">
                          <Input required value={newSlideForm.image_url} onChange={(e) => setNewSlideForm({ ...newSlideForm, image_url: e.target.value })} className="flex-1" />
                          {newSlideForm.image_url && <img src={newSlideForm.image_url} alt="preview" className="h-9 w-14 object-cover rounded border shrink-0" onError={(e) => (e.currentTarget.style.display = 'none')} />}
                        </div>
                      </div>
                      <div>
                        <Label>Heading / Caption</Label>
                        <Input value={newSlideForm.caption} onChange={(e) => setNewSlideForm({ ...newSlideForm, caption: e.target.value })} className="mt-1" />
                      </div>
                      <div>
                        <Label>Sub-caption</Label>
                        <Input value={newSlideForm.sub_caption} onChange={(e) => setNewSlideForm({ ...newSlideForm, sub_caption: e.target.value })} className="mt-1" />
                      </div>
                      <div>
                        <Label>Target URL (CTA link)</Label>
                        <Input value={newSlideForm.target_url} onChange={(e) => setNewSlideForm({ ...newSlideForm, target_url: e.target.value })} className="mt-1" />
                      </div>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => setNewSlideForm({ ...newSlideForm, active: !newSlideForm.active })} className="text-brand">
                          {newSlideForm.active ? <ToggleRight className="h-7 w-7" /> : <ToggleLeft className="h-7 w-7 text-muted-foreground" />}
                        </button>
                        <Label>{newSlideForm.active ? "Active (visible)" : "Inactive (hidden)"}</Label>
                      </div>
                      <DialogFooter>
                        <Button type="submit" className="rounded-xl">Add Slide</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {slidesList.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed bg-muted/20 p-16 text-center">
                  <SlidersHorizontal className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="font-semibold text-muted-foreground">No slides yet</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Add up to 5 carousel slides to display on the homepage hero section</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {slidesList.map((slide: any, idx: number) => (
                    <div key={slide.id} className={cn("rounded-2xl border bg-card shadow-soft overflow-hidden flex gap-4 p-4", !slide.active && "opacity-60")}>
                      <img src={slide.image_url} alt={slide.caption || "Slide"} className="w-28 h-20 object-cover rounded-xl shrink-0 border" onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/slide-${slide.id}/400/300`; }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs font-bold">#{idx + 1}</Badge>
                          <Badge className={slide.active ? "bg-success text-white text-xs" : "bg-muted text-muted-foreground text-xs"}>{slide.active ? "Active" : "Inactive"}</Badge>
                        </div>
                        <p className="font-bold mt-1 truncate">{slide.caption || "(No caption)"}</p>
                        <p className="text-xs text-muted-foreground truncate">{slide.sub_caption}</p>
                        <a href={slide.target_url} target="_blank" rel="noreferrer" className="text-xs text-brand flex items-center gap-1 hover:underline mt-1">
                          <ExternalLink className="h-3 w-3" /> {slide.target_url}
                        </a>
                      </div>
                      <div className="flex flex-col gap-1 shrink-0">
                        <div className="flex gap-1">
                          <Dialog open={editingSlide?.id === slide.id} onOpenChange={(o) => { if (!o) setEditingSlide(null); }}>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="gap-1 rounded-lg h-8" onClick={() => setEditingSlide({ ...slide })}>
                                <Edit className="h-3 w-3" /> Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                              <DialogHeader><DialogTitle>Edit Slide</DialogTitle></DialogHeader>
                              {editingSlide && (
                                <form onSubmit={async (e) => {
                                  e.preventDefault();
                                  await updateSlideMut.mutateAsync(editingSlide);
                                  setEditingSlide(null);
                                  toast.success("Slide updated!");
                                }} className="space-y-4 pt-2">
                                  <div>
                                    <Label>Slide Image URL</Label>
                                    <div className="flex gap-2 items-center mt-1">
                                      <Input required value={editingSlide.image_url} onChange={(e) => setEditingSlide({ ...editingSlide, image_url: e.target.value })} className="flex-1" />
                                      {editingSlide.image_url && <img src={editingSlide.image_url} alt="preview" className="h-9 w-14 object-cover rounded border shrink-0" onError={(e) => (e.currentTarget.style.display = 'none')} />}
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Heading / Caption</Label>
                                    <Input value={editingSlide.caption || ""} onChange={(e) => setEditingSlide({ ...editingSlide, caption: e.target.value })} className="mt-1" />
                                  </div>
                                  <div>
                                    <Label>Sub-caption</Label>
                                    <Input value={editingSlide.sub_caption || ""} onChange={(e) => setEditingSlide({ ...editingSlide, sub_caption: e.target.value })} className="mt-1" />
                                  </div>
                                  <div>
                                    <Label>Target URL</Label>
                                    <Input value={editingSlide.target_url} onChange={(e) => setEditingSlide({ ...editingSlide, target_url: e.target.value })} className="mt-1" />
                                  </div>
                                  <div>
                                    <Label>Position (order)</Label>
                                    <Input type="number" min={0} max={4} value={editingSlide.position} onChange={(e) => setEditingSlide({ ...editingSlide, position: Number(e.target.value) })} className="mt-1" />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button type="button" onClick={() => setEditingSlide({ ...editingSlide, active: !editingSlide.active })} className="text-brand">
                                      {editingSlide.active ? <ToggleRight className="h-7 w-7" /> : <ToggleLeft className="h-7 w-7 text-muted-foreground" />}
                                    </button>
                                    <Label>{editingSlide.active ? "Active" : "Inactive"}</Label>
                                  </div>
                                  <DialogFooter>
                                    <Button type="submit" className="rounded-xl">Save Changes</Button>
                                  </DialogFooter>
                                </form>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button size="sm" variant="ghost" className="gap-1 rounded-lg h-8 text-destructive hover:bg-destructive/10"
                            onClick={async () => { await deleteSlideMut.mutateAsync(Number(slide.id)); toast.success("Slide deleted"); }}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground text-center pt-1">{slidesList.length}/5 slides used</p>
                </div>
              )}
            </TabsContent>

            {/* BRANDS TAB */}
            <TabsContent value="brands" className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-black">Best Brands</h1>
                  <p className="text-sm text-muted-foreground">{brandList.length} brand{brandList.length !== 1 ? "s" : ""} configured for the homepage</p>
                </div>
                <Dialog open={addBrandDialogOpen} onOpenChange={setAddBrandDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 rounded-xl">
                      <Plus className="h-4 w-4" /> Add Brand
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Add Brand</DialogTitle>
                      <DialogDescription>Set brand name, logo or image link, and the homepage order.</DialogDescription>
                    </DialogHeader>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!newBrandForm.name.trim()) return;
                        await addBrandMut.mutateAsync({
                          name: newBrandForm.name.trim(),
                          image_url: newBrandForm.image_url.trim(),
                          position: newBrandForm.position,
                          active: newBrandForm.active,
                        });
                        setAddBrandDialogOpen(false);
                        setNewBrandForm({ name: "", image_url: "", position: 0, active: true });
                        toast.success("Brand added");
                      }}
                      className="space-y-4 pt-2"
                    >
                      <div>
                        <Label>Brand Name</Label>
                        <Input required value={newBrandForm.name} onChange={(e) => setNewBrandForm({ ...newBrandForm, name: e.target.value })} className="mt-1" />
                      </div>
                      <div>
                        <Label>Logo / Image URL</Label>
                        <div className="flex gap-2 items-center mt-1">
                          <Input value={newBrandForm.image_url} onChange={(e) => setNewBrandForm({ ...newBrandForm, image_url: e.target.value })} className="flex-1" />
                          {newBrandForm.image_url && <img src={newBrandForm.image_url} alt="preview" className="h-9 w-14 object-contain rounded border shrink-0 bg-background p-1" onError={(e) => (e.currentTarget.style.display = 'none')} />}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Display Order</Label>
                          <Input type="number" min={0} value={newBrandForm.position} onChange={(e) => setNewBrandForm({ ...newBrandForm, position: Number(e.target.value) })} className="mt-1" />
                        </div>
                        <div className="flex items-center gap-2 pt-7">
                          <button type="button" onClick={() => setNewBrandForm({ ...newBrandForm, active: !newBrandForm.active })} className="text-brand">
                            {newBrandForm.active ? <ToggleRight className="h-7 w-7" /> : <ToggleLeft className="h-7 w-7 text-muted-foreground" />}
                          </button>
                          <Label>{newBrandForm.active ? "Active" : "Inactive"}</Label>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" className="rounded-xl">Create Brand</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {brandList.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed bg-muted/20 p-16 text-center">
                  <ImageIcon className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="font-semibold text-muted-foreground">No brands yet</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Add brand logos to power the homepage best brands section</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {brandList.map((brand: BrandSpotlight, idx: number) => (
                    <div key={brand.id} className={cn("rounded-2xl border bg-card p-4 shadow-soft flex gap-4", !brand.active && "opacity-60") }>
                      <div className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl border bg-surface-muted">
                        <img src={brand.image_url} alt={brand.name} className="h-full w-full object-contain p-3" onError={(e) => (e.currentTarget.style.display = 'none')} />
                        <span className="absolute text-xl font-black text-brand">{brand.name[0]}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-bold truncate">{brand.name}</p>
                          <Badge variant="outline" className="text-[10px]">#{idx + 1}</Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground truncate">{brand.image_url || "No image URL set"}</p>
                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                          <Badge className={brand.active ? "bg-success text-white" : "bg-muted text-muted-foreground"}>{brand.active ? "Active" : "Inactive"}</Badge>
                          <Badge variant="outline">Order {brand.position}</Badge>
                        </div>
                        <div className="mt-3 flex gap-2 flex-wrap">
                          <Dialog open={editingBrand?.id === brand.id} onOpenChange={(open) => { if (!open) setEditingBrand(null); }}>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="gap-1 rounded-lg h-8" onClick={() => setEditingBrand({ ...brand })}>
                                <Edit className="h-3 w-3" /> Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                              <DialogHeader><DialogTitle>Edit Brand</DialogTitle></DialogHeader>
                              {editingBrand && (
                                <form onSubmit={async (e) => {
                                  e.preventDefault();
                                  await updateBrandMut.mutateAsync({ ...editingBrand, name: editingBrand.name.trim(), image_url: editingBrand.image_url.trim() });
                                  setEditingBrand(null);
                                  toast.success("Brand updated");
                                }} className="space-y-4 pt-2">
                                  <div>
                                    <Label>Brand Name</Label>
                                    <Input value={editingBrand.name} onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })} className="mt-1" />
                                  </div>
                                  <div>
                                    <Label>Logo / Image URL</Label>
                                    <div className="flex gap-2 items-center mt-1">
                                      <Input value={editingBrand.image_url} onChange={(e) => setEditingBrand({ ...editingBrand, image_url: e.target.value })} className="flex-1" />
                                      {editingBrand.image_url && <img src={editingBrand.image_url} alt="preview" className="h-9 w-14 object-contain rounded border shrink-0 bg-background p-1" onError={(e) => (e.currentTarget.style.display = 'none')} />}
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <Label>Display Order</Label>
                                      <Input type="number" min={0} value={editingBrand.position} onChange={(e) => setEditingBrand({ ...editingBrand, position: Number(e.target.value) })} className="mt-1" />
                                    </div>
                                    <div className="flex items-center gap-2 pt-7">
                                      <button type="button" onClick={() => setEditingBrand({ ...editingBrand, active: !editingBrand.active })} className="text-brand">
                                        {editingBrand.active ? <ToggleRight className="h-7 w-7" /> : <ToggleLeft className="h-7 w-7 text-muted-foreground" />}
                                      </button>
                                      <Label>{editingBrand.active ? "Active" : "Inactive"}</Label>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button type="submit" className="rounded-xl">Save Changes</Button>
                                  </DialogFooter>
                                </form>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button size="sm" variant="ghost" className="gap-1 rounded-lg h-8 text-destructive hover:bg-destructive/10" onClick={async () => { await deleteBrandMut.mutateAsync(Number(brand.id)); toast.success("Brand deleted"); }}>
                            <Trash2 className="h-3 w-3" /> Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* CATEGORY BANNERS TAB */}
            <TabsContent value="cat-banners" className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-black">Category Banners</h1>
                  <p className="text-sm text-muted-foreground">Manage the hero slider shown on each category page</p>
                </div>
                <Dialog open={addCatBannerDialogOpen} onOpenChange={setAddCatBannerDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 rounded-xl"><Plus className="h-4 w-4" /> Add Banner</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Add Category Banner</DialogTitle>
                      <DialogDescription>Add a banner slide for a category page. Multiple slides create a slider.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      if (!newCatBannerForm.image_url.trim()) return;
                      await addCatBannerMut.mutateAsync({ ...newCatBannerForm, image_url: newCatBannerForm.image_url.trim(), title: newCatBannerForm.title.trim(), subtitle: newCatBannerForm.subtitle.trim(), link_url: newCatBannerForm.link_url.trim() || "#" });
                      setAddCatBannerDialogOpen(false);
                      setNewCatBannerForm({ category_slug: "electronics", image_url: "", title: "", subtitle: "", link_url: "#", position: 0, active: true });
                      toast.success("Banner added");
                    }} className="space-y-4 pt-2">
                      <div>
                        <Label>Category</Label>
                        <Select value={newCatBannerForm.category_slug} onValueChange={(v) => setNewCatBannerForm({ ...newCatBannerForm, category_slug: v })}>
                          <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                          <SelectContent>{categories.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Banner Image URL</Label>
                        <div className="flex gap-2 items-center mt-1">
                          <Input required value={newCatBannerForm.image_url} onChange={(e) => setNewCatBannerForm({ ...newCatBannerForm, image_url: e.target.value })} className="flex-1" placeholder="https://..." />
                          {newCatBannerForm.image_url && <img src={newCatBannerForm.image_url} alt="preview" className="h-9 w-16 object-cover rounded border shrink-0" onError={(e) => (e.currentTarget.style.display = 'none')} />}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Title (optional)</Label>
                          <Input value={newCatBannerForm.title} onChange={(e) => setNewCatBannerForm({ ...newCatBannerForm, title: e.target.value })} className="mt-1" />
                        </div>
                        <div>
                          <Label>Link URL</Label>
                          <Input value={newCatBannerForm.link_url} onChange={(e) => setNewCatBannerForm({ ...newCatBannerForm, link_url: e.target.value })} className="mt-1" />
                        </div>
                      </div>
                      <div>
                        <Label>Subtitle (optional)</Label>
                        <Input value={newCatBannerForm.subtitle} onChange={(e) => setNewCatBannerForm({ ...newCatBannerForm, subtitle: e.target.value })} className="mt-1" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Display Order</Label>
                          <Input type="number" min={0} value={newCatBannerForm.position} onChange={(e) => setNewCatBannerForm({ ...newCatBannerForm, position: Number(e.target.value) })} className="mt-1" />
                        </div>
                        <div className="flex items-center gap-2 pt-7">
                          <button type="button" onClick={() => setNewCatBannerForm({ ...newCatBannerForm, active: !newCatBannerForm.active })} className="text-brand">
                            {newCatBannerForm.active ? <ToggleRight className="h-7 w-7" /> : <ToggleLeft className="h-7 w-7 text-muted-foreground" />}
                          </button>
                          <Label>{newCatBannerForm.active ? "Active" : "Inactive"}</Label>
                        </div>
                      </div>
                      <DialogFooter><Button type="submit" className="rounded-xl">Create Banner</Button></DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Filter by category */}
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setCatBannerFilterSlug("all")} className={cn("rounded-full border px-3 py-1 text-xs font-medium", catBannerFilterSlug === "all" ? "bg-primary text-primary-foreground" : "hover:bg-muted")}>All</button>
                {categories.map((c) => (
                  <button key={c.slug} onClick={() => setCatBannerFilterSlug(c.slug)} className={cn("rounded-full border px-3 py-1 text-xs font-medium", catBannerFilterSlug === c.slug ? "bg-primary text-primary-foreground" : "hover:bg-muted")}>{c.name}</button>
                ))}
              </div>

              {catBannerList.filter((b: CategoryBanner) => catBannerFilterSlug === "all" || b.category_slug === catBannerFilterSlug).length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed bg-muted/20 p-16 text-center">
                  <SlidersHorizontal className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="font-semibold text-muted-foreground">No banners yet</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Add banner slides to power the category page hero slider</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {(catBannerList as CategoryBanner[]).filter((b) => catBannerFilterSlug === "all" || b.category_slug === catBannerFilterSlug).map((banner, idx) => (
                    <div key={banner.id} className={cn("rounded-2xl border bg-card overflow-hidden shadow-soft", !banner.active && "opacity-60")}>
                      <div className="relative h-32 bg-muted">
                        <img src={banner.image_url} alt={banner.title || banner.category_slug} className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-end p-3">
                          <div>
                            {banner.title && <p className="text-white font-bold text-sm">{banner.title}</p>}
                            {banner.subtitle && <p className="text-white/80 text-xs">{banner.subtitle}</p>}
                          </div>
                        </div>
                        <Badge className="absolute top-2 right-2 text-[10px]">{categories.find(c => c.slug === banner.category_slug)?.name ?? banner.category_slug}</Badge>
                      </div>
                      <div className="p-3 flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={banner.active ? "bg-success text-white" : "bg-muted text-muted-foreground"}>{banner.active ? "Active" : "Inactive"}</Badge>
                          <Badge variant="outline">#{idx + 1} · Order {banner.position}</Badge>
                          {banner.link_url && banner.link_url !== "#" && <a href={banner.link_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary flex items-center gap-1"><ExternalLink className="h-3 w-3" /> Link</a>}
                        </div>
                        <div className="flex gap-2">
                          <Dialog open={editingCatBanner?.id === banner.id} onOpenChange={(open) => { if (!open) setEditingCatBanner(null); }}>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="gap-1 rounded-lg h-8" onClick={() => setEditingCatBanner({ ...banner })}>
                                <Edit className="h-3 w-3" /> Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                              <DialogHeader><DialogTitle>Edit Category Banner</DialogTitle></DialogHeader>
                              {editingCatBanner && (
                                <form onSubmit={async (e) => {
                                  e.preventDefault();
                                  await updateCatBannerMut.mutateAsync({ ...editingCatBanner, image_url: editingCatBanner.image_url.trim(), title: editingCatBanner.title.trim(), subtitle: editingCatBanner.subtitle.trim(), link_url: editingCatBanner.link_url.trim() || "#" });
                                  setEditingCatBanner(null);
                                  toast.success("Banner updated");
                                }} className="space-y-4 pt-2">
                                  <div>
                                    <Label>Category</Label>
                                    <Select value={editingCatBanner.category_slug} onValueChange={(v) => setEditingCatBanner({ ...editingCatBanner, category_slug: v })}>
                                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                      <SelectContent>{categories.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}</SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label>Banner Image URL</Label>
                                    <div className="flex gap-2 items-center mt-1">
                                      <Input required value={editingCatBanner.image_url} onChange={(e) => setEditingCatBanner({ ...editingCatBanner, image_url: e.target.value })} className="flex-1" />
                                      {editingCatBanner.image_url && <img src={editingCatBanner.image_url} alt="preview" className="h-9 w-16 object-cover rounded border shrink-0" onError={(e) => (e.currentTarget.style.display = 'none')} />}
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <Label>Title</Label>
                                      <Input value={editingCatBanner.title} onChange={(e) => setEditingCatBanner({ ...editingCatBanner, title: e.target.value })} className="mt-1" />
                                    </div>
                                    <div>
                                      <Label>Link URL</Label>
                                      <Input value={editingCatBanner.link_url} onChange={(e) => setEditingCatBanner({ ...editingCatBanner, link_url: e.target.value })} className="mt-1" />
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Subtitle</Label>
                                    <Input value={editingCatBanner.subtitle} onChange={(e) => setEditingCatBanner({ ...editingCatBanner, subtitle: e.target.value })} className="mt-1" />
                                  </div>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <Label>Display Order</Label>
                                      <Input type="number" min={0} value={editingCatBanner.position} onChange={(e) => setEditingCatBanner({ ...editingCatBanner, position: Number(e.target.value) })} className="mt-1" />
                                    </div>
                                    <div className="flex items-center gap-2 pt-7">
                                      <button type="button" onClick={() => setEditingCatBanner({ ...editingCatBanner, active: !editingCatBanner.active })} className="text-brand">
                                        {editingCatBanner.active ? <ToggleRight className="h-7 w-7" /> : <ToggleLeft className="h-7 w-7 text-muted-foreground" />}
                                      </button>
                                      <Label>{editingCatBanner.active ? "Active" : "Inactive"}</Label>
                                    </div>
                                  </div>
                                  <DialogFooter><Button type="submit" className="rounded-xl">Save Changes</Button></DialogFooter>
                                </form>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button size="sm" variant="ghost" className="gap-1 rounded-lg h-8 text-destructive hover:bg-destructive/10" onClick={async () => { await deleteCatBannerMut.mutateAsync(Number(banner.id)); toast.success("Banner deleted"); }}>
                            <Trash2 className="h-3 w-3" /> Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

          </div>
        </div>
      </Tabs>
    </div>
  );
}
