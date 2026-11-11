
import React from "react";
import { Calendar, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventsEmptyStateProps {
  searchTerm: string;
  onAddEvent: () => void;
}

const EventsEmptyState = ({ searchTerm, onAddEvent }: EventsEmptyStateProps) => {
  return (
    <div className="text-center py-12 bg-white rounded-lg shadow">
      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-medium text-gray-900 mb-2">No events found</h3>
      <p className="text-gray-600">
        {searchTerm ? "No events match your search criteria." : "There are no events added yet."}
      </p>
      {!searchTerm && (
        <Button onClick={onAddEvent} className="mt-4 bg-blue-600 hover:bg-blue-700">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Your First Event
        </Button>
      )}
    </div>
  );
};

export default EventsEmptyState;
