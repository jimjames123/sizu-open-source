
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface EventSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const EventSearch = ({ searchTerm, onSearchChange }: EventSearchProps) => {
  return (
    <div className="relative w-full max-w-md">
      <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <Input
        placeholder="Search events by title, location or description..."
        className="pl-10"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default EventSearch;
