// Importing necessary components from the breadcrumb UI library
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Importing the steps data which contains information about each step
import { steps } from "./steps";
import React from "react";

// Defining the props for the Breadcrumbs component
interface BreadcrumbsProps {
  currentStep: string; // The current step in the breadcrumb navigation
  setCurrentStep: (step: string) => void; // Function to update the current step
}

// Breadcrumbs component definition
export function Breadcrumbs({ currentStep, setCurrentStep }: BreadcrumbsProps) {
  return (
    <div className="flex justify-center">
      <Breadcrumb>
        <BreadcrumbList>
          {steps.map((step) => (
            <React.Fragment key={step.title}>
              <BreadcrumbItem>
                {step.key === currentStep ? (
                  // If the step is the current step, display it as a page
                  <BreadcrumbPage>{step.title}</BreadcrumbPage>
                ) : (
                  // If the step is not the current step, display it as a link
                  <BreadcrumbLink asChild>
                    <button onClick={() => setCurrentStep(step.key)}>
                      {step.title}
                    </button>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              <BreadcrumbSeparator className=" last:hidden" />
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
