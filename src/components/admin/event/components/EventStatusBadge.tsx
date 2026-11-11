
import React from "react";
import { Badge } from "@/components/ui/badge";
import { isPast, isToday, isFuture } from "date-fns";

interface EventStatusBadgeProps {
  eventDate: string;
  endDate: string | null;
}

const EventStatusBadge = ({ eventDate, endDate }: EventStatusBadgeProps) => {
  // Calculate event status based on dates
  const getEventStatus = (eventDate: string, endDate: string | null) => {
    const eventDateTime = new Date(eventDate);
    
    if (endDate) {
      const endDateTime = new Date(endDate);
      if (isPast(endDateTime)) return "past";
      if (isToday(eventDateTime) || (isToday(endDateTime))) return "today";
      return "upcoming";
    }
    
    if (isPast(eventDateTime) && !isToday(eventDateTime)) return "past";
    if (isToday(eventDateTime)) return "today";
    return "upcoming";
  };

  const status = getEventStatus(eventDate, endDate);

  return (
    <Badge className={
      status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
      status === 'today' ? 'bg-green-100 text-green-800' :
      'bg-gray-100 text-gray-800'
    }>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default EventStatusBadge;
