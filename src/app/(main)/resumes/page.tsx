import prisma from "@/lib/prisma";
import { resumeDataInclude } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import ResumeItem from "./ResumeItem";
import CreateResumeButton from "./CreateResumeButton";
import { getUserSubscriptionLevel } from "@/lib/subscriptions";
import { canCreateResume } from "@/lib/permissions";

export const metadata: Metadata = {
  title: "Your Resumes",
  description: "Your Resumes",
};

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const [resumes, totalCount, subscriptionLevel] = await Promise.all([
    prisma.resume.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: resumeDataInclude,
    }),
    prisma.resume.count({
      where: {
        userId,
      },
    }),
    getUserSubscriptionLevel(userId),
  ]);


  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-3 py-6">
      <div>
        <CreateResumeButton
          canCreate={canCreateResume(subscriptionLevel, totalCount)}
        />
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Your Resumes</h1>
          <p className="">
            {totalCount} {totalCount === 1 ? "Resume" : "Resumes"}
          </p>
        </div>
        <div className="flex grid-cols-2 flex-col gap-3 sm:grid md:grid-cols-3 lg:grid-cols-4">
          {resumes.map((resume) => (
            <ResumeItem key={resume.id} resume={resume} />
          ))}
        </div>
      </div>
    </main>
  );
}
