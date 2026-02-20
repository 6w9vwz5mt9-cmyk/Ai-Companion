"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import { Container, Card, Button, Input } from "@/components/ui";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const next = useSearchParams().get("next") || "/app/dashboard";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setError(error.message);
    window.location.href = next;
  }

  return (
    <>
      <Nav />
      <Container>
        <div className="max-w-md mx-auto">
          <Card>
            <h1 className="text-xl font-semibold">Login</h1>
            <p className="text-sm text-zinc-300 mt-1">Welcome back.</p>

            <form onSubmit={onSubmit} className="mt-5 space-y-3">
              <Input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
              <Input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
              {error && <div className="text-sm text-red-300">{error}</div>}
              <Button disabled={loading} className="w-full">{loading ? "Signing in..." : "Sign in"}</Button>
            </form>

            <p className="text-sm text-zinc-300 mt-4">
              No account? <Link className="text-violet-300" href="/signup">Sign up</Link>
            </p>
          </Card>
        </div>
      </Container>
    </>
  );
}
