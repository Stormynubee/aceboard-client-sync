import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ReviewClient } from "@/components/review/review-client";
import { Navbar } from "@/components/shared/navbar";

interface ReviewPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { projectId } = await params;

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      comments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-24">
        <ReviewClient project={project as any} />
      </main>
    </div>
  );
}
