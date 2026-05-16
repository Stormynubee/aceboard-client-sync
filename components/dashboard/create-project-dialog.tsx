"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Video, Upload, CheckCircle2, Loader2 } from "lucide-react";
import { createProject, getPresignedUrl } from "@/lib/actions";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  videoUrl: z.string().url("Please upload a video or enter a valid URL"),
});

interface CreateProjectDialogProps {
  children?: React.ReactElement;
}

export function CreateProjectDialog({ children }: CreateProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "",
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation for video files
    if (!file.type.startsWith("video/")) {
      alert("Please select a valid video file.");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(10);

      // 1. Get pre-signed URL from server
      const { uploadUrl, finalUrl } = await getPresignedUrl(file.name, file.type);
      setUploadProgress(30);

      // 2. Upload directly to S3/R2
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl, true);
      xhr.setRequestHeader("Content-Type", file.type);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 60) + 30;
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          form.setValue("videoUrl", finalUrl);
          setUploadProgress(100);
          setIsUploading(false);
        } else {
          setIsUploading(false);
          setUploadProgress(0);
          alert(`Upload failed with status: ${xhr.status}`);
        }
      };

      xhr.onerror = () => {
        setIsUploading(false);
        setUploadProgress(0);
        alert("Network error during upload.");
      };

      xhr.send(file);

    } catch (error) {
      console.error("Upload failed:", error);
      setIsUploading(false);
      setUploadProgress(0);
      alert("Video upload failed. Please try again.");
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createProject(values);
      setOpen(false);
      form.reset();
      setUploadProgress(0);
      router.refresh();
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={children || (
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> New Project
          </Button>
        )}
      />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Upload a video or provide a link to start the review process.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Client Name - Commercial v1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <FormLabel>Video Source</FormLabel>
              <div className="grid grid-cols-1 gap-4">
                {/* Upload Button */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors
                    ${isUploading ? "bg-muted cursor-not-allowed" : "hover:bg-muted/50"}
                    ${form.getValues("videoUrl") && !isUploading ? "border-primary/50 bg-primary/5" : "border-muted-foreground/20"}
                  `}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="video/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                  
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2 w-full">
                      <Loader2 className="h-8 w-8 text-primary animate-spin" />
                      <p className="text-sm font-medium">Uploading video... {uploadProgress}%</p>
                      <div className="w-full bg-muted-foreground/20 h-1.5 rounded-full overflow-hidden mt-2">
                        <div 
                          className="bg-primary h-full transition-all duration-300" 
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : form.getValues("videoUrl") ? (
                    <div className="flex flex-col items-center gap-1 text-primary">
                      <CheckCircle2 className="h-8 w-8" />
                      <p className="text-sm font-bold">Video Ready</p>
                      <p className="text-[10px] text-muted-foreground truncate max-w-[200px]">
                        {form.getValues("videoUrl")}
                      </p>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm font-medium">Click to upload video file</p>
                      <p className="text-xs text-muted-foreground mt-1">MP4, MOV up to 500MB</p>
                    </>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or paste link</span>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="videoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Video className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="https://..." 
                            className="pl-9" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="e.g. Rough cut for internal review" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting || isUploading}>
                {form.formState.isSubmitting ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
