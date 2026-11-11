
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface OrganizationSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const OrganizationSearch = ({ searchTerm, setSearchTerm }: OrganizationSearchProps) => {
  return (
    <div className="mb-6">
      <div className="relative">
        <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search organizations by name, type, email or phone..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default OrganizationSearch;
