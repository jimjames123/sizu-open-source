
import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProjectCard, { ProjectProps } from "./ProjectCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { determineOrganizationName, normalizeStatus } from "@/utils/organizationUtils";
import { handleSupabaseResponse, asSupabaseParam } from "@/utils/supabaseUtils";

const FeaturedProjects = () => {
  const [featuredProjects, setFeaturedProjects] = useState<ProjectProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching featured projects...");
        
        // Get 3 featured projects with status "completed" or "in-progress"
        const { data, error } = await supabase
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
          .in('status', asSupabaseParam(['completed', 'active', 'in-progress']))
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (error) {
          console.error("Error fetching featured projects:", error);
          throw error;
        }

        console.log("Featured projects data:", data ? data.length : 0, "projects found");
        
        if (data && data.length > 0) {
          console.log("Sample project:", data[0]);
          
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
              brief: project.brief || "",
            };
          });
          
          console.log("Formatted featured projects:", formattedProjects);
          setFeaturedProjects(formattedProjects);
        } else {
          console.log("No featured projects found");
          setFeaturedProjects([]);
        }
      } catch (error: any) {
        console.error("Error fetching featured projects:", error);
        toast({
          title: "Error loading featured projects",
          description: error.message || "Something went wrong",
          variant: "destructive",
        });
        setFeaturedProjects([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeaturedProjects();
  }, [toast]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">
            Featured Projects
          </h2>
          <Link
            to="/projects"
            className="flex items-center text-sizu-black hover:text-sizu-red transition-colors"
          >
            View All <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md h-96 animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-100 rounded-lg">
            <p className="text-gray-600">No featured projects found</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProjects;
