"use client";

import { useMemo, useState } from "react";
import { Card, Button, Input, Badge } from "./ui";

type Step = 1|2|3|4;

const TRAITS = ["Warm", "Playful", "Flirty", "Supportive", "Confident", "Calm"] as const;
const INTERESTS = ["Music", "Travel", "Fitness", "Movies", "Food", "Art", "Books", "Gaming"] as const;

export default function BuilderWizard() {
  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState("Nova");
  const [appearance, setAppearance] = useState({ hair: "Dark", style: "Modern", vibe: "Soft glow" });
  const [traits, setTraits] = useState<string[]>(["Warm", "Playful"]);
  const [interests, setInterests] = useState<string[]>(["Music", "Movies"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string| null>(null);

  const canNext = useMemo(() => {
    if (step === 4) return name.trim().length >= 2;
    return true;
  }, [step, name]);

  async function save() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/companion/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        appearance,
        personality: { traits },
        interests
      })
    });
    const j = await res.json().catch(()=>({}));
    setLoading(false);
    if (!res.ok) return setError(j.error || "Failed to save.");
    window.location.href = "/app/dashboard";
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Create your companion</h1>
        <Badge>Step {step}/4</Badge>
      </div>

      <div className="mt-5 space-y-4">
        {step === 1 && (
          <div className="space-y-3">
            <div className="text-sm text-zinc-300">Choose appearance</div>
            <div className="grid gap-3 md:grid-cols-3">
              <Input value={appearance.hair} onChange={e=>setAppearance(a=>({ ...a, hair: e.target.value }))} placeholder="Hair (e.g. Dark)" />
              <Input value={appearance.style} onChange={e=>setAppearance(a=>({ ...a, style: e.target.value }))} placeholder="Style (e.g. Modern)" />
              <Input value={appearance.vibe} onChange={e=>setAppearance(a=>({ ...a, vibe: e.target.value }))} placeholder="Vibe (e.g. Soft glow)" />
            </div>
            <p className="text-xs text-zinc-400">This is cosmetic metadata for now (safe + neutral).</p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <div className="text-sm text-zinc-300">Pick personality traits</div>
            <div className="flex flex-wrap gap-2">
              {TRAITS.map(t => {
                const on = traits.includes(t);
                return (
                  <button
                    key={t}
                    onClick={()=>setTraits(prev => on ? prev.filter(x=>x!==t) : [...prev, t])}
                    className={"rounded-full px-3 py-1.5 text-sm border transition " + (on ? "bg-violet-600/30 border-violet-500/40" : "bg-white/5 border-white/10 hover:bg-white/10")}
                    type="button"
                  >
                    {t}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-zinc-400">Romance-friendly, but not explicit. Boundaries are enforced.</p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <div className="text-sm text-zinc-300">Choose interests</div>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map(i => {
                const on = interests.includes(i);
                return (
                  <button
                    key={i}
                    onClick={()=>setInterests(prev => on ? prev.filter(x=>x!==i) : [...prev, i])}
                    className={"rounded-full px-3 py-1.5 text-sm border transition " + (on ? "bg-violet-600/30 border-violet-500/40" : "bg-white/5 border-white/10 hover:bg-white/10")}
                    type="button"
                  >
                    {i}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3">
            <div className="text-sm text-zinc-300">Name your companion</div>
            <Input value={name} onChange={e=>setName(e.target.value)} placeholder="Companion name" />
            <p className="text-xs text-zinc-400">You can create multiple companions later.</p>
          </div>
        )}

        {error && <div className="text-sm text-red-300">{error}</div>}

        <div className="mt-6 flex items-center justify-between">
          <Button variant="ghost" onClick={()=>setStep(s=> (s>1 ? (s-1) as Step : s))} disabled={step===1 || loading}>
            Back
          </Button>
          {step < 4 ? (
            <Button onClick={()=>setStep(s=> (s<4 ? (s+1) as Step : s))} disabled={!canNext || loading}>
              Next
            </Button>
          ) : (
            <Button onClick={save} disabled={!canNext || loading}>
              {loading ? "Saving..." : "Finish"}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
