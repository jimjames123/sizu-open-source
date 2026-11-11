
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import OrganizationSearch from "@/components/admin/organization/OrganizationSearch";
import OrganizationsTable from "@/components/admin/organization/OrganizationsTable";
import OrganizationsEmptyState from "@/components/admin/organization/OrganizationsEmptyState";
import OrganizationsLoadingState from "@/components/admin/organization/OrganizationsLoadingState";
import { useOrganizationsList } from "@/hooks/useOrganizationsList";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import OrganizationFilters from "@/components/organizations/OrganizationFilters";

const AdminOrganizations = () => {
  const { filteredOrgs, isLoading, searchTerm, setSearchTerm, organizations } = useOrganizationsList();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const navigate = useNavigate();

  const handleNewOrganization = () => {
    navigate("/register");
    setIsDialogOpen(false);
  };

  // Filter organizations by type
  const filteredByType = typeFilter === "all" 
    ? filteredOrgs 
    : filteredOrgs.filter(org => org.organization_type === typeFilter);

  // Sort filteredOrgs by created_at, newest first
  const sortedOrgs = [...filteredByType].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // Log the organization count for debugging
  console.log(`Admin Panel: Displaying ${sortedOrgs.length} organizations after filtering and sorting`);

  return (
    <AdminLayout
      title="Organizations Management"
      description="View and manage all organizations on the platform"
    >
      <div className="flex justify-between items-center mb-6">
        <OrganizationSearch 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />
        
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Organization
        </Button>
      </div>
      
      <div className="mb-6">
        <OrganizationFilters activeFilter={typeFilter} setFilter={setTypeFilter} />
      </div>
      
      {isLoading ? (
        <OrganizationsLoadingState />
      ) : sortedOrgs.length > 0 ? (
        <OrganizationsTable organizations={sortedOrgs} />
      ) : (
        <OrganizationsEmptyState searchTerm={searchTerm} />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Organization</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600 mb-4">
              To add a new organization, you need to register it through the registration form. 
              This ensures all required information is collected properly.
            </p>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleNewOrganization}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Go to Registration
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminOrganizations;
