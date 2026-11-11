
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { MapPin } from "lucide-react";
import { ProjectFormValues } from "./schema/projectFormSchema";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProjectLocationTabProps {
  form: UseFormReturn<ProjectFormValues>;
}

const regionOptions = [
  "Central Region",
  "Western Region", 
  "Eastern Region",
  "Northern Region"
];

const ProjectLocationTab: React.FC<ProjectLocationTabProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
              Location Name
            </FormLabel>
            <FormControl>
              <Input placeholder="Enter main project location" {...field} />
            </FormControl>
            <FormDescription>
              Primary location where the project is implemented
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="region"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Region</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a region" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-background border shadow-md">
                  {regionOptions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="district"
          render={({ field }) => (
            <FormItem>
              <FormLabel>District</FormLabel>
              <FormControl>
                <Input placeholder="E.g., Kampala, Jinja" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="parish"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parish</FormLabel>
              <FormControl>
                <Input placeholder="Parish name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="projectImplementer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Implementer</FormLabel>
              <FormControl>
                <Input placeholder="Organization implementing the project" {...field} />
              </FormControl>
              <FormDescription>
                The main organization responsible for implementation
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="projectTeamLead"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Team Lead</FormLabel>
              <FormControl>
                <Input placeholder="Name of the team lead" {...field} />
              </FormControl>
              <FormDescription>
                Person in charge of the project
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="implementersWebsite"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Implementer's Website</FormLabel>
              <FormControl>
                <Input placeholder="https://example.org" {...field} />
              </FormControl>
              <FormDescription>
                Web address of the implementing organization
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="otherPartners"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Other Partners</FormLabel>
              <FormControl>
                <Input placeholder="Other organizations involved" {...field} />
              </FormControl>
              <FormDescription>
                Additional partners contributing to the project
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default ProjectLocationTab;
