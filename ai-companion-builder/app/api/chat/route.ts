import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";
import { isExplicit, safeAssistantRefusal } from "@/lib/safeContent";
import { levelForMessages } from "@/lib/relationship";

function cannedReply(userText: string) {
  const prompts = [
    "Tell me one thing you’d love to do together this week.",
    "What’s a small moment today that made you smile?",
    "If I could send you a little note right now, what would you want it to say?",
    "I’m here—slow breaths. Want comfort or a distraction?",
    "I like learning your world. What’s your favorite song lately?"
  ];
  const pick = prompts[Math.floor(Math.random() * prompts.length)];
  return `Mmm… I’m really glad you told me that. ${pick}`;
}

export async function POST(req: Request) {
  const user = await requireUser();
  const supabase = supabaseServer();
  const body = await req.json().catch(()=>null);

  const companionId = String(body?.companionId ?? "");
  const content = String(body?.content ?? "").slice(0, 2000);
  if (!companionId || !content) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  // Verify companion belongs to user
  const { data: companion } = await supabase
    .from("companions")
    .select("id,name")
    .eq("id", companionId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!companion) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Store user message
  await supabase.from("messages").insert({ user_id: user.id, companion_id: companionId, role: "user", content });

  // Relationship progression: increment messages_sent
  const { data: rel } = await supabase
    .from("relationship_progress")
    .select("messages_sent")
    .eq("user_id", user.id)
    .eq("companion_id", companionId)
    .maybeSingle();

  const messagesSent = (rel?.messages_sent ?? 0) + 1;
  const newLevel = levelForMessages(messagesSent);

  await supabase.from("relationship_progress").upsert({
    user_id: user.id,
    companion_id: companionId,
    messages_sent: messagesSent,
    level: newLevel,
    updated_at: new Date().toISOString()
  });

  // Generate assistant reply
  const reply = isExplicit(content) ? safeAssistantRefusal() : cannedReply(content);

  await supabase.from("messages").insert({ user_id: user.id, companion_id: companionId, role: "assistant", content: reply });

  return NextResponse.json({ reply, level: newLevel });
}
