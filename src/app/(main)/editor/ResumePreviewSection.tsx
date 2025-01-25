import { ResumePreview } from "@/components/ResumePreview";
import { ResumeValues } from "@/lib/validation";
import { ColourPicker } from "./ColourPicker";
import { BorderStyleButton } from "./BorderStyleButton";
import { cn } from "@/lib/utils";

interface ResumePreviewSectionProps {
  resumeData: ResumeValues;
  setResumeData: (data: ResumeValues) => void;
  className?: string;
}

export function ResumePreviewSection({
  resumeData,
  setResumeData,
  className,
}: ResumePreviewSectionProps) {
  return (
    <div className={cn("group flex w-full flex-col md:w-1/2", className)}>
      <div className="relative flex w-full">
        <div className="absolute -left-40 top-3 z-10 flex flex-col gap-3 opacity-50 transition-opacity duration-300 group-hover:opacity-100">
          <ColourPicker
            color={resumeData.colorHex}
            onchange={(color) =>
              setResumeData({ ...resumeData, colorHex: color.hex })
            }
          />
          <BorderStyleButton
            borderStyle={resumeData.borderStyle}
            onChange={(borderStyle) =>
              setResumeData({ ...resumeData, borderStyle })
            }
          />
        </div>

        {/* Make the ResumePreview responsive */}
        <div className="flex w-full items-center justify-center overflow-y-auto bg-secondary p-3">
          <ResumePreview
            className="max-w-full md:max-w-2xl shadow-md"
            resumeData={resumeData}
          />
        </div>
      </div>
    </div>
  );
}
