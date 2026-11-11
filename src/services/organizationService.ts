import { supabase } from "@/integrations/supabase/client";
import { OrganizationCardProps } from "@/components/organizations/OrganizationCard";

// Helper function to normalize organization names for deduplication
function normalizeOrgName(name: string | null | undefined): string {
  if (!name) return '';
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

export async function fetchOrganizations(): Promise<OrganizationCardProps[]> {
  try {
    console.log("Starting fetchOrganizations() function");

    // Run queries in parallel: organizations and projects (for counts)
    const [organizationsResult, projectsResult] = await Promise.all([
      supabase
        .from("organizations")
        .select("id, name, description, organization_type, phone, address, website, logo_url, created_at")
        .not('name', 'is', null)
        .neq('name', ''),
      supabase
        .from("projects")
        .select("organization_id")
    ]);

    if (organizationsResult.error) {
      console.error("Error fetching organizations:", organizationsResult.error);
      throw organizationsResult.error;
    }

    const organizationsData = organizationsResult.data || [];
    const projectsData = projectsResult.data || [];

    // Build a map for project counts
    const projectCounts: Record<string, number> = {};
    projectsData.forEach((project: any) => {
      if (project.organization_id) {
        projectCounts[project.organization_id] = (projectCounts[project.organization_id] || 0) + 1;
      }
    });

    // Use a Map to deduplicate organizations by normalized name
    const orgMap = new Map<string, OrganizationCardProps>();

    organizationsData
      .filter((org: any) => org.name && org.name.trim())
      .forEach((org: any) => {
        const normalizedName = normalizeOrgName(org.name);
        if (orgMap.has(normalizedName)) return;
        orgMap.set(normalizedName, {
          id: org.id,
          organization_name: org.name,
          organization_brief: org.description || "",
          organization_type: org.organization_type || "",
          phone: org.phone || "",
          address: org.address || "",
          website: org.website || "",
          logo_url: org.logo_url || "",
          projectsCount: projectCounts[org.id] || 0,
          source: 'organization' as const,
          created_at: org.created_at,
        });
      });

    const allOrgs = Array.from(orgMap.values());
    console.log(`Final result: ${allOrgs.length} unique organizations after deduplication`);

    return allOrgs;
  } catch (error) {
    console.error("Error in fetchOrganizations:", error);
    throw error;
  }
}
