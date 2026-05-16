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

  const key = `videos/${session.user.id}/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  // Public URL for viewing (assuming the bucket is public or has a CDN)
  // For R2, this is usually https://<account_id>.r2.cloudflarestorage.com/<bucket>/<key>
  // But often users use a custom domain. We'll return the Key and the upload URL.
  return { uploadUrl: url, key };
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
