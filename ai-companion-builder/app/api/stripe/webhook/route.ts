import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Missing webhook secret" }, { status: 400 });
  }

  const rawBody = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
  }

  // Use service role to update subscriptions/credits
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const userId = session?.metadata?.userId;

      if (session.mode === "subscription") {
        // Subscription created
        const subId = session.subscription;
        const customerId = session.customer;

        // Fetch subscription for period end + status
        const sub = await stripe.subscriptions.retrieve(subId);
        await supabase.from("subscriptions").upsert({
          user_id: userId,
          stripe_customer_id: customerId,
          stripe_subscription_id: subId,
          status: sub.status,
          plan: "premium",
          current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString()
        });
      }

      if (session.mode === "payment" && session?.metadata?.type === "credits") {
        const creditsAdded = Number(session?.metadata?.creditsAdded ?? 100);
        const amountCents = Number(session.amount_total ?? 0);
        const paymentIntent = session.payment_intent;

        // Update credits balance
        const { data: existing } = await supabase.from("credits").select("balance").eq("user_id", userId).maybeSingle();
        const balance = (existing?.balance ?? 0) + creditsAdded;

        await supabase.from("credits").upsert({ user_id: userId, balance, updated_at: new Date().toISOString() });

        await supabase.from("credit_purchases").insert({
          user_id: userId,
          stripe_payment_intent_id: paymentIntent,
          credits_added: creditsAdded,
          amount_cents: amountCents
        });
      }
    }

    if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      const sub = event.data.object as any;
      const customerId = sub.customer as string;
      // Find user by customer
      const { data: row } = await supabase.from("subscriptions").select("user_id").eq("stripe_customer_id", customerId).maybeSingle();
      if (row?.user_id) {
        await supabase.from("subscriptions").update({
          status: sub.status,
          plan: sub.status === "active" ? "premium" : "free",
          current_period_end: sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null,
          updated_at: new Date().toISOString()
        }).eq("user_id", row.user_id);
      }
    }

    return NextResponse.json({ received: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Webhook handler error" }, { status: 500 });
  }
}
