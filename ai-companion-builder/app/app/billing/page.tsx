import { Container, Card, Button, Badge } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import Link from "next/link";

export default async function BillingPage({ searchParams }: { searchParams: Record<string,string|undefined> }) {
  await requireUser();
  const reason = searchParams.reason;

  return (
    <Container>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold">Billing</h1>
          <p className="text-sm text-zinc-300">Upgrade or buy credits. Secure payments via Stripe.</p>
        </div>

        {reason === "credits" && (
          <Card className="border-red-500/30">
            <div className="font-semibold">Not enough credits</div>
            <p className="text-sm text-zinc-300 mt-1">Buy more credits to generate photo placeholders.</p>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Premium</h3>
              <Badge>€19.99 / month</Badge>
            </div>
            <p className="text-sm text-zinc-300 mt-2">Unlimited chats and premium features (MVP-ready).</p>
            <form action="/api/billing/checkout" method="post" className="mt-4">
              <Button type="submit">Upgrade with Stripe</Button>
            </form>
            <p className="text-xs text-zinc-400 mt-3">
              Requires Stripe env vars on Vercel. If not set, you’ll see a friendly error.
            </p>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Credits pack</h3>
              <Badge>100 credits • €6.99</Badge>
            </div>
            <p className="text-sm text-zinc-300 mt-2">Use credits for photos + special interactions.</p>
            <form action="/api/credits/checkout" method="post" className="mt-4">
              <Button type="submit" variant="secondary">Buy credits</Button>
            </form>
          </Card>
        </div>

        <Link href="/app/dashboard"><Button variant="ghost">Back to dashboard</Button></Link>
      </div>
    </Container>
  );
}
