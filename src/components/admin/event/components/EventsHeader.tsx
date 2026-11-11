
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import EventSearch from "./EventSearch";

interface EventsHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddEvent: () => void;
  title?: string;
}

const EventsHeader = ({ searchTerm, onSearchChange, onAddEvent, title = "Events Management" }: EventsHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <EventSearch searchTerm={searchTerm} onSearchChange={onSearchChange} />
      <Button onClick={onAddEvent} className="bg-blue-600 hover:bg-blue-700">
        <PlusCircle className="h-4 w-4 mr-2" />
        Add New
      </Button>
    </div>
  );
};

export default EventsHeader;
