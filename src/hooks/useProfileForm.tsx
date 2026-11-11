
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const useProfileForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [formDefaults, setFormDefaults] = useState({
    organization_name: "",
    organization_brief: "",
    organization_type: "",
    phone: "",
    address: "",
    website: "",
  });
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }
    
    // Check file type
    if (!file.type.match('image/(jpeg|jpg|png|gif)')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG or GIF image",
        variant: "destructive"
      });
      return;
    }
    
    setLogoFile(file);
    
    // Create a temporary preview URL
    const objectUrl = URL.createObjectURL(file);
    setLogoPreview(objectUrl);
  };
  
  const uploadLogo = async (userId: string): Promise<string | null> => {
    if (!logoFile) return logoPreview; // Return existing logo if no new upload
    
    try {
      // Clean up the temporary URL before upload
      if (logoPreview && logoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(logoPreview);
      }
      
      const fileExt = logoFile.name.split('.').pop();
      const filePath = `${userId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('organization-logos')
        .upload(filePath, logoFile, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) throw uploadError;
      
      const { data: publicUrlData } = supabase.storage
        .from('organization-logos')
        .getPublicUrl(filePath);
        
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast({
        title: "Error uploading logo",
        description: "There was an error uploading your logo. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  };
  
  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        navigate("/login");
        return;
      }
      
      // Get profile data
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userData.user.id)
        .single();
        
      if (profileError) {
        throw profileError;
      }
      
      // Set form values
      setFormDefaults({
        organization_name: profileData.organization_name || "",
        organization_brief: profileData.organization_brief || "",
        organization_type: profileData.organization_type || "",
        phone: profileData.phone || "",
        address: profileData.address || "",
        website: profileData.website || "",
      });
      
      // Set logo preview if exists
      if (profileData.logo_url) {
        setLogoPreview(profileData.logo_url);
      }
      
    } catch (error: any) {
      console.error("Error loading profile:", error);
      toast({
        title: "Error loading profile",
        description: error.message || "Could not load your profile",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async (values: any) => {
    try {
      setIsSaving(true);
      
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error("User not authenticated");
      }
      
      const userId = userData.user.id;
      
      // Upload logo if there's a new one
      const logoUrl = await uploadLogo(userId);
      
      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          organization_name: values.organization_name.toUpperCase(),
          organization_brief: values.organization_brief,
          organization_type: values.organization_type,
          phone: values.phone,
          address: values.address,
          website: values.website || null,
          ...(logoUrl ? { logo_url: logoUrl } : {})
        })
        .eq("id", userId);
        
      if (profileError) throw profileError;
      
      // Get organization_id from profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", userId)
        .single();
      
      // Update organization if organization_id exists
      if (profileData?.organization_id) {
        const { error: orgError } = await supabase
          .from("organizations")
          .update({
            name: values.organization_name.toUpperCase(),
            description: values.organization_brief,
            organization_type: values.organization_type,
            phone: values.phone,
            address: values.address,
            website: values.website || null,
            ...(logoUrl ? { logo_url: logoUrl } : {})
          })
          .eq("id", profileData.organization_id);
          
        if (orgError) {
          console.error("Error updating organization:", orgError);
        }
      }
      
      toast({
        title: "Profile updated",
        description: "Your organization profile has been updated successfully",
      });
      
      // Navigate back to the dashboard
      navigate("/dashboard");
      
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: error.message || "An error occurred while updating your profile",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isLoading,
    isSaving, 
    logoPreview,
    formDefaults,
    fetchProfileData,
    handleLogoUpload,
    handleSubmit
  };
};
