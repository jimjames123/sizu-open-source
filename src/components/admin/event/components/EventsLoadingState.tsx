
import React from "react";
import { Loader2 } from "lucide-react";

const EventsLoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-12 w-12 animate-spin text-gray-600" />
      <p className="mt-4 text-gray-500">Loading events...</p>
    </div>
  );
};

export default EventsLoadingState;
