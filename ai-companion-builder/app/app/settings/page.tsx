import { Container, Card, Badge } from "@/components/ui";
import { requireUser } from "@/lib/auth";

export default async function SettingsPage() {
  const user = await requireUser();
  return (
    <Container>
      <div className="space-y-4 max-w-2xl">
        <h1 className="text-2xl font-semibold">Settings</h1>

        <Card>
          <div className="text-sm text-zinc-400">Account</div>
          <div className="mt-2"><Badge>{user.email}</Badge></div>
          <p className="text-sm text-zinc-300 mt-2">For MVP, settings are minimal.</p>
        </Card>

        <Card>
          <div className="text-sm text-zinc-400">Safety</div>
          <p className="text-sm text-zinc-300 mt-2">
            Romance is allowed. Explicit sexual content and anything involving minors is not allowed.
            The chat includes a basic safety filter and refusal message.
          </p>
        </Card>
      </div>
    </Container>
  );
}
