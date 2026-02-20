import { Container } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import BuilderWizard from "@/components/BuilderWizard";

export default async function CreateCompanionPage() {
  await requireUser();
  return (
    <Container>
      <div className="max-w-2xl mx-auto">
        <BuilderWizard />
      </div>
    </Container>
  );
}
