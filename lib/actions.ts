"use server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { s3Client, BUCKET_NAME } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const CreateProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  videoUrl: z.string().url("Valid video URL is required"),
});

const UpdateProjectSchema = CreateProjectSchema.partial();

export async function getPresignedUrl(fileName: string, contentType: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const timestamp = Date.now();
  const key = `videos/${session.user.id}/${timestamp}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  // Use environment variable for public base URL or fallback to the endpoint
  const publicBaseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || process.env.R2_ENDPOINT;
  const finalUrl = `${publicBaseUrl}/${key}`;

  return { uploadUrl, finalUrl, key };
}

export async function createProject(formData: z.infer<typeof CreateProjectSchema>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

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

export async function updateProject(id: string, formData: z.infer<typeof UpdateProjectSchema>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const data = UpdateProjectSchema.parse(formData);

  const project = await db.project.update({
    where: { id, userId: session.user.id },
    data,
  });

  revalidatePath("/dashboard");
  return project;
}

export async function deleteProject(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.project.delete({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/dashboard");
}

export async function addComment(projectId: string, text: string, timestamp: string, author: string) {
  const comment = await db.comment.create({
    data: {
      projectId,
      text,
      timestamp,
      author,
    },
  });

  revalidatePath(`/review/${projectId}`);
  return comment;
}

import { signOut as nextAuthSignOut } from "@/auth";

export async function signOutAction() {
  await nextAuthSignOut({ redirectTo: "/" });
}
