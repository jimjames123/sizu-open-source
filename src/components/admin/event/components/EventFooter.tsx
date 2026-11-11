
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog";

interface EventFooterProps {
  isSubmitting: boolean;
  onCancel: () => void;
  isEditMode: boolean;
}

const EventFooter: React.FC<EventFooterProps> = ({ 
  isSubmitting, 
  onCancel,
  isEditMode 
}) => {
  return (
    <DialogFooter className="sm:justify-between">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button 
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 hover:bg-blue-700"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          isEditMode ? "Update Event" : "Create Event"
        )}
      </Button>
    </DialogFooter>
  );
};

export default EventFooter;
