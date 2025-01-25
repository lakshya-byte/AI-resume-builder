import {
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { EditorFormProps } from "@/lib/types";
import { summarySchema, SummaryValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { GenerateSummaryButton } from "./GenerateSummaryButton";

export function SummaryForm({ resumeData, setResumeData }: EditorFormProps) {
  const form = useForm<SummaryValues>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      summary: resumeData.summary || "",
    },
  });

  useEffect(() => {
    const subscription = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (isValid) {
        setResumeData({
          ...resumeData,
          ...values,
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [form, resumeData, setResumeData]);
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-bold">Summary</h2>
        <p className="text-sm text-muted-foreground">
          Add your summary to your resume.
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Summary</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Enter your summary" />
                </FormControl>
                <FormDescription>
                  Add a summary of your skills and experience.
                </FormDescription>
                <FormMessage />
                <GenerateSummaryButton
                  resumeData={resumeData}
                  onSummaryGenerated={(summary) => {
                    form.setValue("summary", summary);  
                  }}
                />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
