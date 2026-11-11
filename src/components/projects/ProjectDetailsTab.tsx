
import React, { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Users, Plus, X } from "lucide-react";
import { ProjectFormValues } from "./schema/projectFormSchema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MultiSelectDropdown from "@/components/ui/multiselect-dropdown";
import { TARGET_GROUP_OPTIONS } from "@/constants/targetGroups";

interface ProjectDetailsTabProps {
  form: UseFormReturn<ProjectFormValues>;
}

const OTHER_VALUE = "other";

const ProjectDetailsTab: React.FC<ProjectDetailsTabProps> = ({ form }) => {
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [newObjective, setNewObjective] = useState("");
  const [objectives, setObjectives] = useState<string[]>([]);
  const [newMilestone, setNewMilestone] = useState("");
  const [milestones, setMilestones] = useState<string[]>([]);
  
  const targetGroups = form.watch("targetGroups");
  const coreObjectives = form.watch("coreObjectives");
  const projectMilestones = form.watch("projectMilestones");

  // Initialize objectives from form value
  useEffect(() => {
    if (coreObjectives && typeof coreObjectives === 'string') {
      const objectivesList = coreObjectives.split('\n').filter(obj => obj.trim() !== '');
      setObjectives(objectivesList);
    }
  }, []);

  // Initialize milestones from form value
  useEffect(() => {
    if (projectMilestones && typeof projectMilestones === 'string') {
      const milestonesList = projectMilestones.split('\n').filter(milestone => milestone.trim() !== '');
      setMilestones(milestonesList);
    }
  }, []);

  // When "Other" is included in the selected target groups, show the input
  useEffect(() => {
    const groups = targetGroups
      ? targetGroups.split(",").map((g) => g.trim())
      : [];
    setShowOtherInput(groups.includes(OTHER_VALUE));
    // When "Other" is deselected, clear the value
    if (!groups.includes(OTHER_VALUE)) {
      form.setValue("otherTargetGroup", "");
    }
  }, [targetGroups, form]);

  const addObjective = () => {
    if (newObjective.trim() !== "") {
      const updatedObjectives = [...objectives, newObjective.trim()];
      setObjectives(updatedObjectives);
      form.setValue("coreObjectives", updatedObjectives.join('\n'));
      setNewObjective("");
    }
  };

  const removeObjective = (index: number) => {
    const updatedObjectives = objectives.filter((_, i) => i !== index);
    setObjectives(updatedObjectives);
    form.setValue("coreObjectives", updatedObjectives.join('\n'));
  };

  const addMilestone = () => {
    if (newMilestone.trim() !== "") {
      const updatedMilestones = [...milestones, newMilestone.trim()];
      setMilestones(updatedMilestones);
      form.setValue("projectMilestones", updatedMilestones.join('\n'));
      setNewMilestone("");
    }
  };

  const removeMilestone = (index: number) => {
    const updatedMilestones = milestones.filter((_, i) => i !== index);
    setMilestones(updatedMilestones);
    form.setValue("projectMilestones", updatedMilestones.join('\n'));
  };

  const handleObjectiveKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addObjective();
    }
  };

  const handleMilestoneKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addMilestone();
    }
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="coreObjectives"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Core Objectives</FormLabel>
            <FormControl>
              <div className="space-y-3">
                {/* Input to add new objective */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a new objective..."
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    onKeyPress={handleObjectiveKeyPress}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={addObjective}
                    variant="outline"
                    size="sm"
                    className="px-3"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* List of objectives */}
                {objectives.length > 0 && (
                  <div className="space-y-2">
                    {objectives.map((objective, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-3 bg-muted/50 rounded-md"
                      >
                        <span className="flex-1 text-sm">{objective}</span>
                        <Button
                          type="button"
                          onClick={() => removeObjective(index)}
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Hidden input to maintain form compatibility */}
                <input type="hidden" {...field} />
              </div>
            </FormControl>
            <FormDescription>
              Add the primary goals your project aims to achieve. Press Enter or click + to add each objective.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="projectMilestones"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Milestones</FormLabel>
            <FormControl>
              <div className="space-y-3">
                {/* Input to add new milestone */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a new milestone..."
                    value={newMilestone}
                    onChange={(e) => setNewMilestone(e.target.value)}
                    onKeyPress={handleMilestoneKeyPress}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={addMilestone}
                    variant="outline"
                    size="sm"
                    className="px-3"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* List of milestones */}
                {milestones.length > 0 && (
                  <div className="space-y-2">
                    {milestones.map((milestone, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-3 bg-muted/50 rounded-md"
                      >
                        <span className="flex-1 text-sm">{milestone}</span>
                        <Button
                          type="button"
                          onClick={() => removeMilestone(index)}
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Hidden input to maintain form compatibility */}
                <input type="hidden" {...field} />
              </div>
            </FormControl>
            <FormDescription>
              Add key milestones and timeline phases for your project. Press Enter or click + to add each milestone.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="targetGroups"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-gray-500" />
                Target Groups
              </FormLabel>
              <FormControl>
                <MultiSelectDropdown
                  options={TARGET_GROUP_OPTIONS}
                  selected={
                    field.value
                      ? field.value
                          .split(",")
                          .map((s: string) => s.trim())
                          .filter(Boolean)
                      : []
                  }
                  onChange={(values) => {
                    field.onChange(values.join(", "));
                  }}
                  placeholder="Select target groups..."
                />
              </FormControl>
              <FormDescription>
                Who will benefit from this project (choose all that apply). If you select "Other", you must specify the target group.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {showOtherInput && (
          <FormField
            control={form.control}
            name="otherTargetGroup"
            rules={{
              required: "Please specify the other target group",
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specify Other Target Group</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Please specify the target group"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Please describe the target group you have in mind.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectDetailsTab;

