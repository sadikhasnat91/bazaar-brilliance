import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/verify")({
  head: () => ({ meta: [{ title: "Verify — Bazaar" }] }),
  component: VerifyPage,
});

function VerifyPage() {
  const [otp, setOtp] = useState("");
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-3xl border bg-card p-8 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full gradient-brand text-white text-2xl">✉</div>
        <h1 className="mt-4 text-2xl font-black">Verify your email</h1>
        <p className="mt-1 text-sm text-muted-foreground">Enter the 6-digit code we sent to your email</p>
        <div className="mt-6 flex justify-center">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              {Array.from({ length: 6 }).map((_, i) => <InputOTPSlot key={i} index={i} />)}
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button className="mt-6 w-full" onClick={() => { toast.success("Email verified"); }}>Verify</Button>
        <p className="mt-4 text-sm text-muted-foreground">Didn't receive it? <button className="text-brand font-semibold">Resend</button></p>
        <p className="mt-2 text-sm"><Link to="/login" className="text-muted-foreground hover:text-foreground">Back to login</Link></p>
      </div>
    </div>
  );
}
