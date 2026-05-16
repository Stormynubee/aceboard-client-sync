"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CreateProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  videoUrl: z.string().url("Valid video URL is required"),
});

export async function createProject(formData: z.infer<typeof CreateProjectSchema>) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const { title, description, videoUrl } = CreateProjectSchema.parse(formData);

  const project = await db.project.create({
    data: {
      title,
      description,
      videoUrl,
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard");
  return project;
}
