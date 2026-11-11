
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getIconContainerClasses, getSearchInputClasses, getIconClasses } from "@/lib/form-utils";

interface OrganizationSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const OrganizationSearch: React.FC<OrganizationSearchProps> = ({ 
  searchTerm, 
  setSearchTerm 
}) => {
  return (
    <div className="search-container">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className={getIconContainerClasses('left')}>
            <Search className={getIconClasses()} />
          </div>
          <Input
            type="text"
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={getSearchInputClasses()}
          />
        </div>
      </div>
    </div>
  );
};

export default OrganizationSearch;
