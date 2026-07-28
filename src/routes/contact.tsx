import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — Bazaar" }, { name: "description", content: "Get in touch with Bazaar Bangladesh." }, { property: "og:url", content: "/contact" }], links: [{ rel: "canonical", href: "/contact" }] }),
  component: () => (
    <div>
      <div className="gradient-hero text-white"><div className="mx-auto max-w-5xl px-4 py-14"><h1 className="text-4xl md:text-5xl font-black">Contact us</h1><p className="mt-3 text-white/85">We're here 24/7 in Bangla and English.</p></div></div>
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-10 md:grid-cols-2">
        <div className="space-y-4">{[{icon:Phone,t:"Call",d:"+880 9666 999 000"},{icon:Mail,t:"Email",d:"support@bazaar.com.bd"},{icon:MapPin,t:"HQ",d:"Level 12, Gulshan Trade Center, Dhaka 1212"}].map(c=>(<div key={c.t} className="flex items-start gap-3 rounded-2xl border bg-card p-4"><div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand"><c.icon className="h-5 w-5"/></div><div><p className="font-semibold">{c.t}</p><p className="text-sm text-muted-foreground">{c.d}</p></div></div>))}</div>
        <form onSubmit={(e)=>{e.preventDefault();toast.success("Message sent");}} className="rounded-2xl border bg-card p-6 space-y-3">
          <div><Label>Name</Label><Input required/></div>
          <div><Label>Email</Label><Input required type="email"/></div>
          <div><Label>Message</Label><Textarea required rows={5}/></div>
          <Button className="w-full">Send message</Button>
        </form>
      </div>
    </div>
  ),
});
