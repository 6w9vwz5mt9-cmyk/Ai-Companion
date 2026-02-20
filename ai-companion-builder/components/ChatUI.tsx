"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Input, Card, Badge } from "./ui";
import { isExplicit } from "@/lib/safeContent";

type Msg = { id: string; role: "user"|"assistant"; content: string };

export default function ChatUI({ companionId, companionName, initial }: { companionId: string; companionName: string; initial: Msg[] }) {
  const [msgs, setMsgs] = useState<Msg[]>(initial);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement|null>(null);

  useEffect(()=>{ endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  async function send() {
    const t = text.trim();
    if (!t) return;
    setText("");

    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: t };
    setMsgs(m => [...m, userMsg]);

    setTyping(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companionId, content: t })
    });

    const j = await res.json().catch(()=>({}));
    setTyping(false);

    const reply: Msg = { id: crypto.randomUUID(), role: "assistant", content: j.reply || "…" };
    setMsgs(m => [...m, reply]);
  }

  return (
    <Card className="p-0 overflow-hidden">
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <div className="text-xs text-zinc-400">Chatting with</div>
          <div className="font-semibold">{companionName}</div>
        </div>
        <Badge>Romance-safe</Badge>
      </div>

      <div className="h-[60vh] overflow-y-auto px-5 py-4 space-y-3">
        {msgs.map(m => (
          <div key={m.id} className={"flex " + (m.role==="user" ? "justify-end" : "justify-start")}>
            <div className={
              "max-w-[85%] rounded-2xl px-4 py-2 text-sm border " +
              (m.role==="user"
                ? "bg-violet-600/20 border-violet-500/30"
                : "bg-white/5 border-white/10")
            }>
              <div className="text-xs text-zinc-400 mb-1">{m.role==="user" ? "You" : companionName}</div>
              <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl px-4 py-2 text-sm border bg-white/5 border-white/10">
              <div className="text-xs text-zinc-400 mb-1">{companionName}</div>
              <div className="opacity-80">typing…</div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="px-4 py-4 border-t border-white/10 flex gap-2">
        <Input
          value={text}
          onChange={e=>setText(e.target.value)}
          placeholder="Say something sweet (no explicit content)…"
          onKeyDown={(e)=>{ if (e.key==="Enter") send(); }}
        />
        <Button onClick={send} disabled={typing || !text.trim()}>Send</Button>
      </div>
    </Card>
  );
}
