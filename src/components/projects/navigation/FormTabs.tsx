
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjectFormContext } from "../context/ProjectFormContext";
import { UseFormReturn } from "react-hook-form";
import { ProjectFormValues } from "../schema/projectFormSchema";
import ProjectBasicInfoTab from "../ProjectBasicInfoTab";
import ProjectDetailsTab from "../ProjectDetailsTab";
import ProjectLocationTab from "../ProjectLocationTab";
import { useIsMobile } from "@/hooks/use-mobile";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface FormTabsProps {
  form: UseFormReturn<ProjectFormValues>;
}

const FormTabs: React.FC<FormTabsProps> = ({ form }) => {
  const { activeTab, setActiveTab } = useProjectFormContext();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="space-y-4 w-full">
        <Collapsible
          open={activeTab === "basic"}
          onOpenChange={() => setActiveTab("basic")}
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between bg-muted p-4 rounded-md">
            <span className="font-medium">1. Basic Information</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${activeTab === "basic" ? "transform rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <ProjectBasicInfoTab form={form} />
          </CollapsibleContent>
        </Collapsible>

        <Collapsible
          open={activeTab === "details"}
          onOpenChange={() => setActiveTab("details")}
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between bg-muted p-4 rounded-md">
            <span className="font-medium">2. Project Details</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${activeTab === "details" ? "transform rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <ProjectDetailsTab form={form} />
          </CollapsibleContent>
        </Collapsible>

        <Collapsible
          open={activeTab === "location"}
          onOpenChange={() => setActiveTab("location")}
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between bg-muted p-4 rounded-md">
            <span className="font-medium">3. Location & Team</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${activeTab === "location" ? "transform rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <ProjectLocationTab form={form} />
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab as (value: string) => void} className="w-full">
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="basic">Basic Information</TabsTrigger>
        <TabsTrigger value="details">Project Details</TabsTrigger>
        <TabsTrigger value="location">Location & Team</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic">
        <ProjectBasicInfoTab form={form} />
      </TabsContent>
      
      <TabsContent value="details">
        <ProjectDetailsTab form={form} />
      </TabsContent>
      
      <TabsContent value="location">
        <ProjectLocationTab form={form} />
      </TabsContent>
    </Tabs>
  );
};

export default FormTabs;
