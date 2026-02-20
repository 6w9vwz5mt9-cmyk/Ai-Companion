import Link from "next/link";
import Nav from "@/components/Nav";
import { Container, Card, Button, Badge } from "@/components/ui";

export default function Pricing() {
  return (
    <>
      <Nav />
      <Container>
        <div className="space-y-6">
          <div className="space-y-2">
            <Badge>Launch pricing</Badge>
            <h1 className="text-3xl font-semibold">Pricing</h1>
            <p className="text-zinc-300">Start free. Upgrade for unlimited chats and premium features.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <h3 className="font-semibold">Free</h3>
              <p className="text-zinc-300 mt-1">€0 / month</p>
              <ul className="mt-4 text-sm text-zinc-300 space-y-2">
                <li>• Limited chats</li>
                <li>• Starter credits (20)</li>
                <li>• Relationship progression</li>
              </ul>
              <div className="mt-5">
                <Link href="/signup"><Button variant="secondary" className="w-full">Start free</Button></Link>
              </div>
            </Card>

            <Card className="border-violet-500/30">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Premium</h3>
                <Badge>Best</Badge>
              </div>
              <p className="text-zinc-300 mt-1">€19.99 / month</p>
              <ul className="mt-4 text-sm text-zinc-300 space-y-2">
                <li>• Unlimited chats</li>
                <li>• More photo placeholders</li>
                <li>• Faster responses</li>
                <li>• Memory features (coming soon)</li>
              </ul>
              <div className="mt-5 space-y-2">
                <Link href="/signup"><Button className="w-full">Get Premium</Button></Link>
                <p className="text-xs text-zinc-400">Billing is handled securely by Stripe.</p>
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold">Credits</h3>
              <p className="text-zinc-300 mt-1">100 credits • €6.99</p>
              <ul className="mt-4 text-sm text-zinc-300 space-y-2">
                <li>• Use credits for photos + special interactions</li>
                <li>• Photo placeholders cost 5 credits</li>
              </ul>
              <div className="mt-5">
                <Link href="/signup"><Button variant="secondary" className="w-full">Buy credits</Button></Link>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </>
  );
}
