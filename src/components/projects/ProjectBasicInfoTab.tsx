import React, { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { ProjectFormValues } from "./schema/projectFormSchema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import MultiImageUploader from "@/components/ui/MultiImageUploader";
import { sectorOptions, statusOptions, sdgOptions } from "./schema/projectFormSchema";

interface ProjectBasicInfoTabProps {
  form: UseFormReturn<ProjectFormValues>;
}

const ProjectBasicInfoTab: React.FC<ProjectBasicInfoTabProps> = ({ form }) => {
  const [briefCharCount, setBriefCharCount] = useState(0);
  const briefValue = form.watch("brief");
  const MAX_BRIEF_CHARS = 500;

  useEffect(() => {
    setBriefCharCount(briefValue?.length || 0);
  }, [briefValue]);

  const handleImagesChange = (images: string[]) => {
    form.setValue("images", images);
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter project name" {...field} />
            </FormControl>
            <FormDescription>
              A clear and descriptive name for your project
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="brief"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Brief</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Brief description of the project"
                className="h-24"
                maxLength={MAX_BRIEF_CHARS}
                {...field}
              />
            </FormControl>
            <div className="flex justify-between items-start gap-2">
              <FormDescription className="flex-1">
                A short summary of what your project aims to achieve (200-500 characters required)
              </FormDescription>
              <div className={cn(
                "text-xs font-medium",
                briefCharCount < 200 ? "text-muted-foreground" :
                briefCharCount > MAX_BRIEF_CHARS ? "text-destructive" :
                "text-muted-foreground"
              )}>
                {briefCharCount}/{MAX_BRIEF_CHARS}
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="sector"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sector</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a sector" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sectorOptions.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                The primary sector your project operates in
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sdg"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sustainable Development Goal</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an SDG" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sdgOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                The UN SDG your project contributes to
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <section className="rounded-lg border border-border p-4 space-y-4" aria-label="FemTech classification">
        <FormField control={form.control} name="femtech" render={({ field }) => (
          <FormItem>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={field.value === true} onChange={(event) => { field.onChange(event.target.checked); if (!event.target.checked) form.setValue("femtechFocus", ""); }} className="mt-1 h-4 w-4" />
              <span><strong>Women\u0027s and girls\u0027 health (FemTech-related)</strong><span className="block text-sm text-muted-foreground">Select if this project directly supports women\u0027s or girls\u0027 health. Submitted classifications are provisional, not verified endorsements.</span></span>
            </label>
          </FormItem>
        )} />
        {form.watch("femtech") && <FormField control={form.control} name="femtechFocus" render={({ field }) => (
          <FormItem><FormLabel>Health focus area (optional)</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || undefined}>
              <FormControl><SelectTrigger><SelectValue placeholder="Select focus area" /></SelectTrigger></FormControl>
              <SelectContent>{["Menstrual health", "Maternal health", "Reproductive health", "Cervical cancer and screening", "Nutrition and well-being", "Other women\u0027s or girls\u0027 health"].map((area) => <SelectItem key={area} value={area}>{area}</SelectItem>)}</SelectContent>
            </Select><FormMessage /></FormItem>
        )} />}
      </section>

      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input placeholder="Project location" {...field} />
            </FormControl>
            <FormDescription>
              Where the project will be implemented
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                When the project is scheduled to start
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Date (Optional)</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                When the project is expected to end
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select project status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Current status of the project
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="images"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Images</FormLabel>
            <FormControl>
              <MultiImageUploader
                images={field.value || []}
                onImagesChange={handleImagesChange}
                maxImages={5}
                maxSizeInMB={10}
                acceptedFileTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp']}
                bucketName="project-images"
                buttonText="Upload Project Images"
              />
            </FormControl>
            <FormDescription>
              Upload up to 5 images that represent your project (max 10MB each)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProjectBasicInfoTab;
