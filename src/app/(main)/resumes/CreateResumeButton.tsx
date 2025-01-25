"use client";

import { Button } from "@/components/ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";
import { PlusSquare } from "lucide-react";
import Link from "next/link";

interface CreateResumeButtonProps {
  canCreate: boolean;
}

export default function CreateResumeButton({
  canCreate,
}: CreateResumeButtonProps) {
  const premiumModal = usePremiumModal();
  // console.log("CreateResumeButton - canCreate:", canCreate);

  if (canCreate) {
    console.log("CreateResumeButton - User can create a new resume");
    return (
      <Link href="/editor">
        <Button className="mx-auto flex w-fit gap-2">
          <PlusSquare />
          <span>New Resume</span>
        </Button>
      </Link>
    );
  }

 
    // console.log("CreateResumeButton - User cannot create a new resume, opening premium modal");
    return (
      <Button
        className="mx-auto flex w-fit gap-2"
        onClick={() => {
          console.debug("CreateResumeButton - Opening premium modal");
          premiumModal.setOpen(true)
        }}
      >
        <PlusSquare />
        <span>New Resume</span>
      </Button>
    );
  }

