import { PersonalInfoForm } from "./forms/PersonalInfoForm";
import { GeneralInfoForm } from "./forms/GeneralInfoForm";
import { EditorFormProps } from "@/lib/types";
import { WorkExperienceForm } from "./forms/WorkExperienceForm";
import { EducationForm } from "./forms/EducationForm";
import { SkillsForm } from "./forms/SkillsForm";
import { SummaryForm } from "./forms/SummaryForm";

export const steps: {
  title: string;
  component: React.ComponentType<EditorFormProps >;
  key: string;
}[] = [
  {
    title: "General-info",
    component: GeneralInfoForm,
    key: "General Info",
  },
  {
    title: "Personal-info",
    component: PersonalInfoForm,
    key: "Personal Info",
  },
  {
    title: "Work-experience",
    component: WorkExperienceForm,
    key: "Work Experience",
  },
  {
    title: "Education",
    component: EducationForm,
    key: "Education",
  },
  {
    title: "Skills",
    component: SkillsForm,
    key: "Skills",
  },
  {
    title: "Summary",
    component: SummaryForm,
    key: "Summary",
  },
];
