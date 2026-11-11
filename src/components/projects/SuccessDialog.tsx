
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, CreditCard, Sparkles } from "lucide-react";

export interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string | null;
  onAddAnother: () => void;
  wasFreeProject?: boolean;
  onUpgrade?: () => void;
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({
  open,
  onOpenChange,
  projectId,
  onAddAnother,
  wasFreeProject = false,
  onUpgrade,
}) => {
  const navigate = useNavigate();

  const viewProject = () => {
    onOpenChange(false);
    if (projectId) {
      navigate(`/projects/${projectId}`);
    }
  };

  if (wasFreeProject) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <DialogTitle>Great job! Your first project is live</DialogTitle>
            </div>
            <DialogDescription>
              You've used your free starter project. Unlock unlimited projects with a paid plan.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Free projects used</span>
                <span>1 / 1</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>

            <div className="bg-muted rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <Sparkles className="h-4 w-4 text-sizu-red" />
                Upgrade benefits
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                <li>Unlimited projects</li>
                <li>Priority support</li>
                <li>Featured visibility on the platform</li>
              </ul>
              <p className="text-sm pt-2">
                <strong>UGX 45,000</strong> or <strong>USD 15</strong> per year
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={viewProject}>
              View Project
            </Button>
            <Button
              onClick={() => {
                onOpenChange(false);
                onUpgrade?.();
              }}
              className="bg-sizu-red hover:bg-sizu-crimson text-white"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Upgrade Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Project Created Successfully</DialogTitle>
          <DialogDescription>
            Your project has been created. What would you like to do next?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onAddAnother}>
            Add Another Project
          </Button>
          <Button onClick={viewProject}>
            View Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;
