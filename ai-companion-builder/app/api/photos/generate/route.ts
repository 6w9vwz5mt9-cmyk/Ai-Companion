import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";
import { PHOTO_COST, canAfford } from "@/lib/credits";
import { levelForMessages } from "@/lib/relationship";

export async function POST(req: Request) {
  const user = await requireUser();
  const supabase = supabaseServer();

  // Supports both form posts and JSON
  const ct = req.headers.get("content-type") || "";
  let companionId = "";
  if (ct.includes("application/json")) {
    const body = await req.json().catch(()=>null);
    companionId = String(body?.companionId ?? "");
  } else {
    const form = await req.formData().catch(()=>null);
    companionId = String(form?.get("companionId") ?? "");
  }

  if (!companionId) return NextResponse.json({ error: "Missing companionId" }, { status: 400 });

  // Verify ownership
  const { data: companion } = await supabase
    .from("companions")
    .select("id")
    .eq("id", companionId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!companion) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Check credits
  const { data: creditsRow } = await supabase.from("credits").select("balance").eq("user_id", user.id).maybeSingle();
  const balance = creditsRow?.balance ?? 0;

  if (!canAfford(balance, PHOTO_COST)) {
    return NextResponse.redirect(new URL("/app/billing?reason=credits", req.url), 303);
  }

  // Deduct credits
  await supabase.from("credits").update({ balance: balance - PHOTO_COST, updated_at: new Date().toISOString() }).eq("user_id", user.id);

  // Create placeholder photo record
  await supabase.from("photos").insert({
    user_id: user.id,
    companion_id: companionId,
    image_url: null,
    prompt: "A romantic, non-explicit moment together (placeholder)"
  });

  // Progress relationship a bit
  const { data: rel } = await supabase
    .from("relationship_progress")
    .select("messages_sent,photo_requests,interactions")
    .eq("user_id", user.id)
    .eq("companion_id", companionId)
    .maybeSingle();

  const messagesSent = rel?.messages_sent ?? 0;
  const photoRequests = (rel?.photo_requests ?? 0) + 1;
  const interactions = (rel?.interactions ?? 0) + 1;
  const level = levelForMessages(messagesSent);

  await supabase.from("relationship_progress").upsert({
    user_id: user.id,
    companion_id: companionId,
    messages_sent: messagesSent,
    photo_requests: photoRequests,
    interactions,
    level,
    updated_at: new Date().toISOString()
  });

  return NextResponse.redirect(new URL("/app/gallery", req.url), 303);
}
