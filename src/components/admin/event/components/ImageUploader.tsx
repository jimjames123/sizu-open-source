import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { useImageUpload } from "../hooks/useImageUpload";
import { allowedTypes, allowedExtensions } from "../utils/fileValidation";
import ImagePreview from "./ImagePreview";

interface ImageUploaderProps {
  imageUrl: string;
  onUpload: (url: string | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ imageUrl, onUpload }) => {
  const { uploading, uploadFile } = useImageUpload({ onUpload });

  const handleRemoveImage = () => {
    onUpload(null);
  };

  const triggerFileInput = () => {
    const input = document.getElementById('event-image-upload');
    if (input) {
      (input as HTMLInputElement).value = "";
      input.click();
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-right">
        Event Image
      </Label>
      
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={triggerFileInput}
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
              Upload Event Image
            </>
          )}
        </Button>
        
        <input
          id="event-image-upload"
          type="file"
          accept="image/*"
          onChange={uploadFile}
          disabled={uploading}
          className="hidden"
        />
        
        <div className="text-xs text-gray-500">
          Max size: 10MB, Any file format accepted
        </div>
      </div>
      
      {imageUrl && (
        <ImagePreview 
          imageUrl={imageUrl} 
          onRemove={handleRemoveImage}
        />
      )}
    </div>
  );
};

export default ImageUploader;
