import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { Plus, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { CreateProjectDialog } from "@/components/dashboard/create-project-dialog";
import { ProjectList } from "@/components/dashboard/project-list";

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
    <div className="min-h-screen bg-muted/20">
      <header className="bg-background border-b h-16 flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-bold text-xl">AceBoard</Link>
          <nav className="text-sm text-muted-foreground flex gap-4">
            <Link href="/dashboard" className="text-foreground font-medium">Projects</Link>
            <Link href="/dashboard/settings" className="hover:text-foreground">Settings</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground hidden sm:block">
            {session.user?.email}
          </p>
          <form action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}>
            <Button variant="ghost" size="sm">Sign out</Button>
          </form>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Your Projects</h1>
            <p className="text-muted-foreground">Manage your video reviews and client feedback.</p>
          </div>
          <CreateProjectDialog />
        </div>

        {projects.length > 0 ? (
          <ProjectList projects={projects} />
        ) : (
          /* Empty State */
          <div className="bg-background border-2 border-dashed rounded-2xl p-24 flex flex-col items-center justify-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Video className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-xl font-bold">No projects yet</h2>
            <p className="text-muted-foreground max-w-sm mt-2">
              Upload your first video to start collecting synced feedback from your clients.
            </p>
            <CreateProjectDialog>
              <Button className="mt-8 gap-2">
                <Plus className="w-4 h-4" /> Create your first project
              </Button>
            </CreateProjectDialog>
          </div>
        )}
      </main>
    </div>
  );
}
