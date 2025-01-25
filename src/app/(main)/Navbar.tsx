"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { UserButton } from "@clerk/nextjs";
import { CreditCard } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { theme } = useTheme();
  return (
    <div className={`shadow-md ${theme === "dark" ? "shadow-gray-800" : ""}`}>
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between p-3 ${
          theme === "dark" ? "bg-transparent" : ""
        }`}
      >
        <Link className="flex items-center gap-2" href="/resumes">
          <Image
            className="rounded-full"
            src={logo}
            alt="logo"
            width={35}
            height={35}
          />
          <span className="text-xl font-bold">AI Resume Builder</span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserButton
            appearance={{
              baseTheme: theme === "dark" ? dark : undefined,
              elements: {
                avatarBox: {
                  width: 35,
                  height: 35,
                },
              },
            }}
          >
            <UserButton.MenuItems>
              <UserButton.Link
                href="/billing"
                label="billing"
                labelIcon={<CreditCard className="size-4" />}
              />
            </UserButton.MenuItems>
          </UserButton>
        </div>
      </div>
    </div>
  );
}
