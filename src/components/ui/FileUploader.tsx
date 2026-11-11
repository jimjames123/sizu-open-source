
import React, { useState } from "react";
import { Button } from "./button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Loader2 } from "lucide-react";

interface FileUploaderProps {
  onUpload: (url: string | null) => void;
  maxSizeInMB: number;
  acceptedFileTypes: string[];
  bucketName: string;
  buttonText?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onUpload,
  maxSizeInMB,
  acceptedFileTypes,
  bucketName,
  buttonText = "Upload File"
}) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select a file to upload.');
      }

      const file = event.target.files[0];
      
      // Validate file size
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > maxSizeInMB) {
        throw new Error(`File size exceeds ${maxSizeInMB}MB limit. Current size: ${fileSizeInMB.toFixed(2)}MB`);
      }

      // Validate file type
      if (!acceptedFileTypes.includes(file.type)) {
        const allowedTypes = acceptedFileTypes.map(type => type.split('/')[1]).join(', ');
        throw new Error(`File type not supported. Allowed types: ${allowedTypes}`);
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;

      console.log('Uploading to bucket:', bucketName, 'with filename:', fileName);

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Storage upload error:', error);
        throw error;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      console.log('File uploaded successfully:', urlData.publicUrl);

      onUpload(urlData.publicUrl);
      
      toast({
        title: "Upload successful",
        description: "Your file has been uploaded successfully"
      });

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Could not upload file",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        type="button"
        variant="outline"
        disabled={uploading}
        onClick={() => document.getElementById(`file-upload-${bucketName}`)?.click()}
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
        id={`file-upload-${bucketName}`}
        type="file"
        accept={acceptedFileTypes.join(',')}
        onChange={uploadFile}
        disabled={uploading}
        className="hidden"
      />
      
      <div className="text-xs text-gray-500">
        Max size: {maxSizeInMB}MB, Types: {acceptedFileTypes.map(type => type.split('/')[1]).join(', ')}
      </div>
    </div>
  );
};

export default FileUploader;
