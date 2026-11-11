import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Store } from "lucide-react";

interface MarketplaceTypeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEvent: () => void;
  onSelectBusiness: () => void;
}

const MarketplaceTypeSelector: React.FC<MarketplaceTypeSelectorProps> = ({
  isOpen,
  onClose,
  onSelectEvent,
  onSelectBusiness,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Marketplace Item Type</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Button
            variant="outline"
            className="w-full h-auto py-6 flex flex-col items-center gap-2"
            onClick={() => {
              onSelectEvent();
              onClose();
            }}
          >
            <Calendar className="h-8 w-8 text-sizu-red" />
            <div className="text-center">
              <div className="font-semibold">Add Event</div>
              <div className="text-sm text-muted-foreground">
                Create a new marketplace event
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full h-auto py-6 flex flex-col items-center gap-2"
            onClick={() => {
              onSelectBusiness();
              onClose();
            }}
          >
            <Store className="h-8 w-8 text-sizu-red" />
            <div className="text-center">
              <div className="font-semibold">Add Business Advertisement</div>
              <div className="text-sm text-muted-foreground">
                Promote a business in the marketplace
              </div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MarketplaceTypeSelector;
