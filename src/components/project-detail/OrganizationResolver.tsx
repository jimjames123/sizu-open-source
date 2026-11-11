
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Interface for organization info with confidence level
export interface OrganizationInfo {
  name: string;
  confidence: number;
}

interface OrganizationResolverProps {
  projectData: any;
  onResolve: (orgInfo: OrganizationInfo) => void;
}

const OrganizationResolver = ({ projectData, onResolve }: OrganizationResolverProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const resolveOrganization = async () => {
      try {
        setIsLoading(true);
        
        let profileData;
        let orgData;
        
        if (projectData.organization_id) {
          try {
            // Try profiles table first
            const { data: pData } = await supabase
              .from('profiles')
              .select('organization_name')
              .eq('id', projectData.organization_id)
              .maybeSingle();
            
            profileData = pData;
            
            if (!profileData) {
              // Try organizations table as fallback
              const { data: oData } = await supabase
                .from('organizations')
                .select('name')
                .eq('id', projectData.organization_id)
                .maybeSingle();

              orgData = oData;
            }
          } catch (err) {
            console.error("Error fetching organization:", err);
          }
        }
        
        // Determine organization with confidence level
        const orgInfo = determineOrganizationWithConfidence(projectData, profileData, orgData);
        onResolve(orgInfo);
      } catch (error) {
        console.error("Error resolving organization:", error);
        // Fallback to unknown organization with zero confidence
        onResolve({
          name: "Unknown Organization",
          confidence: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    resolveOrganization();
  }, [projectData, onResolve]);

  // Helper function to determine organization based on project attributes
  const determineOrganizationWithConfidence = (
    projectData: any,
    profileData?: any,
    orgData?: any
  ): OrganizationInfo => {
    // Case 2: Organization from profiles table (high confidence)
    if (profileData?.organization_name) {
      return {
        name: profileData.organization_name,
        confidence: 95
      };
    }

    // Case 3: Organization from organizations table (medium-high confidence)
    if (orgData?.name) {
      return {
        name: orgData.name,
        confidence: 90
      };
    }

    // Case 5: Default fallback with low confidence
    return {
      name: "Unknown Organization",
      confidence: 0
    };
  };

  return null; // This is a logic-only component, no UI
};

export default OrganizationResolver;
