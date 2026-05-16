import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Plus, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { CreateProjectDialog } from "@/components/dashboard/create-project-dialog";
import { ProjectList } from "@/components/dashboard/project-list";
import { signOutAction } from "@/lib/actions";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const projects = await db.project.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-muted/20 font-sans">
      <header className="bg-background border-b h-16 flex items-center justify-between px-8 sticky top-0 z-10 backdrop-blur-md bg-background/80">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-black text-2xl tracking-tighter text-primary">AceBoard</Link>
          <nav className="text-sm font-semibold flex gap-6">
            <Link href="/dashboard" className="text-foreground transition-colors">Projects</Link>
            <Link href="/dashboard/settings" className="text-muted-foreground hover:text-foreground transition-colors">Settings</Link>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <p className="text-xs font-bold leading-tight">
              {session.user?.name || "Editor"}
            </p>
            <p className="text-[10px] text-muted-foreground leading-tight">
              {session.user?.email}
            </p>
          </div>
          <form action={signOutAction}>
            <Button variant="outline" size="sm" className="font-bold">Sign out</Button>
          </form>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-1">Your Projects</h1>
            <p className="text-muted-foreground font-medium">Manage your video reviews and client feedback.</p>
          </div>
          <CreateProjectDialog />
        </div>

        {projects.length > 0 ? (
          <ProjectList projects={projects as any} />
        ) : (
          /* Empty State */
          <div className="bg-background border-2 border-dashed border-muted-foreground/20 rounded-3xl p-24 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="bg-primary/10 p-6 rounded-3xl mb-6 ring-1 ring-primary/20">
              <Video className="w-16 h-16 text-primary" />
            </div>
            <h2 className="text-2xl font-black mb-3">No projects found</h2>
            <p className="text-muted-foreground max-w-sm mb-10 font-medium">
              Ready to streamline your feedback loop? Upload your first video and share it with a client today.
            </p>
            <CreateProjectDialog>
              <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-7 rounded-2xl font-black text-lg shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95">
                <Plus className="w-6 h-6 stroke-[3px]" /> Create Project
              </Button>
            </CreateProjectDialog>
          </div>
        )}
      </main>
    </div>
  );
}
