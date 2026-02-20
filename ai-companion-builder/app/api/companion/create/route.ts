import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await requireUser();
  const supabase = supabaseServer();
  const body = await req.json().catch(()=>null);

  if (!body?.name) return NextResponse.json({ error: "Missing name" }, { status: 400 });

  const { data: companion, error } = await supabase.from("companions").insert({
    user_id: user.id,
    name: String(body.name).slice(0, 40),
    appearance: body.appearance ?? {},
    personality: body.personality ?? {},
    interests: Array.isArray(body.interests) ? body.interests : []
  }).select("id").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Seed relationship row
  await supabase.from("relationship_progress").upsert({
    user_id: user.id,
    companion_id: companion.id
  });

  // Seed credits row if missing
  await supabase.from("credits").upsert({ user_id: user.id });

  return NextResponse.json({ ok: true, id: companion.id });
}
