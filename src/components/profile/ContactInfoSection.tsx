
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Phone, MapPin, Globe } from "lucide-react";
import { Control } from "react-hook-form";

interface ContactInfoSectionProps {
  control: Control<any>;
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({ control }) => {
  return (
    <>
      {/* Phone */}
      <FormField
        control={control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <Input 
                  placeholder="+256 123456789" 
                  className="pl-10" 
                  {...field}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Address */}
      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <Input 
                  placeholder="Organization address" 
                  className="pl-10" 
                  {...field}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Website */}
      <FormField
        control={control}
        name="website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website (Optional)</FormLabel>
            <FormControl>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <Input 
                  placeholder="https://example.org" 
                  className="pl-10" 
                  {...field}
                />
              </div>
            </FormControl>
            <FormDescription>
              Your organization's official website URL
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ContactInfoSection;
