"use client";

// Import necessary hooks and components
import { useSearchParams } from "next/navigation";
import { steps } from "./steps";
import { Breadcrumbs } from "./Breadcrumbs";
import { Footer } from "./Footer";
import { useState } from "react";
import { ResumeValues } from "@/lib/validation";
import { ResumePreviewSection } from "./ResumePreviewSection";
import { cn, mapToResumeValues } from "@/lib/utils";
import { useUnloadWarning } from "@/hooks/useUnloadWarning";
import { useAutoSaveResume } from "./useAutoSaveResume";
import { ResumeServerData } from "@/lib/types";

interface ResumeEditorProps {
  resumeToEdit: ResumeServerData | null;
}

// Main component for the resume editor
export default function ResumeEditor({ resumeToEdit }: ResumeEditorProps) {
  // Retrieve search parameters from the URL
  const searchParams = useSearchParams();

  // Initialize resumeData with an empty object to ensure it is never undefined
  const [resumeData, setResumeData] = useState<ResumeValues>(resumeToEdit ? mapToResumeValues(resumeToEdit) : {});
  const [showSmResumePreview, setShowSmResumePreview] = useState(false);

  const { isSaving, hasUnsavedChanges } = useAutoSaveResume(resumeData);

  useUnloadWarning(hasUnsavedChanges);

  const currentStep = searchParams.get("step") || steps[0].key;

  function setStep(key: string) {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("step", key);
    // Update the browser's history state with the new step
    window.history.pushState(null, "", `?${newSearchParams.toString()}`);
  }

  const FormComponent = steps.find(
    (step) => step.key === currentStep,
  )?.component;

  useUnloadWarning(true);

  return (
    <div className="flex grow flex-col">
      <header className="space-y-1.5 border-b px-3 py-5 text-center">
        <h1 className="text-2xl font-bold">Design Your Resume</h1>
        <p className="text-sm text-muted-foreground">
          Follow the steps below to design your resume. Your resume will be
          generated automatically.
        </p>
      </header>
      <main className="relative grow">
        <div className="absolute bottom-0 top-0 flex w-full">
          {/* Left section with breadcrumbs and form component */}
          <div
            className={cn(
              "w-full space-y-3 overflow-y-auto md:block md:w-1/2",
              showSmResumePreview && "hidden",
            )}
          >
            <Breadcrumbs currentStep={currentStep} setCurrentStep={setStep} />
            {FormComponent && (
              <FormComponent
                resumeData={resumeData}
                setResumeData={setResumeData}
              />
            )}
          </div>
          {/* Divider between left and right sections */}
          <div className="grow md:border-r" />
          {/* Right section, currently a placeholder */}
          <div className="hidden w-1/2 items-center justify-center overflow-y-auto bg-secondary p-3 md:flex">
            <ResumePreviewSection
              resumeData={resumeData}
              setResumeData={setResumeData}
              className={cn(showSmResumePreview && "flex")}
            />
          </div>
        </div>
      </main>
      {/* Footer with navigation controls */}
      <Footer
        showSmResumePreview={showSmResumePreview}
        setShowSmResumePreview={setShowSmResumePreview}
        currentStep={currentStep}
        setCurrentStep={setStep}
        isSaving={isSaving}
      />
    </div>
  );
}
