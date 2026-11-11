
import React, { useEffect } from "react";
import SEO from "@/components/seo/SEO";
import { useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import OrganizationNotFound from "@/components/organizations/OrganizationNotFound";
import { useOrganizationData } from "@/hooks/useOrganizationData";
import { useOrganizationProjects } from "@/hooks/useOrganizationProjects";
import OrganizationHeader from "@/components/organizations/OrganizationHeader";
import OrganizationInfo from "@/components/organizations/OrganizationInfo";
import OrganizationProjects from "@/components/organizations/OrganizationProjects";
import OrganizationLoadingState from "@/components/organizations/OrganizationLoadingState";

const OrganizationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { organization, isLoading } = useOrganizationData(id);
  const { projects } = useOrganizationProjects(id, organization?.name);
  
  // Add console logs to help debug
  useEffect(() => {
    console.log("OrganizationDetail rendering with:", {
      id,
      organizationLoaded: !!organization,
      organizationName: organization?.name,
      projectsLoaded: !!projects,
      projectsCount: projects?.length || 0
    });
  }, [id, organization, projects]);
  
  // Function to generate initials from organization name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .slice(0, 2)
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  if (isLoading) {
    return (
      <>
        <Navbar />
        <OrganizationLoadingState />
        <Footer />
      </>
    );
  }

  if (!organization) {
    return (
      <>
        <Navbar />
        <OrganizationNotFound />
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <SEO title={organization?.name ? `${organization.name} | SIZU` : "Organization | SIZU"} description={((organization as any)?.brief || (organization as any)?.description)?.slice?.(0, 160) || "Discover impact-driven organizations in Uganda."} path={`/organizations/${id ?? ""}`} jsonLd={organization?.name ? { "@context": "https://schema.org", "@type": "Organization", name: organization.name, url: `https://sizu.lovable.app/organizations/${id}` } : undefined} />
      <Navbar />
      <div className="bg-gray-50 pt-32 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <OrganizationHeader 
            organization={organization} 
            getInitials={getInitials} 
          />
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden mt-8">
            <OrganizationInfo organization={organization} />
          </div>
          
          <OrganizationProjects 
            organizationName={organization.name} 
            projects={projects}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrganizationDetail;
