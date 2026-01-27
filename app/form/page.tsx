import N400Form from "@/components/n400-form";
import { AuthGate } from "@/components/auth-gate";

export default function FormPage() {
  return (
    <AuthGate>
      <N400Form />
    </AuthGate>
  );
}
