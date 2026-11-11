import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Organization {
  id: string;
  organization_name: string;
  organization_type: string;
  email: string;
  phone: string;
  website?: string;
  logo_url?: string;
  created_at: string;
  projectCount: number;
}

// Helper function to normalize organization names for deduplication
function normalizeOrgName(name: string | null | undefined): string {
  if (!name) return '';
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

export const useOrganizationsList = () => {
  const { toast } = useToast();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [filteredOrgs, setFilteredOrgs] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setIsLoading(true);

        // Fetch from organizations table and project ids for counts
        const [organizationsResult, projectsResult] = await Promise.all([
          supabase
            .from("organizations")
            .select(`
              id,
              name,
              organization_type,
              phone,
              website,
              logo_url,
              created_at
            `)
            .not('name', 'is', null)
            .neq('name', ''),
          supabase.from("projects").select("organization_id")
        ]);

        if (organizationsResult.error) throw organizationsResult.error;

        const organizationsData = organizationsResult.data || [];
        const projectsData = projectsResult.data || [];

        // Create a map of project counts by organization ID
        const projectCountMap: Record<string, number> = {};
        projectsData?.forEach((project: any) => {
          if (project.organization_id) {
            projectCountMap[project.organization_id] = (projectCountMap[project.organization_id] || 0) + 1;
          }
        });

        // Use Map for deduplication based on normalized org name
        const orgMap = new Map<string, Organization>();

        organizationsData
          .filter((org: any) => org.name && org.name.trim())
          .forEach((org: any) => {
            const normalizedName = normalizeOrgName(org.name);
            if (orgMap.has(normalizedName)) return;
            orgMap.set(normalizedName, {
              id: org.id,
              organization_name: org.name,
              organization_type: org.organization_type || "",
              email: "N/A",
              phone: org.phone || "",
              website: org.website || "",
              logo_url: org.logo_url || "",
              created_at: org.created_at || new Date().toISOString(),
              projectCount: projectCountMap[org.id] || 0,
            });
          });

        const combinedOrgs = Array.from(orgMap.values());
        setOrganizations(combinedOrgs);
        setFilteredOrgs(combinedOrgs);
      } catch (error: any) {
        console.error("Error fetching organizations:", error);
        toast({
          title: "Error loading organizations",
          description: error.message || "Could not load organization data",
          variant: "destructive",
        });
        setOrganizations([]);
        setFilteredOrgs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizations();
  }, [toast]);

  // Handle search filtering
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredOrgs(organizations);
    } else {
      const filtered = organizations.filter((org) =>
        org.organization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.organization_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (org.email && org.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (org.phone && org.phone.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredOrgs(filtered);
    }
  }, [searchTerm, organizations]);

  return {
    organizations,
    filteredOrgs,
    isLoading,
    searchTerm,
    setSearchTerm,
  };
};
