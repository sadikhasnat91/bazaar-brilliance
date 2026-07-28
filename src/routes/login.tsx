import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — Bazaar" }, { name: "description", content: "Sign in to your Bazaar account" }] }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="mx-auto grid min-h-[80vh] max-w-6xl grid-cols-1 gap-8 px-4 py-10 lg:grid-cols-2 items-center">
      <div className="relative hidden lg:block rounded-3xl overflow-hidden gradient-hero p-12 text-white h-full">
        <div className="relative z-10 h-full flex flex-col">
          <div>
            <h2 className="text-4xl font-black">Welcome back to Bazaar</h2>
            <p className="mt-3 text-white/85">Discover deals from 100k+ products, track orders and get exclusive member perks.</p>
          </div>
          <ul className="mt-auto space-y-3 text-sm">
            <li>✓ Faster checkout with saved addresses</li>
            <li>✓ Member-only flash sales</li>
            <li>✓ Free returns on your first order</li>
          </ul>
        </div>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); toast.success("Welcome back!"); }} className="rounded-3xl border bg-card p-8">
        <h1 className="text-3xl font-black">Sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">Enter your credentials to continue</p>
        <div className="mt-6 space-y-4">
          <div>
            <Label>Email or phone</Label>
            <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input required className="pl-9" placeholder="you@example.com" /></div>
          </div>
          <div>
            <div className="flex justify-between"><Label>Password</Label><Link to="/forgot-password" className="text-xs text-brand hover:underline">Forgot?</Link></div>
            <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input required type="password" className="pl-9" placeholder="••••••••" /></div>
          </div>
          <Button size="lg" className="w-full">Sign in</Button>
          <div className="flex items-center gap-3 text-xs text-muted-foreground"><div className="h-px flex-1 bg-border" /><span>OR</span><div className="h-px flex-1 bg-border" /></div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" type="button">Google</Button>
            <Button variant="outline" type="button">Facebook</Button>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            No account? <Link to="/register" className="text-brand font-semibold hover:underline">Create one</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
