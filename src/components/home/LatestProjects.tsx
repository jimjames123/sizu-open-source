import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import HorizontalProjectCard from "./HorizontalProjectCard";
import ProjectCarousel from "./ProjectCarousel";
import { supabase } from "@/integrations/supabase/client";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useToast } from "@/hooks/use-toast";
import { determineOrganizationName, normalizeStatus } from "@/utils/organizationUtils";
import { handleSupabaseResponse } from "@/utils/supabaseUtils";
import { ProjectProps } from "./ProjectCard";

const LatestProjects = () => {
  const [latestProjects, setLatestProjects] = useState<ProjectProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLatestProjects = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching latest projects...");
        
        // Get the 3 most recently created projects
        const response = await supabase
          .from('projects')
          .select(`
            id,
            name,
            organization_id,
            location,
            sector,
            sdg,
            target_groups,
            status,
            start_date,
            end_date,
            image,
            brief,
            metadata,
            profiles(organization_name)
          `)
          .order('created_at', { ascending: false })
          .limit(10);
        
        const data = handleSupabaseResponse(response);
        
        if (!data || data.length === 0) {
          console.log("No latest projects found");
          setLatestProjects([]);
          return;
        }
        
        console.log(`Latest projects data: Found ${data.length} projects`);
        console.log("First project sample:", data[0]);
        
        const formattedProjects: ProjectProps[] = data.map(project => {
          if (!project) return {} as ProjectProps;
          
          const organizationName = determineOrganizationName(project);
          
          return {
            id: project.id || "",
            name: project.name || "Untitled Project",
            organization: organizationName,
            organization_id: project.organization_id || "",
            location: project.location || "Unknown Location",
            sector: project.sector || "Unspecified Sector",
            sdg: project.sdg || "Unspecified SDG",
            targetGroups: project.target_groups || [],
            status: normalizeStatus(project.status || ""),
            startDate: project.start_date || "",
            endDate: project.end_date || undefined,
            image: project.image || "",
            brief: project.brief || "No description available",
          };
        });
        
        console.log("Formatted projects:", formattedProjects);
        setLatestProjects(formattedProjects);
      } catch (error: any) {
        console.error("Error fetching latest projects:", error);
        toast({
          title: "Error loading latest projects",
          description: error.message || "Something went wrong",
          variant: "destructive",
        });
        setLatestProjects([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLatestProjects();
  }, [toast]);

  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className={`pt-24 sm:pt-28 pb-16 bg-gray-50 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-sizu-red mb-1.5">
              Discover Impact
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Latest{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sizu-crimson to-sizu-red">
                Projects
              </span>
            </h2>
            <div className="h-1 w-14 bg-sizu-yellow rounded-full mt-2.5"></div>
          </div>
          <Link
            to="/projects"
            className="flex items-center text-sizu-black hover:text-sizu-red transition-colors"
          >
            View All <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 h-40 w-full max-w-[380px] animate-pulse overflow-hidden">
              <div className="w-28 sm:w-44 bg-gray-200"></div>
              <div className="flex-1 p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        ) : latestProjects.length === 0 ? (
          <div className="text-center py-12 bg-gray-100 rounded-lg">
            <p className="text-gray-600">No latest projects found</p>
          </div>
        ) : (
          <ProjectCarousel projects={latestProjects} />
        )}
      </div>
    </section>
  );
};

export default LatestProjects;
