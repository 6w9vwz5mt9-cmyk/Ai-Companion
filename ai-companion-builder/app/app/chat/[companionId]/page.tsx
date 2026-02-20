import { Container, Card } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";
import ChatUI from "@/components/ChatUI";

export default async function ChatPage({ params }: { params: { companionId: string } }) {
  const user = await requireUser();
  const supabase = supabaseServer();

  const { data: companion } = await supabase
    .from("companions")
    .select("id,name")
    .eq("id", params.companionId)
    .eq("user_id", user.id)
    .single();

  if (!companion) {
    return (
      <Container>
        <Card>
          <h1 className="font-semibold">Companion not found</h1>
          <p className="text-sm text-zinc-300 mt-2">Create a companion first.</p>
        </Card>
      </Container>
    );
  }

  const { data: messages } = await supabase
    .from("messages")
    .select("id,role,content,created_at")
    .eq("user_id", user.id)
    .eq("companion_id", companion.id)
    .order("created_at", { ascending: true })
    .limit(200);

  const initial = (messages ?? []).map(m => ({ id: m.id, role: m.role as any, content: m.content }));

  return (
    <Container>
      <ChatUI companionId={companion.id} companionName={companion.name} initial={initial} />
    </Container>
  );
}
