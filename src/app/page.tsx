import Image from "next/image";
import logo from "@/assets/logo.png";
import { SparklesCore } from "@/components/ui/sparkles";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex h-screen w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-lg bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
        <Image
          src={logo}
          alt="logo"
          width={150}
          height={150}
        />
        <h1 className="relative z-20 bg-gradient-to-b from-white to-gray-300 bg-clip-text text-center text-4xl font-extrabold text-transparent md:text-8xl lg:text-7xl">
          Create a Resume{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">
            with AI
          </span>{" "}
          <div className="bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
            in Minutes
          </div>
          <p className="mt-4 text-lg text-gray-400">
            Our AI resume builder is a tool that helps you create a resume with
            AI.
          </p>
        </h1>
        <Link href="/resumes">
          <Button className="relative p-[3px] shadow-lg">
            <div className="absolute inset-0 transform rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 transition-transform duration-300 group-hover:scale-105" />
            <div className="group relative gap-8 rounded-[6px] px-10 py-3 text-white transition duration-200 hover:bg-transparent">
              Get Started
            </div>
          </Button>
        </Link>
        <div className="relative mt-8 h-48 w-[45rem]">
          {/* Gradients */}
          <div className="absolute inset-x-10 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent blur-md" />
          <div className="absolute inset-x-10 top-0 h-px w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
          <div className="absolute inset-x-40 top-0 h-[5px] w-1/2 bg-gradient-to-r from-transparent via-sky-500 to-transparent blur-md" />
          <div className="absolute inset-x-40 top-0 h-px w-1/2 bg-gradient-to-r from-transparent via-sky-500 to-transparent" />

          {/* Core component */}
          <SparklesCore
            background="transparent"
            minSize={0.5}
            maxSize={1.5}
            particleDensity={1500}
            className="h-full w-full"
            particleColor="#FFFFFF"
          />

          {/* Radial Gradient to prevent sharp edges */}
          <div className="absolute inset-0 h-full w-full bg-black [mask-image:radial-gradient(400px_250px_at_top,transparent_20%,white)]"></div>
        </div>
      </div>
    </>
  );
}
