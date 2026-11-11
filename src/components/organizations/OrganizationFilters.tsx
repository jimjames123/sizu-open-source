
import React from "react";
import { Button } from "@/components/ui/button";
import { ORGANIZATION_TYPES } from "@/utils/organizationTypes";

interface OrganizationFiltersProps {
  activeFilter: string;
  setFilter: (filter: string) => void;
}

const OrganizationFilters: React.FC<OrganizationFiltersProps> = ({ 
  activeFilter, 
  setFilter 
}) => {
  // Create filters with "All" at the beginning and then all organization types
  const filters = [
    { id: "all", label: "All" },
    ...ORGANIZATION_TYPES.map(type => ({
      id: type,
      label: type
    }))
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map(filter => (
        <Button 
          key={filter.id}
          onClick={() => setFilter(filter.id)} 
          variant={activeFilter === filter.id ? "default" : "outline"}
          size="sm"
          className={activeFilter === filter.id ? "bg-sizu-red hover:bg-sizu-crimson" : ""}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
};

export default OrganizationFilters;
