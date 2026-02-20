import { Container, Card, Button, Badge } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";
import { CompanionCard } from "@/components/CompanionCard";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await requireUser();
  const supabase = supabaseServer();

  const { data: companions } = await supabase
    .from("companions")
    .select("id,name,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);

  const companion = companions?.[0] ?? null;

  const { data: creditsRow } = await supabase.from("credits").select("balance").eq("user_id", user.id).maybeSingle();
  const credits = creditsRow?.balance ?? 0;

  let level = "Stranger";
  if (companion) {
    const { data: rel } = await supabase
      .from("relationship_progress")
      .select("level")
      .eq("user_id", user.id)
      .eq("companion_id", companion.id)
      .maybeSingle();
    level = rel?.level ?? "Stranger";
  }

  return (
    <Container>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-sm text-zinc-300">Your companion experience, in one place.</p>
          </div>
          <Link href="/app/companion/create"><Button variant="secondary">New companion</Button></Link>
        </div>

        <CompanionCard companion={companion} level={level} credits={credits} />

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <div className="text-sm text-zinc-400">Relationship</div>
            <div className="mt-2 text-lg font-semibold">{level}</div>
            <p className="mt-2 text-sm text-zinc-300">Levels grow with messages + interactions.</p>
          </Card>

          <Card>
            <div className="text-sm text-zinc-400">Photo placeholders</div>
            <div className="mt-2 flex items-center gap-2">
              <Badge>Cost: 5 credits</Badge>
              <Badge>No real images yet</Badge>
            </div>
            <p className="mt-2 text-sm text-zinc-300">We store placeholders now; real generation can be added later.</p>
          </Card>

          <Card>
            <div className="text-sm text-zinc-400">Premium</div>
            <div className="mt-2 text-lg font-semibold">€19.99 / month</div>
            <p className="mt-2 text-sm text-zinc-300">Unlimited chats + upgrades.</p>
            <div className="mt-4">
              <Link href="/app/billing"><Button>Upgrade</Button></Link>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
}
