import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — Bazaar" }, { name: "description", content: "Join Bazaar and shop 100k+ products" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <form onSubmit={(e) => { e.preventDefault(); toast.success("Account created — verify your email"); }} className="rounded-3xl border bg-card p-8">
        <h1 className="text-3xl font-black">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Join millions of shoppers on Bazaar</p>
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>First name</Label><Input required /></div>
            <div><Label>Last name</Label><Input required /></div>
          </div>
          <div><Label>Email</Label><Input required type="email" /></div>
          <div><Label>Phone</Label><Input required type="tel" placeholder="+8801XXXXXXXXX" /></div>
          <div><Label>Password</Label><Input required type="password" /></div>
          <label className="flex items-start gap-2 text-xs text-muted-foreground">
            <input type="checkbox" required className="mt-0.5" />
            <span>I agree to Bazaar's <Link to="/terms" className="text-brand">Terms</Link> and <Link to="/privacy" className="text-brand">Privacy Policy</Link></span>
          </label>
          <Button size="lg" className="w-full">Create account</Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-brand font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
