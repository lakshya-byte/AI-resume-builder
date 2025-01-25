"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export async function deleteResume(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Find the resume to delete
  const resume = await prisma.resume.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!resume) {
    throw new Error("Resume not found");
  }

  // Delete associated photo if it exists
  if (resume.photoUrl) {
    try {
      await del(resume.photoUrl);
    } catch (error) {
      console.error("Failed to delete photo from storage:", error);
      throw new Error("Failed to delete associated photo.");
    }
  }

  // Delete associated records
  await prisma.workExperience.deleteMany({
    where: { resumeId: id },
  });
  await prisma.education.deleteMany({
    where: { resumeId: id },
  });

  // Delete the resume
  await prisma.resume.delete({
    where: {
      id,
    },
  });

  // Revalidate the resumes path
  revalidatePath("/resumes");
}
