import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import Stripe from "stripe";
import { GetSubscriptionButton } from "./GetSubscriptionButton";
import { ManageSubscriptionButton } from "./ManageSubscriptionButton";
import { formatDate } from "date-fns";

export const metadata: Metadata = {
  title: "Billing",
  description: "Billing page",
};

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const subscription = await prisma.userSubscription.findUnique({
    where: {
      userId,
    },
  });

  const priceInfo = subscription
    ? await stripe.prices.retrieve(subscription.stripePriceId, {
        expand: ["product"],
      })
    : null;

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center space-y-6 px-3 py-6">
      <h1 className="text-3xl font-bold">Billing</h1>
      <p className="flex flex-col">
        Your current plan is{" "}
        {priceInfo ? (priceInfo?.product as Stripe.Product).name : "Free"}
      </p>
      {subscription ? (
        <>
          {subscription.stripeCancelAtPeriodEnd && (
            <p className="text-destructive">
              Your subscription will end on{" "}
              {formatDate(subscription.stripeCurrentPeriodEnd, "MMM dd, yyyy")}
            </p>
          )}
          <ManageSubscriptionButton />
        </>
      ) : (
        <GetSubscriptionButton />
      )}
    </main>
  );
}
