
import React, { useState, useEffect } from "react";
import SEO from "@/components/seo/SEO";
import { Building, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import OrganizationCard, { OrganizationCardProps } from "@/components/organizations/OrganizationCard";
import OrganizationFilters from "@/components/organizations/OrganizationFilters";
import OrganizationSearch from "@/components/organizations/OrganizationSearch";
import { fetchOrganizations } from "@/services/organizationService";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const PAGE_SIZE = 12;

const Organizations = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [organizations, setOrganizations] = useState<OrganizationCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("Starting to fetch organizations in Organizations page...");
        const orgs = await fetchOrganizations();
        console.log(`Successfully fetched ${orgs.length} organizations in Organizations page`);
        
        if (orgs.length === 0) {
          console.warn("No organizations were returned from fetchOrganizations");
        } else {
          console.log("Sample organization data:", orgs[0]);
        }
        
        const sortedOrgs = [...orgs].sort((a, b) => {
          if (a.created_at && b.created_at) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }
          return 0;
        });
        
        setOrganizations(sortedOrgs);
      } catch (error: any) {
        console.error("Error in Organizations page while fetching:", error);
        setError(error.message || "Could not load organizations");
        toast({
          title: "Error loading organizations",
          description: error.message || "Could not load organizations",
          variant: "destructive"
        });
        setOrganizations([]);
      } finally {
        setIsLoading(false);
        console.log("Finished organizations loading process");
      }
    };
    
    loadOrganizations();
  }, [toast]);
  
  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch = org.organization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (org.organization_brief?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                        (org.address?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || org.organization_type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(filteredOrganizations.length / PAGE_SIZE));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const paginatedOrganizations = filteredOrganizations.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const goToPage = (page: number) => {
    const next = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (currentPage > 3) pages.push("ellipsis");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);
    return pages;
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };
  
  const RegisterButton = () => (
    <Button 
      onClick={handleRegisterClick}
      className="bg-sizu-red hover:bg-sizu-crimson text-white font-medium transition-all duration-300 hover:shadow-lg w-full sm:w-auto"
    >
      <UserPlus className="h-4 w-4 mr-2" />
      Register Organization
    </Button>
  );

  return (
    <>
      <SEO title="Impact Organizations in Uganda | SIZU" description="Browse a directory of impact-driven organizations across Uganda working on sustainable development, social good, and community programs." path="/organizations" />
      <Navbar />
      <div className="bg-gray-50 pt-12 pb-20">
        <div className="page-container">
          <div className="red-header flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1>Onboarded Organizations</h1>
              <p>Discover and connect with organizations making an impact across Uganda</p>
            </div>
          </div>
          
          <div className="mb-8 space-y-4">
            <OrganizationSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <OrganizationFilters activeFilter={typeFilter} setFilter={setTypeFilter} />
              <div className="mt-4 sm:mt-0 hidden sm:block">
                <RegisterButton />
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sizu-red"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <Building className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Error loading organizations</h3>
              <p className="text-gray-600 mb-6">
                {error}
              </p>
              <div className="text-sm text-gray-500 mb-6">
                Please try refreshing the page
              </div>
              <RegisterButton />
            </div>
          ) : filteredOrganizations.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No organizations found</h3>
              <p className="text-gray-600 mb-6">
                {organizations.length > 0 
                  ? "Try adjusting your search or filter criteria" 
                  : "There are no organizations in the database yet"}
              </p>
              <div className="flex flex-col items-center">
                <div className="text-sm text-gray-500 mb-4">
                  Total organizations in database: {organizations.length}
                </div>
                <RegisterButton />
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="text-sm text-gray-600">
                  Page <span className="font-semibold">{currentPage}</span> of{" "}
                  <span className="font-semibold">{totalPages}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                  {Math.min(currentPage * PAGE_SIZE, filteredOrganizations.length)} of{" "}
                  {filteredOrganizations.length} organizations
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedOrganizations.map((org) => (
                  <OrganizationCard key={org.id} {...org} />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          goToPage(currentPage - 1);
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    {getPageNumbers().map((p, idx) =>
                      p === "ellipsis" ? (
                        <PaginationItem key={`e-${idx}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={p}>
                          <PaginationLink
                            href="#"
                            isActive={p === currentPage}
                            onClick={(e) => {
                              e.preventDefault();
                              goToPage(p);
                            }}
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          goToPage(currentPage + 1);
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}

              <div className="mt-8 flex justify-center md:justify-end">
                <RegisterButton />
              </div>

              <div className="text-center mt-12 p-8 bg-gray-100 rounded-lg border border-gray-200">
                <h3 className="text-xl font-medium mb-3">Ready to join our network?</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Register your organization and become part of SIZU's community of change-makers across Uganda.
                </p>
                <RegisterButton />
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Organizations;
