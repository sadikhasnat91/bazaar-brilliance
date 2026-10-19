import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  CreditCard,
  Truck,
  Wallet,
  MapPin,
  Check,
  Package,
  Smartphone,
  Building2,
  ShieldCheck,
  Loader2,
  Globe,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { useShop } from "@/lib/shop-context";
import { formatBDT } from "@/lib/data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { addOrderFn } from "@/lib/products-api";
import {
  initSslCommerzPaymentFn,
  verifySslCommerzPaymentFn,
} from "@/lib/payment-gateway-api";

type CheckoutSearch = {
  payment_status?: string;
  order_id?: string;
  val_id?: string;
};

export const Route = createFileRoute("/checkout")({
  validateSearch: (search: Record<string, unknown>): CheckoutSearch => ({
    payment_status: search.payment_status as string | undefined,
    order_id: search.order_id as string | undefined,
    val_id: search.val_id as string | undefined,
  }),
  head: () => ({
    meta: [
      { title: "Checkout — Bazaar" },
      { name: "description", content: "Complete your order" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { cartProducts, cartTotal, clearCart } = useShop();
  const search = Route.useSearch();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [delivery, setDelivery] = useState("standard");
  const [payment, setPayment] = useState("bkash");
  const [orderId, setOrderId] = useState<string>();
  const [isLoadingGateway, setIsLoadingGateway] = useState(false);

  // Completed Payment Details State
  const [verifiedPayment, setVerifiedPayment] = useState<{
    method: string;
    status: string;
    trxId: string;
    bankTranId?: string;
  } | null>(null);

  // Shipping Address Form State
  const [name, setName] = useState("Rifat Hossain");
  const [phone, setPhone] = useState("+8801700000000");
  const [email, setEmail] = useState("rifat@example.com");
  const [address, setAddress] = useState("House 12, Road 4, Dhanmondi");
  const [city, setCity] = useState("Dhaka");
  const [postcode, setPostcode] = useState("1209");

  const shippingCost = delivery === "express" ? 150 : cartTotal > 999 ? 0 : 60;
  const total = cartTotal + shippingCost;

  // Handle gateway return callbacks (SSLCommerz success/fail/cancel)
  useEffect(() => {
    if (search.payment_status === "success" && search.order_id) {
      const verifyReturn = async () => {
        setIsLoadingGateway(true);
        let bankTranId = "";
        let cardType = "SSLCOMMERZ";

        if (search.val_id) {
          try {
            const valRes = await verifySslCommerzPaymentFn({
              data: { val_id: search.val_id },
            });
            if (valRes.isValid) {
              bankTranId = valRes.bankTranId || "";
              cardType = valRes.cardType || "SSLCOMMERZ";
            }
          } catch (e) {
            console.error("Verification warning:", e);
          }
        }

        const trxId = bankTranId || search.val_id || "TRX-" + search.order_id;
        const newOrderId = search.order_id!;

        // Save order to database
        const orderData = {
          id: newOrderId,
          customer: name,
          email: email,
          total: total,
          status: "Processing" as const,
          date: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          itemsCount: cartProducts.reduce((acc, cp) => acc + cp.qty, 0),
          items: cartProducts.map((cp) => ({
            title: cp.product.title,
            qty: cp.qty,
            price: cp.product.price,
          })),
          paymentMethod: cardType.toLowerCase().includes("bkash") ? "bkash" : "online",
          paymentStatus: "Paid",
          transactionId: trxId,
          paidAt: new Date().toISOString(),
        };

        try {
          await addOrderFn({ data: orderData });
        } catch (err) {
          console.error("Error saving order:", err);
        }

        setOrderId(newOrderId);
        setVerifiedPayment({
          method: cardType,
          status: "Paid",
          trxId: trxId,
          bankTranId: bankTranId,
        });
        setStep(4);
        clearCart();
        setIsLoadingGateway(false);
        toast.success("Payment verified and order placed successfully!");
      };

      verifyReturn();
    } else if (search.payment_status === "fail") {
      toast.error("Payment failed via SSLCommerz gateway. Please try again.");
    } else if (search.payment_status === "cancel") {
      toast.info("Payment cancelled. You can choose another method.");
    }
  }, [search.payment_status, search.order_id, search.val_id]);

  // Proceed to Payment Action
  const handleProceedToPayment = async () => {
    if (!name || !phone || !email || !address) {
      toast.error("Please fill in all shipping details first");
      setStep(1);
      return;
    }

    if (payment === "cod") {
      // Cash on Delivery
      const id = "BZ" + Math.floor(100000 + Math.random() * 900000);
      const trxId = "COD-" + Math.floor(100000 + Math.random() * 900000);

      const orderData = {
        id,
        customer: name,
        email: email,
        total: total,
        status: "Pending" as const,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        itemsCount: cartProducts.reduce((acc, cp) => acc + cp.qty, 0),
        items: cartProducts.map((cp) => ({
          title: cp.product.title,
          qty: cp.qty,
          price: cp.product.price,
        })),
        paymentMethod: "cod",
        paymentStatus: "Pending",
        transactionId: trxId,
        paidAt: new Date().toISOString(),
      };

      try {
        await addOrderFn({ data: orderData });
        setOrderId(id);
        setVerifiedPayment({
          method: "Cash on Delivery",
          status: "Pending",
          trxId: trxId,
        });
        setStep(4);
        clearCart();
        toast.success("Order placed successfully with Cash on Delivery!");
      } catch (err) {
        toast.error("Failed to place order. Please try again.");
      }
      return;
    }

    // Live Gateway Integration: SSLCommerz (bKash, Nagad, Rocket, Card)
    setIsLoadingGateway(true);
    const toastId = toast.loading("Connecting to Live Payment Gateway server...");
    const genOrderId = "BZ" + Math.floor(100000 + Math.random() * 900000);

    try {
      const res = await initSslCommerzPaymentFn({
        data: {
          amount: total,
          orderId: genOrderId,
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          paymentMethod: payment,
          baseUrl: window.location.origin,
        },
      });

      if (res.success && res.redirectUrl) {
        toast.success("Payment session created! Redirecting to Gateway portal...", { id: toastId });
        setTimeout(() => {
          window.location.href = res.redirectUrl!;
        }, 1000);
      } else {
        toast.error(
          res.error || "Could not connect to SSLCommerz API. Please check your internet connection.",
          { id: toastId }
        );
        setIsLoadingGateway(false);
      }
    } catch (err: any) {
      toast.error("Gateway error: " + (err.message || "Failed to initialize live gateway"), {
        id: toastId,
      });
      setIsLoadingGateway(false);
    }
  };

  // Step 4: Order Confirmed Screen
  if (step === 4 && orderId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="grid h-20 w-20 mx-auto place-items-center rounded-full bg-emerald-500 text-white animate-bounce shadow-xl">
          <Check className="h-10 w-10 stroke-[3]" />
        </div>
        <h1 className="mt-6 text-3xl font-black">Order Confirmed!</h1>
        <p className="mt-2 text-muted-foreground">
          Thank you for shopping with Bazaar. Your payment has been processed and order placed.
        </p>

        <div className="mt-6 rounded-2xl border bg-card p-6 text-left space-y-3 shadow-sm">
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="text-muted-foreground">Order ID</span>
            <span className="font-mono font-bold text-lg">{orderId}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Amount</span>
            <span className="font-extrabold text-xl text-brand">{formatBDT(total)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Payment Method</span>
            <span className="uppercase font-bold text-sm bg-muted py-1 px-2.5 rounded-lg">
              {verifiedPayment?.method || payment}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Payment Status</span>
            <Badge
              className={cn(
                "font-bold text-xs px-2.5 py-0.5",
                verifiedPayment?.status === "Paid"
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-300 dark:text-emerald-400"
                  : "bg-amber-500/10 text-amber-600 border-amber-300 dark:text-amber-400"
              )}
            >
              {verifiedPayment?.status === "Paid" ? "✓ PAID & VERIFIED" : "PENDING (COD)"}
            </Badge>
          </div>

          {verifiedPayment?.trxId && (
            <div className="flex justify-between items-center pt-2 border-t text-xs">
              <span className="text-muted-foreground">Gateway Transaction ID</span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                {verifiedPayment.trxId}
              </span>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <Button asChild className="font-bold">
            <Link to="/track">Track Order</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">Keep Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (cartProducts.length === 0 && !search.payment_status) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-3xl font-black">Nothing to checkout</h1>
        <Button asChild className="mt-6">
          <Link to="/">Continue shopping</Link>
        </Button>
      </div>
    );
  }

  const steps = ["Address", "Delivery", "Payment"];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-3xl font-black">Checkout</h1>

      <div className="mt-6 flex items-center gap-3">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <div
              className={cn(
                "grid h-8 w-8 place-items-center rounded-full text-sm font-bold",
                step > i + 1
                  ? "bg-emerald-500 text-white"
                  : step === i + 1
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {step > i + 1 ? <Check className="h-4 w-4 stroke-[3]" /> : i + 1}
            </div>
            <span className={cn("text-sm", step === i + 1 && "font-semibold")}>{s}</span>
            {i < steps.length - 1 && <div className="h-px w-8 bg-border" />}
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {step === 1 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep(2);
              }}
              className="rounded-2xl border bg-card p-6 space-y-4"
            >
              <p className="font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5" /> Shipping address
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Full name</Label>
                  <Input required value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Email address</Label>
                  <Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Street address</Label>
                  <Input required value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div>
                  <Label>City</Label>
                  <Input required value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div>
                  <Label>Postcode</Label>
                  <Input required value={postcode} onChange={(e) => setPostcode(e.target.value)} />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit">Continue to delivery</Button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="rounded-2xl border bg-card p-6 space-y-4">
              <p className="font-semibold flex items-center gap-2">
                <Truck className="h-5 w-5" /> Delivery option
              </p>
              <RadioGroup value={delivery} onValueChange={setDelivery}>
                {[
                  { v: "standard", t: "Standard delivery", d: "2-3 business days", p: cartTotal > 999 ? 0 : 60 },
                  { v: "express", t: "Express delivery", d: "Within 24 hours", p: 150 },
                ].map((o) => (
                  <label
                    key={o.v}
                    htmlFor={o.v}
                    className={cn(
                      "flex items-center gap-4 rounded-xl border p-4 cursor-pointer",
                      delivery === o.v && "border-brand bg-brand/5"
                    )}
                  >
                    <RadioGroupItem value={o.v} id={o.v} />
                    <div className="flex-1">
                      <p className="font-medium">{o.t}</p>
                      <p className="text-sm text-muted-foreground">{o.d}</p>
                    </div>
                    <span className="font-bold text-brand">{o.p === 0 ? "Free" : formatBDT(o.p)}</span>
                  </label>
                ))}
              </RadioGroup>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)}>Continue to payment</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="rounded-2xl border bg-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold flex items-center gap-2">
                  <Wallet className="h-5 w-5" /> Select Payment Gateway
                </p>
                <Badge
                  variant="outline"
                  className="text-xs border-emerald-500 text-emerald-600 dark:text-emerald-400 gap-1 font-semibold"
                >
                  <ShieldCheck className="h-3.5 w-3.5" /> 256-Bit SSL Secured
                </Badge>
              </div>

              <RadioGroup
                value={payment}
                onValueChange={setPayment}
                className="grid gap-3 sm:grid-cols-2"
              >
                {[
                  {
                    v: "bkash",
                    t: "bKash Direct Gateway",
                    d: "Pay via bKash mobile wallet",
                    icon: Smartphone,
                    color: "text-[#E2136E]",
                  },
                  {
                    v: "nagad",
                    t: "Nagad Gateway",
                    d: "Pay via Nagad mobile wallet",
                    icon: Wallet,
                    color: "text-[#F7941D]",
                  },
                  {
                    v: "rocket",
                    t: "Rocket / DBBL",
                    d: "Pay via DBBL Rocket wallet",
                    icon: Building2,
                    color: "text-[#8C3494]",
                  },
                  {
                    v: "card",
                    t: "Credit / Debit Card",
                    d: "Visa, Mastercard, Amex",
                    icon: CreditCard,
                    color: "text-brand",
                  },
                  {
                    v: "cod",
                    t: "Cash on Delivery",
                    d: "Pay when parcel arrives",
                    icon: Package,
                    color: "text-emerald-600",
                  },
                ].map((o) => (
                  <label
                    key={o.v}
                    htmlFor={o.v}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all hover:border-brand/40",
                      payment === o.v && "border-brand bg-brand/5 shadow-sm"
                    )}
                  >
                    <RadioGroupItem value={o.v} id={o.v} className="mt-1" />
                    <o.icon className={cn("h-5 w-5 shrink-0 mt-0.5", o.color)} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm leading-snug">{o.t}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{o.d}</p>
                    </div>
                  </label>
                ))}
              </RadioGroup>

              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  onClick={handleProceedToPayment}
                  disabled={isLoadingGateway}
                  className="bg-brand text-brand-foreground hover:bg-brand/90 font-bold px-6 h-11 text-base shadow-lg gap-2"
                >
                  {isLoadingGateway ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> Connecting to Gateway...
                    </>
                  ) : (
                    <>
                      <Globe className="h-4 w-4" /> Proceed to Pay · {formatBDT(total)}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        <aside className="rounded-2xl border bg-card p-5 h-fit sticky top-32">
          <p className="font-semibold">Order summary</p>
          <div className="mt-4 space-y-3 max-h-64 overflow-auto pr-1">
            {cartProducts.map(({ product, qty }) => (
              <div key={product.id} className="flex gap-3">
                <img src={product.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm line-clamp-1">{product.title}</p>
                  <p className="text-xs text-muted-foreground">Qty {qty}</p>
                </div>
                <p className="text-sm font-semibold">{formatBDT(product.price * qty)}</p>
              </div>
            ))}
          </div>
          <dl className="mt-4 space-y-2 text-sm border-t pt-4">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatBDT(cartTotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Shipping</dt>
              <dd>{shippingCost === 0 ? "Free" : formatBDT(shippingCost)}</dd>
            </div>
            <div className="border-t pt-2 flex justify-between text-lg font-bold">
              <dt>Total</dt>
              <dd className="text-brand">{formatBDT(total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
