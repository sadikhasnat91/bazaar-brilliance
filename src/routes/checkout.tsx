import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CreditCard, Truck, Wallet, MapPin, Check, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useShop } from "@/lib/shop-context";
import { formatBDT } from "@/lib/data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Bazaar" }, { name: "description", content: "Complete your order" }, { name: "robots", content: "noindex" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { cartProducts, cartTotal, clearCart } = useShop();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [delivery, setDelivery] = useState("standard");
  const [payment, setPayment] = useState("cod");
  const [orderId, setOrderId] = useState<string>();

  const shippingCost = delivery === "express" ? 150 : cartTotal > 999 ? 0 : 60;
  const total = cartTotal + shippingCost;

  const placeOrder = () => {
    const id = "BZ" + Math.floor(100000 + Math.random() * 900000);
    setOrderId(id);
    setStep(4);
    clearCart();
    toast.success("Order placed!");
  };

  if (step === 4 && orderId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="grid h-20 w-20 mx-auto place-items-center rounded-full bg-success text-success-foreground animate-float-up">
          <Check className="h-10 w-10" />
        </div>
        <h1 className="mt-6 text-3xl font-black">Order confirmed!</h1>
        <p className="mt-2 text-muted-foreground">Thank you for shopping with Bazaar.</p>
        <div className="mt-6 rounded-2xl border bg-card p-6 text-left">
          <div className="flex justify-between"><span className="text-muted-foreground">Order ID</span><span className="font-mono font-bold">{orderId}</span></div>
          <div className="mt-2 flex justify-between"><span className="text-muted-foreground">Total paid</span><span className="font-bold text-brand">{formatBDT(total)}</span></div>
          <div className="mt-2 flex justify-between"><span className="text-muted-foreground">Payment</span><span className="uppercase">{payment}</span></div>
        </div>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild><Link to="/track">Track order</Link></Button>
          <Button asChild variant="outline"><Link to="/">Keep shopping</Link></Button>
        </div>
      </div>
    );
  }

  if (cartProducts.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-3xl font-black">Nothing to checkout</h1>
        <Button asChild className="mt-6"><Link to="/">Continue shopping</Link></Button>
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
            <div className={cn("grid h-8 w-8 place-items-center rounded-full text-sm font-bold", step > i + 1 ? "bg-success text-success-foreground" : step === i + 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
              {step > i + 1 ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={cn("text-sm", step === i + 1 && "font-semibold")}>{s}</span>
            {i < steps.length - 1 && <div className="h-px w-8 bg-border" />}
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="rounded-2xl border bg-card p-6 space-y-4">
              <p className="font-semibold flex items-center gap-2"><MapPin className="h-5 w-5" /> Shipping address</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label>Full name</Label><Input required defaultValue="Rifat Hossain" /></div>
                <div><Label>Phone</Label><Input required type="tel" defaultValue="+8801700000000" /></div>
                <div className="sm:col-span-2"><Label>Street address</Label><Input required defaultValue="House 12, Road 4, Dhanmondi" /></div>
                <div><Label>City</Label><Input required defaultValue="Dhaka" /></div>
                <div><Label>Postcode</Label><Input required defaultValue="1209" /></div>
              </div>
              <div className="flex justify-end"><Button type="submit">Continue to delivery</Button></div>
            </form>
          )}
          {step === 2 && (
            <div className="rounded-2xl border bg-card p-6 space-y-4">
              <p className="font-semibold flex items-center gap-2"><Truck className="h-5 w-5" /> Delivery option</p>
              <RadioGroup value={delivery} onValueChange={setDelivery}>
                {[
                  { v: "standard", t: "Standard delivery", d: "2-3 business days", p: cartTotal > 999 ? 0 : 60 },
                  { v: "express", t: "Express delivery", d: "Within 24 hours", p: 150 },
                ].map((o) => (
                  <label key={o.v} htmlFor={o.v} className={cn("flex items-center gap-4 rounded-xl border p-4 cursor-pointer", delivery === o.v && "border-brand bg-brand/5")}>
                    <RadioGroupItem value={o.v} id={o.v} />
                    <div className="flex-1"><p className="font-medium">{o.t}</p><p className="text-sm text-muted-foreground">{o.d}</p></div>
                    <span className="font-bold text-brand">{o.p === 0 ? "Free" : formatBDT(o.p)}</span>
                  </label>
                ))}
              </RadioGroup>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)}>Continue to payment</Button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="rounded-2xl border bg-card p-6 space-y-4">
              <p className="font-semibold flex items-center gap-2"><Wallet className="h-5 w-5" /> Payment method</p>
              <RadioGroup value={payment} onValueChange={setPayment}>
                {[
                  { v: "cod", t: "Cash on Delivery", d: "Pay when you receive", icon: Package },
                  { v: "bkash", t: "bKash", d: "Pay with your bKash wallet", icon: Wallet },
                  { v: "card", t: "Credit / Debit card", d: "Visa, Mastercard, Amex", icon: CreditCard },
                ].map((o) => (
                  <label key={o.v} htmlFor={o.v} className={cn("flex items-center gap-4 rounded-xl border p-4 cursor-pointer", payment === o.v && "border-brand bg-brand/5")}>
                    <RadioGroupItem value={o.v} id={o.v} />
                    <o.icon className="h-5 w-5 text-brand" />
                    <div className="flex-1"><p className="font-medium">{o.t}</p><p className="text-sm text-muted-foreground">{o.d}</p></div>
                  </label>
                ))}
              </RadioGroup>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={placeOrder} className="bg-accent text-accent-foreground hover:bg-accent/90">Place order · {formatBDT(total)}</Button>
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
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatBDT(cartTotal)}</dd></div>
            <div className="flex justify-between"><dt>Shipping</dt><dd>{shippingCost === 0 ? "Free" : formatBDT(shippingCost)}</dd></div>
            <div className="border-t pt-2 flex justify-between text-lg font-bold"><dt>Total</dt><dd className="text-brand">{formatBDT(total)}</dd></div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
