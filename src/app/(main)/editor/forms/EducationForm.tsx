// --------------------------------
// Imports
// --------------------------------

// React and form handling
import { useEffect } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Types and validation
import { EditorFormProps } from "@/lib/types";
import { EducationValues } from "@/lib/validation";
import { educationSchema } from "@/lib/validation";

// UI Components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Icons
import { GripHorizontal, Trash2 } from "lucide-react";

// DnD
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
import { cn } from "@/lib/utils";

// --------------------------------
// Types
// --------------------------------

interface EducationItemProps {
  id: string;
  form: UseFormReturn<EducationValues>;
  index: number;
  remove: (index: number) => void;
}

// --------------------------------
// Main Component
// --------------------------------

export function EducationForm({ resumeData, setResumeData }: EditorFormProps) {
  // Initialize form with validation
  const form = useForm<EducationValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      educations: resumeData.educations || [],
    },
  });

  // Handle form field array for dynamic education entries
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "educations",
  });

  // Watch form changes and update parent state
  useEffect(() => {
    const subscription = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (isValid) {
        setResumeData({
          ...resumeData,
          educations: values.educations?.filter((edu) => edu !== undefined),
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
        <h2 className="text-2xl font-bold">Education</h2>
        <p className="text-sm text-muted-foreground">
          Add your education to your resume.
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
                <EducationItem
                  id={field.id}
                  key={field.id}
                  index={index}
                  remove={remove}
                  form={form}
                />
              ))}
            </SortableContext>
          </DndContext>
        </form>

        {/* Add Education Button */}
        <div className="flex justify-center">
          <Button
            type="button"
            onClick={() =>
              append({
                degree: "",
                school: "",
                startDate: "",
                endDate: "",
              })
            }
          >
            Add Education
          </Button>
        </div>
      </Form>
    </div>
  );
}

// --------------------------------
// Education Item Component
// --------------------------------

function EducationItem({ form, index, remove, id }: EducationItemProps) {
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
        transition,
        transform: CSS.Transform.toString(transform),
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold">Education {index + 1}</span>
        <GripHorizontal
          className="size-5 cursor-grab text-muted-foreground focus:outline-none"
          {...attributes}
          {...listeners}
        />
      </div>

      {/* Degree Field */}
      <FormField
        control={form.control}
        name={`educations.${index}.degree`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Degree</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      {/* School Field */}
      <FormField
        control={form.control}
        name={`educations.${index}.school`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>School</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Date Fields */}
      <div className="grid grid-cols-2 gap-2">
        <FormField
          control={form.control}
          name={`educations.${index}.startDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  value={field.value?.slice(0, 10)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`educations.${index}.endDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  value={field.value?.slice(0, 10)}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Remove Button */}
      <Button variant="destructive" type="button" onClick={() => remove(index)}>
        <Trash2 className="size-4" />
        Remove
      </Button>
    </div>
  );
}
