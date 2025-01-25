// --------------------------------
// Imports
// --------------------------------

// React and form handling
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Form components
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

// Types and validation
import { EditorFormProps } from "@/lib/types";
import { SkillsValues, skillsSchema } from "@/lib/validation";

// --------------------------------
// Main Component
// --------------------------------

export function SkillsForm({ resumeData, setResumeData }: EditorFormProps) {
  // Initialize form with validation
  const form = useForm<SkillsValues>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: resumeData.skills || [], // Initialize with existing skills or empty array
    },
  });

  // Watch form changes and update parent state
  useEffect(() => {
    const subscription = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (isValid) {
        // Process skills array:
        // 1. Filter out undefined values
        // 2. Trim whitespace
        // 3. Remove empty strings
        setResumeData({
          ...resumeData,
          skills:
            values.skills
              ?.filter((skill) => skill !== undefined)
              .map((skill) => skill.trim())
              .filter((skill) => skill !== "") || [],
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [form, resumeData, setResumeData]);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      {/* Header Section */}
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Skills</h2>
        <p className="text-sm text-muted-foreground">
          Add your skills to your resume.
        </p>
      </div>

      {/* Form Section */}
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Skills</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value.join(", ")}
                    placeholder="Enter your skills"
                    onChange={(e) => {
                      const skills = e.target.value
                        .split(",")
                        .map((s) => s.trim());
                      field.onChange(skills);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Enter your skills separated by commas.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
