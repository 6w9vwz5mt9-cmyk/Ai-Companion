import Link from "next/link";
import { Card, Button, Badge } from "./ui";

export function CompanionCard({
  companion,
  level,
  credits
}: {
  companion: { id: string; name: string } | null;
  level: string;
  credits: number;
}) {
  if (!companion) {
    return (
      <Card>
        <h3 className="font-semibold">No companion yet</h3>
        <p className="text-sm text-zinc-300 mt-1">Create your first companion in under a minute.</p>
        <div className="mt-4">
          <Link href="/app/companion/create"><Button>Create companion</Button></Link>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-zinc-400">Your companion</div>
          <div className="text-xl font-semibold">{companion.name}</div>
          <div className="mt-2 flex gap-2">
            <Badge>Level: {level}</Badge>
            <Badge>Credits: {credits}</Badge>
          </div>
        </div>
        <div className="h-12 w-12 rounded-2xl bg-violet-500/20 border border-violet-500/30" />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link href={`/app/chat/${companion.id}`}><Button>Chat</Button></Link>
        <Link href="/app/gallery"><Button variant="secondary">Gallery</Button></Link>
        <Link href="/app/billing"><Button variant="ghost">Upgrade</Button></Link>
      </div>
    </Card>
  );
}
