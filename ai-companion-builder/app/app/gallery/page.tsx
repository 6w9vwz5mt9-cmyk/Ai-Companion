import { Container, Card, Button, Badge } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";
import Link from "next/link";

export default async function GalleryPage() {
  const user = await requireUser();
  const supabase = supabaseServer();

  const { data: companions } = await supabase.from("companions").select("id,name,created_at").eq("user_id", user.id).order("created_at", { ascending: false });
  const companion = companions?.[0] ?? null;

  const { data: photos } = companion
    ? await supabase.from("photos").select("id,created_at,prompt,image_url").eq("user_id", user.id).eq("companion_id", companion.id).order("created_at", { ascending: false }).limit(50)
    : { data: [] as any[] };

  return (
    <Container>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Gallery</h1>
            <p className="text-sm text-zinc-300">Photo placeholders only in this MVP.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/app/dashboard"><Button variant="secondary">Back</Button></Link>
          </div>
        </div>

        {!companion ? (
          <Card>
            <h3 className="font-semibold">Create a companion first</h3>
            <p className="text-sm text-zinc-300 mt-1">Then you’ll see your gallery here.</p>
            <div className="mt-4">
              <Link href="/app/companion/create"><Button>Create companion</Button></Link>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-zinc-400">Companion</div>
                <div className="font-semibold">{companion.name}</div>
              </div>
              <form action="/api/photos/generate" method="post">
                <input type="hidden" name="companionId" value={companion.id} />
                <Button type="submit">Generate placeholder</Button>
              </form>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {(photos ?? []).map(p => (
                <div key={p.id} className="glass p-3">
                  <div className="aspect-[4/5] rounded-xl bg-gradient-to-br from-violet-500/20 to-white/5 border border-white/10 flex items-center justify-center">
                    <Badge>Placeholder</Badge>
                  </div>
                  <div className="mt-2 text-xs text-zinc-400">{new Date(p.created_at).toLocaleString()}</div>
                  <div className="mt-1 text-sm text-zinc-200 line-clamp-2">{p.prompt || "A cute moment together"}</div>
                </div>
              ))}
              {(!photos || photos.length===0) && (
                <div className="text-sm text-zinc-300">No photos yet. Generate one to see it here.</div>
              )}
            </div>
          </Card>
        )}
      </div>
    </Container>
  );
}
