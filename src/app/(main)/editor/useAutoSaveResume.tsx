// Import necessary hooks and utilities for the auto-save functionality. These include hooks for toast notifications, debouncing, and search parameters, as well as utilities for saving resumes and handling file replacements.
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import { ResumeValues } from "@/lib/validation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { saveResume } from "./actions";
import { Button } from "@/components/ui/button";
import { fileReplacer } from "@/lib/utils";

// This custom hook, useAutoSaveResume, manages the auto-save functionality for resume data. It takes resumeData as input and handles debouncing, saving, and error management.
export function useAutoSaveResume(resumeData: ResumeValues) {
  // Initialize hooks and state variables. useSearchParams is used to manage URL parameters, useToast for displaying notifications, and useDebounce to delay the processing of resumeData changes.
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const debouncedResumeData = useDebounce(resumeData, 1500);

  // State variables to track the resume ID, the last saved data, and the saving/error status.
  const [resumeId, setResumeId] = useState(resumeData.id);
  const [lastSavedData, setLastSavedData] = useState(
    structuredClone(resumeData),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isError, setIsError] = useState(false);

  // Reset the error state whenever the debounced resume data changes.
  useEffect(() => {
    setIsError(false);
  }, [debouncedResumeData]);

  // Effect to handle the saving process. It checks for unsaved changes and attempts to save the resume if necessary.
  useEffect(() => {
    async function save() {
      try {
        // Set the saving state to true and reset any errors. Clone the debounced data to prepare for saving.
        setIsSaving(true);
        setIsError(false);
        const newData = structuredClone(debouncedResumeData);

        // Save the resume data, omitting the photo if it hasn't changed. Update the resume ID and last saved data upon success.
        const updatedResume = await saveResume({
          ...newData,
          ...(JSON.stringify(lastSavedData.photo, fileReplacer) ===
            JSON.stringify(newData.photo, fileReplacer) && {
            photo: undefined,
          }),
          id: resumeId,
        });
        setResumeId(updatedResume.id);
        setLastSavedData(newData);

        // Update the URL with the new resume ID if it has changed.
        if (searchParams.get("resumeId") !== updatedResume.id) {
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set("resumeId", updatedResume.id);
          window.history.replaceState(
            null,
            "",
            "?" + newSearchParams.toString(),
          );
        }
      } catch (error) {
        // Handle errors by setting the error state and displaying a toast notification with a retry option.
        setIsError(true);
        console.log(error);
        const { dismiss } = toast({
          variant: "destructive",
          title: "Error",
          description: (
            <div className="space-y-3">
              <p>
                We couldnot save your resume. Please try again later or contact
                support if the problem persists.
              </p>
              <Button
                variant="secondary"
                onClick={() => {
                  dismiss();
                  save();
                }}
              >
                Retry
              </Button>
            </div>
          ),
        });
      } finally {
        // Ensure the saving state is reset after the save attempt.
        setIsSaving(false);
      }
    }

    // Determine if there are unsaved changes by comparing the debounced data with the last saved data.
    const hasUnsavedChanges =
      JSON.stringify(debouncedResumeData, fileReplacer) !==
      JSON.stringify(lastSavedData, fileReplacer);

    // Trigger the save function if there are unsaved changes and no ongoing save or error.
    if (hasUnsavedChanges && debouncedResumeData && !isSaving && !isError) {
      save();
    }
  }, [
    debouncedResumeData,
    lastSavedData,
    isSaving,
    isError,
    resumeId,
    searchParams,
    toast,
  ]);

  // Return the saving state and a boolean indicating if there are unsaved changes.
  return {
    isSaving,
    hasUnsavedChanges:
      JSON.stringify(resumeData) !== JSON.stringify(lastSavedData),
  };
}
