import { AuthForm } from "@/components/auth/auth-form";
import { Navbar } from "@/components/shared/navbar";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <AuthForm type="login" />
      </div>
    </div>
  );
}
