import Link from "next/link";
import Nav from "@/components/Nav";
import { Container, Card, Button, Badge } from "@/components/ui";

export default function Home() {
  return (
    <>
      <Nav />
      <Container>
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-4">
            <Badge>Romance (not explicit) • Safe companion</Badge>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              Build your ideal <span className="text-violet-400">AI companion</span>—a virtual partner that feels personal.
            </h1>
            <p className="text-zinc-300 leading-relaxed">
              Create appearance + personality, chat in a cozy interface, and grow relationship levels over time.
              Photo generation is placeholder-only in this MVP.
            </p>
            <div className="flex gap-3">
              <Link href="/signup"><Button>Get started</Button></Link>
              <Link href="/pricing"><Button variant="secondary">View pricing</Button></Link>
            </div>
            <p className="text-xs text-zinc-400">
              Safety: romance is allowed; explicit sexual content and anything involving minors is not.
            </p>
          </div>

          <Card className="p-6">
            <div className="space-y-4">
              <div className="text-sm text-zinc-300">Preview</div>
              <div className="glass p-4">
                <div className="text-xs text-zinc-400 mb-2">Companion</div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Nova</div>
                    <div className="text-xs text-zinc-400">Level: Friend</div>
                  </div>
                  <div className="h-10 w-10 rounded-2xl bg-violet-500/20 border border-violet-500/30" />
                </div>
              </div>
              <div className="glass p-4 space-y-2">
                <div className="text-xs text-zinc-400">Chat</div>
                <div className="text-sm"><span className="text-zinc-400">You:</span> Hey, how was your day?</div>
                <div className="text-sm"><span className="text-violet-300">Nova:</span> Better now that you’re here. Want to tell me one good thing that happened?</div>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </>
  );
}
