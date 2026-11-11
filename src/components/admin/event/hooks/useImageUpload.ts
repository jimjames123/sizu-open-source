import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { validateFile, generateFileName } from "../utils/fileValidation";

interface UseImageUploadProps {
  onUpload: (url: string | null) => void;
}

export const useImageUpload = ({ onUpload }: UseImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      const input = event.target;
      if (!input.files || input.files.length === 0) {
        setUploading(false);
        toast({
          title: "No file selected",
          description: "You must select a file to upload.",
          variant: "destructive",
        });
        return;
      }

      const file = input.files[0];

      console.log("[DEBUG] Selected file details:", {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        constructor: file.constructor.name
      });

      // Validate file
      const validation = validateFile(file);
      if (!validation.isValid) {
        toast({
          title: "Upload failed",
          description: validation.error,
          variant: "destructive"
        });
        setUploading(false);
        input.value = "";
        return;
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}.${fileExt}`;

      console.log('[DEBUG] Uploading file to Supabase bucket: event-images, as', fileName);
      console.log('[DEBUG] File MIME type:', file.type);

      // Get the session token
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        toast({
          title: "Authentication error",
          description: "Please log in again",
          variant: "destructive"
        });
        setUploading(false);
        return;
      }

      // Upload using fetch directly to avoid client library issues
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch(
        `https://qrrziayuzfdfvkptywgt.supabase.co/storage/v1/object/event-images/${fileName}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFycnppYXl1emZkZnZrcHR5d2d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2OTcyNzAsImV4cCI6MjA1NzI3MzI3MH0.r35HABOueVhu3xIz_T5ixsSA4dcI-fA6R79Z9i9jX0U'
          },
          body: formData
        }
      );

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        console.error('[DEBUG] Upload failed:', errorData);
        toast({
          title: "Upload failed",
          description: `Upload error: ${errorData.message || 'Unknown error'}`,
          variant: "destructive"
        });
        setUploading(false);
        input.value = "";
        return;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('event-images')
        .getPublicUrl(fileName);

      console.log('[DEBUG] File uploaded successfully! urlData:', urlData);

      if (!urlData || !urlData.publicUrl) {
        toast({
          title: "Upload failed",
          description: "Could not get public image URL.",
          variant: "destructive"
        });
        setUploading(false);
        return;
      }

      onUpload(urlData.publicUrl);
      toast({
        title: "Upload successful",
        description: "Your event image has been uploaded successfully"
      });
      input.value = "";
    } catch (error: any) {
      console.error('[DEBUG] Upload caught error:', error, error?.message, error?.status, error?.data);
      toast({
        title: "Unexpected error",
        description: error?.message || String(error),
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return { uploading, uploadFile };
};