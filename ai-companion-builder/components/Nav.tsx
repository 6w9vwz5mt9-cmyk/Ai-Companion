"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui";
import { supabaseBrowser } from "@/lib/supabase/client";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const p = usePathname();
  const active = p === href;
  return (
    <Link href={href} className={"text-sm px-3 py-2 rounded-xl hover:bg-white/5 " + (active ? "bg-white/10 border border-white/10" : "")}>
      {children}
    </Link>
  );
}

export default function Nav({ showAppLinks=false }: { showAppLinks?: boolean }) {
  async function signOut() {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <div className="sticky top-0 z-30 border-b border-white/10 bg-zinc-950/70 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          <span className="text-white">AI</span>{" "}
          <span className="text-violet-400">Companion</span>{" "}
          <span className="text-white/80">Builder</span>
        </Link>

        <div className="flex items-center gap-2">
          {showAppLinks ? (
            <>
              <NavLink href="/app/dashboard">Dashboard</NavLink>
              <NavLink href="/app/gallery">Gallery</NavLink>
              <NavLink href="/app/billing">Billing</NavLink>
              <NavLink href="/app/settings">Settings</NavLink>
              <Button variant="ghost" onClick={signOut}>Sign out</Button>
            </>
          ) : (
            <>
              <NavLink href="/pricing">Pricing</NavLink>
              <NavLink href="/login">Login</NavLink>
              <Link href="/signup"><Button>Get started</Button></Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
