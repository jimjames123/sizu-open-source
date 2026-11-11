import { useEffect, useMemo, useState } from "react";
import SEO from "@/components/seo/SEO";
import { useSearchParams } from "react-router-dom";
import ProjectGrid from "../components/projects/ProjectGrid";
import { ProjectProps } from "../components/home/ProjectCard";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import ProjectFilterBar from "@/components/projects/ProjectFilterBar";
import { buildProjectsApiUrl, fetchProjects } from "@/lib/projectSearch";

const FindProject = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get("status") ?? "all");
  const [sortOption, setSortOption] = useState(searchParams.get("sort") ?? "newest");
  const [projects, setProjects] = useState<ProjectProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSelectedStatus(searchParams.get("status") ?? "all");
    setSortOption(searchParams.get("sort") ?? "newest");
  }, [searchParams]);

  const apiUrl = useMemo(() => buildProjectsApiUrl(searchParams), [searchParams]);

  useEffect(() => {
    let isActive = true;

    const loadProjects = async () => {
      try {
        setIsLoading(true);
        console.log("FindProject final API URL:", apiUrl);

        const results = await fetchProjects(apiUrl);
        if (!isActive) {
          return;
        }

        setProjects(results);
      } catch (error: any) {
        if (!isActive) {
          return;
        }

        console.error("Error fetching projects:", error);
        setProjects([]);
        toast({
          title: "Error loading projects",
          description: error.message || "Could not load projects",
          variant: "destructive",
        });
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadProjects();

    return () => {
      isActive = false;
    };
  }, [apiUrl, toast]);

  const filteredProjects = useMemo(() => {
    let nextProjects = [...projects];

    if (selectedStatus !== "all") {
      nextProjects = nextProjects.filter((project) => project.status === selectedStatus);
    }

    if (sortOption === "newest") {
      nextProjects.sort(
        (firstProject, secondProject) =>
          new Date(secondProject.startDate).getTime() - new Date(firstProject.startDate).getTime(),
      );
    } else if (sortOption === "alphabetical") {
      nextProjects.sort((firstProject, secondProject) =>
        firstProject.name.localeCompare(secondProject.name),
      );
    }

    return nextProjects;
  }, [projects, selectedStatus, sortOption]);

  return (
    <>
      <SEO title="Find Impact Projects in Uganda | SIZU" description="Search and explore impact projects across Uganda by region, sector, and SDG. Connect with the organizations driving change." path="/projects" />
      <Navbar />
      <div className="bg-gray-50 pt-12 pb-20">
        <div className="page-container">
          <div className="red-header pb-16">
            <h1>Find Projects</h1>
            <p>Discover and connect with impactful projects across Uganda</p>
          </div>

          <div className="relative z-20 -mt-10 mb-8">
            <ProjectFilterBar resultCount={filteredProjects.length} isLoading={isLoading} />
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sizu-red"></div>
              <p className="mt-4 text-sm text-gray-600">Searching...</p>
            </div>
          ) : (
            <ProjectGrid projects={filteredProjects} showFilters={false} />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FindProject;
