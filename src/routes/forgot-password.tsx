import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot password — Bazaar" }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-3xl border bg-card p-8">
        <h1 className="text-3xl font-black">Forgot password?</h1>
        <p className="mt-1 text-sm text-muted-foreground">We'll send you a reset link</p>
        {sent ? (
          <div className="mt-6 rounded-xl bg-success/10 p-4 text-sm text-success">
            ✓ Reset link sent. Check your inbox.
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); toast.success("Reset link sent"); }} className="mt-6 space-y-4">
            <div><Label>Email</Label><Input required type="email" placeholder="you@example.com" /></div>
            <Button className="w-full">Send reset link</Button>
          </form>
        )}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Remember it? <Link to="/login" className="text-brand font-semibold">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
