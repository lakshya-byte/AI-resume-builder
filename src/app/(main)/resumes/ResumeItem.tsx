"use client";

import { ResumePreview } from "@/components/ResumePreview";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast, useToast } from "@/hooks/use-toast";
import { ResumeServerData } from "@/lib/types";
import { mapToResumeValues } from "@/lib/utils";
import { format } from "date-fns";
import { MoreVertical, Pencil, Printer, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition, useRef } from "react";
import { deleteResume } from "./actions";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import LoadingButton from "@/components/LoadingButton";
import { useReactToPrint } from "react-to-print";

interface ResumeItemProps {
  resume: ResumeServerData;
}

export default function ResumeItem({ resume }: ResumeItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: resume.title || "Resume",
    onAfterPrint: () => {
      toast({
        title: "Resume printed",
        description: "Your resume has been printed",
      });
    },
  });

  const wasUpdated = resume.updatedAt !== resume.createdAt;

  return (
    <div className="group relative rounded-lg border border-transparent bg-secondary p-3 transition-colors hover:border-border">
      <div className="space-y-3">
        <Link
          href={`/editor?resumeId=${resume.id}`}
          className="inline-block w-full text-center"
        >
          <p className="line-clamp-1 font-semibold">
            {resume.title || "No Title"}
          </p>
          {resume.description && (
            <p className="line-clamp-2 text-sm">{resume.description}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {wasUpdated ? "Updated" : "Created"} on{" "}
            {format(resume.updatedAt, "MMM d, yyyy h:mm a")}
          </p>
        </Link>
        <Link
          href={`/editor?resumeId=${resume.id}`}
          className="relative inline-block w-full text-center"
        >
          <ResumePreview
            contentRef={contentRef}
            resumeData={mapToResumeValues(resume)}
            className="overflow-hidden shadow-sm transition-shadow group-hover:shadow-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50 group-hover:from-transparent group-hover:to-background/75" />
        </Link>
      </div>
      <MoreMenu resumeId={resume.id} onPrintClick={reactToPrintFn} />
    </div>
  );
}

interface MoreMenuProps {
  resumeId: string;
  onPrintClick: () => void;
}

function MoreMenu({ resumeId, onPrintClick }: MoreMenuProps) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="absolute right-0 z-50 mt-2 w-40 rounded-md border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800"
          align="end"
          sideOffset={5} // Adds spacing between trigger and menu
        >
          <DropdownMenuItem
            className="flex items-center gap-2 rounded-md p-2 transition-colors hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            onClick={() => setShowDeleteConfirmation(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2 rounded-md p-2 transition-colors hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
            <Link
              href={`/editor?resumeId=${resumeId}`}
              className="flex items-center gap-2"
            >
              <Pencil className="inline-block h-4 w-4" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onPrintClick}
            className="flex items-center gap-2 rounded-md p-2 transition-colors hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
          >
            <Printer className="h-4 w-4" />
            Print
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConfirmationDialog
        resumeId={resumeId}
        open={showDeleteConfirmation}
        onOpenChange={setShowDeleteConfirmation}
      />
    </>
  );
}

interface DeleteConfirmationProps {
  resumeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DeleteConfirmationDialog({
  resumeId,
  open,
  onOpenChange,
}: DeleteConfirmationProps) {
  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    startTransition(async () => {
      try {
        await deleteResume(resumeId);
        toast({
          title: "Success",
          description: "Resume deleted",
        });
        onOpenChange(false);
      } catch (error) {
        console.log(error);
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
      }
    });
  }
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Resume</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this resume?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <LoadingButton
              loading={isPending}
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
