
import React from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Tables } from "@/integrations/supabase/types";
import LogoUploadSection from "./LogoUploadSection";
import OrganizationDetailsSection from "./OrganizationDetailsSection";
import ContactInfoSection from "./ContactInfoSection";
import FormActions from "./FormActions";

type Profile = Tables<"profiles">;

interface ProfileFormProps {
  defaultValues: {
    organization_name: string;
    organization_brief: string;
    organization_type: string;
    phone: string;
    address: string;
    website: string;
  };
  logoPreview: string | null;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (values: any) => Promise<void>;
  isSaving: boolean;
  onCancel: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  defaultValues,
  logoPreview,
  onLogoUpload,
  onSubmit,
  isSaving,
  onCancel
}) => {
  const form = useForm({
    defaultValues
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Logo Upload Section */}
        <LogoUploadSection 
          logoPreview={logoPreview} 
          onLogoUpload={onLogoUpload} 
        />
        
        {/* Organization Details Section */}
        <OrganizationDetailsSection 
          control={form.control} 
        />
        
        {/* Contact Info Section */}
        <ContactInfoSection 
          control={form.control} 
        />
        
        {/* Submit & Cancel Buttons */}
        <FormActions 
          isSaving={isSaving} 
          onCancel={onCancel} 
        />
      </form>
    </Form>
  );
};

export default ProfileForm;
