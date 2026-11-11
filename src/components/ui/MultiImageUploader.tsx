
import React, { useState } from "react";
import { Button } from "./button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Loader2, X, Image } from "lucide-react";

interface MultiImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  maxSizeInMB: number;
  acceptedFileTypes: string[];
  bucketName: string;
  buttonText?: string;
}

const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({
  images,
  onImagesChange,
  maxImages = 5,
  maxSizeInMB,
  acceptedFileTypes,
  bucketName,
  buttonText = "Upload Images"
}) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadProjectImage = async (file: File, userId: string) => {
    try {
      // Generate unique filename without folder structure - similar to events
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}.${fileExt}`;

      console.log(`Uploading file: ${fileName} to bucket: ${bucketName}`);

      // Get the session token
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        throw new Error('Authentication required for file upload');
      }

      // Upload using fetch directly to avoid client library issues - same as events
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch(
        `https://qrrziayuzfdfvkptywgt.supabase.co/storage/v1/object/${bucketName}/${fileName}`,
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
        console.error('Upload failed:', errorData);
        throw new Error(`Upload error: ${errorData.message || 'Unknown error'}`);
      }

      // Get the public URL
      const { data: publicData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      console.log('Generated public URL:', publicData?.publicUrl);

      if (!publicData?.publicUrl) {
        throw new Error('Failed to generate public URL for uploaded image');
      }

      return publicData.publicUrl;
    } catch (err) {
      console.error("Upload failed:", err);
      throw err; // Re-throw the error instead of returning null
    }
  };

  const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select files to upload.');
      }

      const files = Array.from(event.target.files);
      
      // Check if adding these files would exceed the limit
      if (images.length + files.length > maxImages) {
        throw new Error(`Cannot upload more than ${maxImages} images total.`);
      }

      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error('You must be logged in to upload images.');
      }

      const userId = userData.user.id;
      console.log(`Uploading ${files.length} files for user: ${userId}`);

      // Process files one by one to better handle errors
      const uploadedUrls: string[] = [];
      const failedUploads: string[] = [];

      for (const file of files) {
        try {
          // Validate file size
          const fileSizeInMB = file.size / (1024 * 1024);
          if (fileSizeInMB > maxSizeInMB) {
            throw new Error(`File ${file.name} exceeds ${maxSizeInMB}MB limit. Current size: ${fileSizeInMB.toFixed(2)}MB`);
          }

          // Validate file type
          if (!acceptedFileTypes.includes(file.type)) {
            const allowedTypes = acceptedFileTypes.map(type => type.split('/')[1]).join(', ');
            throw new Error(`File ${file.name} type not supported. Allowed types: ${allowedTypes}`);
          }

          const url = await uploadProjectImage(file, userId);
          uploadedUrls.push(url);
          console.log(`Successfully uploaded ${file.name}:`, url);
        } catch (fileError: any) {
          console.error(`Failed to upload ${file.name}:`, fileError);
          failedUploads.push(`${file.name}: ${fileError.message}`);
        }
      }

      if (uploadedUrls.length === 0) {
        throw new Error(`No images were uploaded successfully. Errors: ${failedUploads.join('; ')}`);
      }

      const newImages = [...images, ...uploadedUrls];
      onImagesChange(newImages);
      
      let message = `${uploadedUrls.length} image(s) uploaded successfully`;
      if (failedUploads.length > 0) {
        message += `. ${failedUploads.length} failed: ${failedUploads.join('; ')}`;
      }
      
      toast({
        title: "Upload completed",
        description: message,
        variant: failedUploads.length > 0 ? "destructive" : "default"
      });

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Could not upload files",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      // Reset the input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          disabled={uploading || images.length >= maxImages}
          onClick={() => document.getElementById(`multi-file-upload-${bucketName}`)?.click()}
          className="relative"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {buttonText}
            </>
          )}
        </Button>
        
        <input
          id={`multi-file-upload-${bucketName}`}
          type="file"
          accept={acceptedFileTypes.join(',')}
          onChange={uploadFile}
          disabled={uploading || images.length >= maxImages}
          multiple
          className="hidden"
        />
        
        <div className="text-xs text-gray-500">
          {images.length}/{maxImages} images • Max size: {maxSizeInMB}MB each
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <img
                src={imageUrl}
                alt={`Project image ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => window.open(imageUrl, '_blank')}
                onError={(e) => {
                  console.error('Image failed to load:', imageUrl);
                  e.currentTarget.style.display = 'none';
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', imageUrl);
                }}
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <Image className="h-12 w-12 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 text-center">
            No images uploaded yet.<br />
            Click "Upload Images" to add up to {maxImages} images.
          </p>
        </div>
      )}
    </div>
  );
};

export default MultiImageUploader;
