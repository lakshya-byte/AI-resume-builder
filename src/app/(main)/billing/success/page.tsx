import { Button } from "@/components/ui/button";

import Link from "next/link";

export default function Page() {
  return (
    <main className="max-w-7xl mx-auto space-y-6 px-3 py-6 text-center">
      <h1 className="text-3xl font-bold">Thank you for your purchase!</h1>
      <p className="text-sm text-muted-foreground">
        Your payment has been successfully processed. You can now access all the
        features of the Premium plan.
      </p>
      <Button asChild>
        <Link href="/resumes">Go to Dashboard</Link>
      </Button>
    </main>
  );
}
