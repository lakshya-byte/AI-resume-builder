import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  FileUserIcon,
  PenLineIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import { steps } from "./steps";
import { cn } from "@/lib/utils";

interface FooterProps {
  currentStep: string;
  setCurrentStep: (step: string) => void;
  showSmResumePreview: boolean;
  setShowSmResumePreview: (show: boolean) => void;
  isSaving: boolean;
}

export function Footer({
  currentStep,
  setCurrentStep,
  showSmResumePreview,
  setShowSmResumePreview,
  isSaving,
}: FooterProps) {
  const previousStep = steps.find(
    (_, index) => steps[index + 1]?.key === currentStep,
  )?.key;

  const nextStep = steps.find(
    (_, index) => steps[index - 1]?.key === currentStep,
  )?.key;

  return (
    <>
      <footer className="w-full border-t px-3 py-5">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              onClick={
                previousStep ? () => setCurrentStep(previousStep) : undefined
              }
              variant="outline"
              disabled={!previousStep}
            >
              <ArrowLeft />
              <span>Previous step</span>
            </Button>
            <Button
              onClick={nextStep ? () => setCurrentStep(nextStep) : undefined}
              disabled={!nextStep}
            >
              Next Step
              <ArrowRight />
            </Button>
          </div>
          <Button
            className="md:hidden"
            variant="outline"
            onClick={() => setShowSmResumePreview(!showSmResumePreview)}
            title={
              showSmResumePreview
                ? "show input form"
                : "show resume preview"
            }
          >
            {showSmResumePreview ? <PenLineIcon /> : <FileUserIcon />}
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="destructive" asChild>
              <Link href="/resumes">
                <X />
                Close
              </Link>
            </Button>
            <p className={cn("opacity-0 text-muted-foreground", isSaving && "animate-pulse opacity-100")}>Saving...</p>
          </div>
        </div>
      </footer>
    </>
  );
}
