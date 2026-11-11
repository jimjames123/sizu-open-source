
import React from "react";
import { Building, Upload } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface LogoUploadSectionProps {
  logoPreview: string | null;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LogoUploadSection: React.FC<LogoUploadSectionProps> = ({
  logoPreview,
  onLogoUpload
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-6 pb-6 border-b">
      <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
        <AspectRatio ratio={1/1} className="h-full">
          {logoPreview ? (
            <img 
              src={logoPreview} 
              alt="Organization Logo" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <Building className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </AspectRatio>
      </div>
      
      <div className="flex flex-col justify-center space-y-4">
        <h3 className="font-medium text-gray-900">Organization Logo</h3>
        <p className="text-sm text-gray-500">
          This will be displayed on your organization profile and projects
        </p>
        <div className="relative">
          <input
            type="file"
            id="logo"
            accept="image/jpeg,image/png,image/gif"
            onChange={onLogoUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="bg-gray-100 border border-gray-300 rounded-md px-4 py-2 flex items-center space-x-2 max-w-fit">
            <Upload className="h-5 w-5 text-gray-500" />
            <span className="text-gray-500 text-sm">Choose Logo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoUploadSection;
