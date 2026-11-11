
import React, { useEffect, useState } from "react";
import SEO from "@/components/seo/SEO";
import { useParams } from "react-router-dom";
import { Image } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { ProjectProps } from "../components/home/ProjectCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import OrganizationResolver, { OrganizationInfo } from "../components/project-detail/OrganizationResolver";
import ProjectDetailSkeleton from "../components/project-detail/ProjectDetailSkeleton";
import ProjectNotFound from "../components/project-detail/ProjectNotFound";
import ProjectInfo from "../components/project-detail/ProjectInfo";
import BackButton from "../components/project-detail/BackButton";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [organizationInfo, setOrganizationInfo] = useState<OrganizationInfo | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select(`
            id,
            name,
            brief,
            location,
            sector,
            sdg,
            target_groups,
            status,
            start_date,
            end_date,
            image,
            organization_id,
            metadata
          `)
          .eq('id', id)
          .single();

        if (error) {
          console.error("Error fetching project:", error);
          toast({
            title: "Error",
            description: "Failed to load project details",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        if (data) {
          // Map database status to expected status values
          const normalizedStatus = normalizeStatus(data.status);
          
          // Include metadata in the project data
          const projectData: ProjectProps & { metadata?: any } = {
            id: data.id,
            name: data.name,
            organization: "Loading...", // Placeholder until resolved
            organization_id: data.organization_id,
            location: data.location,
            sector: data.sector,
            sdg: data.sdg,
            targetGroups: data.target_groups || [],
            status: normalizedStatus,
            startDate: data.start_date,
            endDate: data.end_date || undefined,
            image: data.image || "/placeholder.svg",
            brief: data.brief,
            metadata: data.metadata || {}
          };

          setProject(projectData);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProjectData();
    }
  }, [id, toast]);

  // Function to normalize status string to match expected values
  const normalizeStatus = (status: string): "planning" | "completed" | "cancelled" | "in-progress" | "on-hold" => {
    switch (status) {
      case "planning": return "planning";
      case "active": return "in-progress"; // Map 'active' to 'in-progress'
      case "completed": return "completed";
      case "on_hold": return "on-hold";
      case "cancelled": return "cancelled";
      default: return "planning"; // Default fallback
    }
  };

  // Handle organization resolution callback
  const handleOrganizationResolved = (orgInfo: OrganizationInfo) => {
    setOrganizationInfo(orgInfo);
    
    if (project) {
      setProject({
        ...project,
        organization: orgInfo.name
      });
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <ProjectDetailSkeleton />
        <Footer />
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Navbar />
        <ProjectNotFound />
        <Footer />
      </>
    );
  }

  const initials = project?.name
    .split(' ')
    .slice(0, 2)
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase();

  return (
    <>
      <SEO title={project?.name ? `${project.name} | SIZU Projects` : "Project | SIZU"} description={(project as any)?.description?.slice?.(0, 160) || "Explore impact projects in Uganda on SIZU."} path={`/projects/${id ?? ""}`} />
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackButton />
          <ProjectInfo 
            project={project} 
            organizationInfo={organizationInfo}
            initials={initials}
          />
          
          {/* This component handles the organization resolution logic */}
          {project && (
            <OrganizationResolver
              projectData={project}
              onResolve={handleOrganizationResolved}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProjectDetail;
