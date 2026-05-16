import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/auth";

export async function Navbar() {
  const session = await auth();

  return (
    <header className="fixed top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-xl tracking-tight">
            AceBoard
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
          <Link href="/review/demo" className="hover:text-primary transition-colors">Demo</Link>
        </nav>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <form action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}>
                <Button size="sm">Sign Out</Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
