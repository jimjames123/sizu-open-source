
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export interface RegisterFormData {
  email: string;
  fullName: string;
  orgName: string;
  orgBrief: string;
  orgType: string;
  phone: string;
  address: string;
  website: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface RegisterFormErrors {
  [key: string]: string;
}

export const useRegisterForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("+256"); // Default to Uganda
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    fullName: "",
    orgName: "",
    orgBrief: "",
    orgType: "",
    phone: "",
    address: "",
    website: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<RegisterFormErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: val,
    }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCountryCodeChange = (code: string) => {
    setCountryCode(code);
  };

  const handleLogoUpload = (url: string | null) => {
    setLogoUrl(url);
    setLogoPreview(url);
  };

  const validateForm = () => {
    const newErrors: RegisterFormErrors = {};
    
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.orgName) newErrors.orgName = "Organization name is required";
    
    // Enhanced validation for organization brief
    if (!formData.orgBrief) {
      newErrors.orgBrief = "Organization brief is required";
    } else if (formData.orgBrief.length < 10) {
      newErrors.orgBrief = "Brief must be at least 10 characters";
    } else if (formData.orgBrief.length > 200) {
      newErrors.orgBrief = "Brief must not exceed 200 characters";
    }
    
    if (!formData.orgType) newErrors.orgType = "Organization type is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.address) newErrors.address = "Address is required";
    
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    
    if (!formData.acceptTerms) newErrors.acceptTerms = "You must accept the terms and conditions";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Show specific error for organization brief if it's the issue
      if (errors.orgBrief) {
        toast({
          title: "Organization Brief Error",
          description: errors.orgBrief,
          variant: "destructive"
        });
      }
      const firstErrorField = document.querySelector(`[name="${Object.keys(errors)[0]}"]`);
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Starting registration process...");
      
      // Step 1: Create the organization first
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: formData.orgName.toUpperCase(),
          description: formData.orgBrief,
          organization_type: formData.orgType,
          phone: `${countryCode} ${formData.phone}`,
          address: formData.address,
          website: formData.website || null,
          logo_url: null,
        })
        .select('id')
        .single();
        
      if (orgError) {
        console.error("Error creating organization:", orgError);
        throw new Error(`Organization creation failed: ${orgError.message}`);
      }
      
      if (!orgData) {
        throw new Error("Failed to create organization - no data returned");
      }
      
      const organizationId = orgData.id;
      console.log("Organization created successfully with ID:", organizationId);
      
      // Step 2: Create user account with organization reference
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            organization_id: organizationId,
          },
        }
      });
      
      if (authError) {
        console.error("Error creating user account:", authError);
        throw new Error(`User account creation failed: ${authError.message}`);
      }
      
      if (!authData.user) {
        throw new Error("Registration failed - no user data returned");
      }
      
      const userId = authData.user.id;
      console.log("User account created successfully with ID:", userId);
      
      // Upload only after sign-up, when an authenticated session exists.
      // Storage policy requires the first path segment to match auth.uid().
      let uploadedLogoUrl: string | null = null;
      let logoUploadDeferred = false;
      if (logoFile) {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session?.user.id === userId) {
          const extension = logoFile.name.split('.').pop()?.toLowerCase() || 'png';
          const filePath = `${userId}/${Date.now()}.${extension}`;
          const { error: uploadError } = await supabase.storage
            .from('organization-logos')
            .upload(filePath, logoFile, { upsert: false, contentType: logoFile.type });
          if (uploadError) {
            console.error('Organization logo upload failed:', uploadError);
            logoUploadDeferred = true;
          } else {
            uploadedLogoUrl = supabase.storage.from('organization-logos').getPublicUrl(filePath).data.publicUrl;
            const { error: logoUpdateError } = await supabase.from('organizations')
              .update({ logo_url: uploadedLogoUrl }).eq('id', organizationId);
            if (logoUpdateError) {
              console.error('Organization logo URL save failed:', logoUpdateError);
              logoUploadDeferred = true;
            }
          }
        } else {
          // Email confirmation may be required; never attempt an anonymous upload.
          logoUploadDeferred = true;
        }
      }

      // Step 3: Update profile with organization details
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          organization_name: formData.orgName.toUpperCase(),
          organization_brief: formData.orgBrief,
          organization_type: formData.orgType,
          phone: `${countryCode} ${formData.phone}`,
          address: formData.address,
          website: formData.website || null,
          logo_url: uploadedLogoUrl,
          organization_id: organizationId,
        })
        .eq('id', userId);
        
      if (profileError) {
        console.error("Error updating profile:", profileError);
        throw new Error(`Profile update failed: ${profileError.message}`);
      }
      
      console.log("Profile updated successfully");
      
      toast({
        title: "Registration successful!",
        description: logoUploadDeferred ? "Account created. Your logo could not be uploaded yet; please sign in and add it from your organization profile." : "Your account and organization have been registered. You can now log in to access your dashboard.",
      });
      
      // Navigate to login page after successful registration
      navigate('/login', { replace: true });
      
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    logoPreview,
    passwordVisible,
    confirmPasswordVisible,
    countryCode,
    handleInputChange,
    handleLogoUpload,
    handleSubmit,
    handleCountryCodeChange,
    setPasswordVisible,
    setConfirmPasswordVisible
  };
};
