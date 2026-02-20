import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";
import { stripe, assertStripeConfigured } from "@/lib/stripe";

export async function POST(req: Request) {
  const user = await requireUser();
  const supabase = supabaseServer();

  // Ensure credits row exists (even if Stripe not configured yet)
  await supabase.from("credits").upsert({ user_id: user.id });

  try {
    assertStripeConfigured();
    const priceId = process.env.STRIPE_CREDITS_PRICE_ID;
    if (!priceId) throw new Error("Missing STRIPE_CREDITS_PRICE_ID");

    const { data: sub } = await supabase.from("subscriptions").select("stripe_customer_id").eq("user_id", user.id).maybeSingle();
    let customerId = sub?.stripe_customer_id || null;

    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email ?? undefined, metadata: { userId: user.id } });
      customerId = customer.id;
      await supabase.from("subscriptions").upsert({ user_id: user.id, stripe_customer_id: customerId, plan: "free" });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/app/billing?credits=1`,
      cancel_url: `${appUrl}/app/billing?canceled=1`,
      metadata: { userId: user.id, type: "credits", creditsAdded: "100" }
    });

    return NextResponse.redirect(session.url!, 303);
  } catch (e: any) {
    return NextResponse.json({ ok: true, note: "Credits row ensured. Stripe not configured yet.", error: e.message }, { status: 200 });
  }
}
