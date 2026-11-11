
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Building, Info } from "lucide-react";
import { Control } from "react-hook-form";

interface OrganizationDetailsSectionProps {
  control: Control<any>;
}

const OrganizationDetailsSection: React.FC<OrganizationDetailsSectionProps> = ({ control }) => {
  const organizationTypes = [
    "Government/Public",
    "Corporate/Private",
    "Social Enterprise",
    "Foreign Organization",
    "NGO/Non-Profit",
    "Community Based"
  ];

  return (
    <>
      {/* Organization Name */}
      <FormField
        control={control}
        name="organization_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Organization Name</FormLabel>
            <FormControl>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
                <Input 
                  placeholder="ORGANIZATION NAME" 
                  className="pl-10 uppercase" 
                  {...field}
                />
              </div>
            </FormControl>
            <FormDescription>
              This will appear in all uppercase letters
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Organization Brief */}
      <FormField
        control={control}
        name="organization_brief"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Organization Brief</FormLabel>
            <FormControl>
              <div className="relative">
                <div className="absolute top-3 left-3">
                  <Info className="h-5 w-5 text-gray-400" />
                </div>
                <Textarea 
                  placeholder="Brief description of your organization..." 
                  className="pl-10 min-h-24" 
                  minLength={10}
                  maxLength={200}
                  {...field}
                  onChange={(e) => {
                    // Prevent exceeding max length
                    if (e.target.value.length <= 200) {
                      field.onChange(e);
                    }
                  }}
                />
                <div className="flex justify-between items-center mt-1">
                  <div className="text-xs text-gray-500">
                    {field.value?.length < 10 ? `Minimum 10 characters required` : ''}
                  </div>
                  <div className={`text-xs ${field.value?.length > 200 ? 'text-red-500' : field.value?.length > 180 ? 'text-orange-500' : 'text-gray-500'}`}>
                    {field.value?.length || 0}/200 characters
                  </div>
                </div>
              </div>
            </FormControl>
            <FormDescription>
              A short description of your organization (10-200 characters)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Organization Type */}
      <FormField
        control={control}
        name="organization_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Organization Type</FormLabel>
            <FormControl>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
                <select 
                  className="pl-10 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  {...field}
                >
                  <option value="">Select organization type</option>
                  {organizationTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default OrganizationDetailsSection;
