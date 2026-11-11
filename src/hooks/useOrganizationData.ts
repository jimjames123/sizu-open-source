import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface OrganizationDetailProps {
  id: string;
  name: string;
  description: string;
  organization_type: string;
  phone: string;
  address: string;
  website: string | null;
  logo_url: string | null;
  projectsCount: number;
  activeProjectsCount: number;
  employees: string;
}

export const useOrganizationData = (id: string | undefined) => {
  const [organization, setOrganization] = useState<OrganizationDetailProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrganizationData = async () => {
      try {
        setIsLoading(true);

        if (!id) {
          setIsLoading(false);
          return;
        }

        // Fetch organization and its projects in parallel
        const [orgTableResult, profilesResult, projectsResult] = await Promise.all([
          supabase.from("organizations").select("*").eq("id", id).maybeSingle(),
          supabase.from("profiles").select("*").eq("organization_id", id).maybeSingle(),
          supabase.from("projects").select("id, status, metadata").eq("organization_id", id),
        ]);

        const orgTableData = orgTableResult.error ? null : orgTableResult.data;
        const profilesData = profilesResult.error ? null : profilesResult.data;
        const projectsData = projectsResult.error ? [] : projectsResult.data || [];

        // Count projects
        const totalProjects = projectsData.length;
        const activeProjects = projectsData.filter((project: any) => isActiveProject(project.status)).length;

        let orgData = null as OrganizationDetailProps | null;

        // Check organizations table first, then profiles table
        if (orgTableData) {
          orgData = {
            id: orgTableData.id,
            name: orgTableData.name,
            description: orgTableData.description || "",
            organization_type: orgTableData.organization_type,
            phone: orgTableData.phone || "",
            address: orgTableData.address,
            website: orgTableData.website,
            logo_url: orgTableData.logo_url,
            projectsCount: totalProjects,
            activeProjectsCount: activeProjects,
            employees: "",
          };
        } else if (profilesData) {
          // Fallback to profiles table
          orgData = {
            id: profilesData.id,
            name: profilesData.organization_name,
            description: profilesData.organization_brief || "",
            organization_type: profilesData.organization_type,
            phone: profilesData.phone || "",
            address: profilesData.address,
            website: profilesData.website,
            logo_url: profilesData.logo_url,
            projectsCount: totalProjects,
            activeProjectsCount: activeProjects,
            employees: "",
          };
        } else if (projectsData && projectsData.length > 0) {
          const first: any = projectsData[0];
          const metadata = (first && first.metadata) || {};
          const derivedName =
            (typeof metadata.projectImplementer === "string" && metadata.projectImplementer.trim()) ||
            "Unknown Organization";
          const derivedWebsite =
            (typeof metadata.implementersWebsite === "string" && metadata.implementersWebsite.trim()) ||
            null;

          orgData = {
            id: id as string,
            name: derivedName,
            description: "",
            organization_type: "Organization",
            phone: "",
            address: "",
            website: derivedWebsite,
            logo_url: null,
            projectsCount: totalProjects,
            activeProjectsCount: activeProjects,
            employees: "",
          } as OrganizationDetailProps;
        }

        setOrganization(orgData);
      } catch (error: any) {
        console.error("Error fetching organization:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load organization",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizationData();
  }, [id, toast]);

  return { organization, isLoading };
};

// Helper function to check if a project is active based on status
export const isActiveProject = (status: string): boolean => {
  const lowerStatus = status.toLowerCase();
  return (
    lowerStatus === "active" ||
    lowerStatus === "in-progress" ||
    lowerStatus === "in progress"
  );
};
