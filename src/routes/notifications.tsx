import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Bazaar" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-black mb-6">Notifications</h1>
      <div className="rounded-2xl border bg-card divide-y">
        {[
          { t: "Order BZ483920 delivered", d: "Enjoy your headphones!", time: "2h ago" },
          { t: "Flash sale starts in 1h", d: "Up to 60% off electronics", time: "5h ago" },
          { t: "Coupon expiring soon", d: "WELCOME10 expires in 2 days", time: "1d ago" },
          { t: "Price drop on your wishlist", d: "SonicWave X7 is now ৳8,990", time: "3d ago" },
        ].map((n, i) => (
          <div key={i} className="flex items-start gap-3 p-4">
            <div className="h-2 w-2 mt-2 rounded-full bg-brand" />
            <div className="flex-1"><p className="font-medium">{n.t}</p><p className="text-sm text-muted-foreground">{n.d}</p></div>
            <span className="text-xs text-muted-foreground shrink-0">{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  ),
});
