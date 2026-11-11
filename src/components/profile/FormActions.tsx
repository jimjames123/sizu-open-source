
import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface FormActionsProps {
  isSaving: boolean;
  onCancel: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({
  isSaving,
  onCancel
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-4">
      <Button
        type="submit"
        disabled={isSaving}
        className="btn-primary flex items-center justify-center gap-2"
      >
        {isSaving ? (
          <>
            <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
            Saving...
          </>
        ) : (
          <>
            <Save className="h-5 w-5" />
            Save Changes
          </>
        )}
      </Button>
      
      <Button
        type="button"
        disabled={isSaving}
        onClick={onCancel}
        className="btn-outline"
        variant="outline"
      >
        Cancel
      </Button>
    </div>
  );
};

export default FormActions;
