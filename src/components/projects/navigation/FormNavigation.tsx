
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Save, ArrowRight, ArrowLeft } from "lucide-react";
import { useProjectFormContext } from "../context/ProjectFormContext";

interface FormNavigationProps {
  onSaveAndNext: () => Promise<void>;
  isSubmitting: boolean;
  cancelRoute: string;
  submitButtonText: string;
}

const FormNavigation: React.FC<FormNavigationProps> = ({
  onSaveAndNext,
  isSubmitting,
  cancelRoute,
  submitButtonText,
}) => {
  const navigate = useNavigate();
  const { activeTab, goToPreviousTab } = useProjectFormContext();
  
  return (
    <div className="pt-4 flex justify-between border-t border-gray-200">
      <div className="flex space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(cancelRoute)}
        >
          Cancel
        </Button>
        
        {activeTab !== "basic" && (
          <Button
            type="button"
            variant="outline"
            onClick={goToPreviousTab}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
        )}
      </div>
      
      <div className="flex space-x-4">
        {activeTab !== "location" && (
          <Button 
            type="button" 
            onClick={onSaveAndNext}
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Save className="mr-2 h-4 w-4" />
            Save & Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
        
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-sizu-red hover:bg-red-700 text-white"
        >
          {isSubmitting ? "Saving..." : submitButtonText}
        </Button>
      </div>
    </div>
  );
};

export default FormNavigation;
