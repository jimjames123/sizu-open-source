import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImagePreviewProps {
  imageUrl: string;
  onRemove: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrl, onRemove }) => {
  const { toast } = useToast();

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Image failed to load:", imageUrl);
    const img = e.currentTarget;
    img.src = 'https://via.placeholder.com/400x200?text=Image+Loading+Error';
    toast({
      title: "Image error",
      description: "There was an issue loading the image",
      variant: "destructive"
    });
  };

  const handleRemoveImage = () => {
    onRemove();
    toast({
      title: "Image removed",
      description: "Event image has been removed"
    });
  };

  return (
    <div className="mt-4 relative h-40 w-full bg-gray-100 rounded-md overflow-hidden">
      <img 
        src={imageUrl} 
        alt="Event preview"
        className="w-full h-full object-cover"
        onError={handleImageError}
      />
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-md"
        onClick={handleRemoveImage}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ImagePreview;