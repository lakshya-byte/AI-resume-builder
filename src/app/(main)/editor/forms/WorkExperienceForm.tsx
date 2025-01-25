// --------------------------------
// Imports
// --------------------------------

// React and form handling
import { useEffect } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";

// Types and validation
import { WorkExperienceValues } from "@/lib/validation";
import { EditorFormProps } from "@/lib/types";
import { workExperienceSchema } from "@/lib/validation";

// UI Components
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Icons
import { GripHorizontal, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import GenerateWorkExperienceButton from "./GenerateWorkExperienceButton";

// --------------------------------
// Types
// --------------------------------

interface WorkExperienceItemProps {
  form: UseFormReturn<WorkExperienceValues>;
  index: number;
  remove: (index: number) => void;
  id: string;
}

// --------------------------------
// Main Component
// --------------------------------

export function WorkExperienceForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  // Initialize form with validation
  const form = useForm<WorkExperienceValues>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      workExperiences: resumeData.workExperiences || [],
    },
  });

  // Handle form field array for dynamic work experiences
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "workExperiences",
  });

  // Watch form changes and update parent state
  useEffect(() => {
    const subscription = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (isValid) {
        setResumeData({
          ...resumeData,
          workExperiences:
            values.workExperiences?.filter((exp) => exp !== undefined) || [],
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [form, resumeData, setResumeData]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);

      move(oldIndex, newIndex);
      return arrayMove(fields, oldIndex, newIndex);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      {/* Header Section */}
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-bold">Work Experience</h2>
        <p className="text-sm text-muted-foreground">
          Add your work experience to your resume.
        </p>
      </div>

      {/* Form Section */}
      <Form {...form}>
        <form className="space-y-3">
          <DndContext
            sensors={sensors}
            onDragEnd={handleDragEnd}
            collisionDetection={closestCorners}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={fields}
              strategy={verticalListSortingStrategy}
            >
              {fields.map((field, index) => (
                <WorkExperienceItem
                  id={field.id}
                  key={field.id}
                  index={index}
                  remove={remove}
                  form={form}
                />
              ))}
            </SortableContext>
          </DndContext>

          {/* Add Experience Button */}
          <div className="flex justify-center">
            <Button
              type="button"
              onClick={() =>
                append({
                  position: "",
                  company: "",
                  startDate: "",
                  endDate: "",
                  description: "",
                })
              }
            >
              Add Work Experience
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

// --------------------------------
// Work Experience Item Component
// --------------------------------

function WorkExperienceItem({
  id,
  form,
  index,
  remove,
}: WorkExperienceItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    transform,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      className={cn(
        "space-y-3 rounded-md border-4 bg-background p-3",
        isDragging && "relative z-50 cursor-grab shadow-xl",
      )}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold">Work Experience {index + 1}</span>
        <GripHorizontal
          {...attributes}
          {...listeners}
          className="size-5 cursor-grab text-muted-foreground"
        />
      </div>

      {/* Position Field */}
      <FormField
        control={form.control}
        name={`workExperiences.${index}.position`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Position</FormLabel>
            <FormControl>
              <Input {...field} autoFocus />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Company Field */}
      <FormField
        control={form.control}
        name={`workExperiences.${index}.company`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company</FormLabel>
            <FormControl>
              <Input {...field} autoFocus />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Date Fields */}
      <div className="grid grid-cols-2 gap-2">
        <FormField
          control={form.control}
          name={`workExperiences.${index}.startDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  autoFocus
                  value={
                    typeof field.value === "string"
                      ? field.value.slice(0, 10)
                      : ""
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`workExperiences.${index}.endDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  autoFocus
                  value={
                    typeof field.value === "string"
                      ? field.value.slice(0, 10)
                      : ""
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <FormDescription>
        If you are currently working here, leave the end date blank.
      </FormDescription>

      {/* Description Field */}
      <FormField
        control={form.control}
        name={`workExperiences.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Remove Button */}
      <div className="flex justify-start gap-2">
        <Button
          className="gap-2"
          variant="destructive"
          type="button"
          onClick={() => remove(index)}
        >
          <Trash2 className="size-4" />
          Remove
        </Button>
        <GenerateWorkExperienceButton
          onWorkExperienceGenerated={(exp) => {
            form.setValue(`workExperiences.${index}`, exp);
          }}
        />
      </div>
    </div>
  );
}

