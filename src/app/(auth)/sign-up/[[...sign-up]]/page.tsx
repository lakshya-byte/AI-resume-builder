import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return <main className="flex justify-center items-center h-screen p-3">
    <SignUp />
  </main>;
}
