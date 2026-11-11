
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Image, Calendar, MapPin, Clock, EyeIcon, Edit, Trash2, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import EventStatusBadge from "./EventStatusBadge";

interface EventListProps {
  events: any[];
  onEditEvent: (event: any) => void;
  onDeleteEvent: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

const EventList = ({ events, onEditEvent, onDeleteEvent, onToggleActive }: EventListProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                    {event.image_url ? (
                      <img 
                        src={event.image_url} 
                        alt={event.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div className="font-medium">{event.title}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                  {event.location}
                </div>
              </TableCell>
              <TableCell>
                <EventStatusBadge eventDate={event.event_date} endDate={event.end_date} />
              </TableCell>
              <TableCell>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                    {format(new Date(event.event_date), "MMM dd, yyyy")}
                  </div>
                  {event.end_date && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      Until: {format(new Date(event.end_date), "MMM dd, yyyy")}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    onClick={() => onEditEvent(event)}
                    title="Edit event"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Link 
                    to={`/events/${event.id}`}
                    className="h-8 w-8 p-0 inline-flex items-center justify-center text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md"
                    title="View event"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className={`h-8 w-8 p-0 ${event.is_active ? 'text-orange-600 hover:text-orange-800 hover:bg-orange-50' : 'text-green-600 hover:text-green-800 hover:bg-green-50'}`}
                    onClick={() => onToggleActive(event.id, !event.is_active)}
                    title={event.is_active ? "Pause event" : "Activate event"}
                  >
                    {event.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                    onClick={() => onDeleteEvent(event.id)}
                    title="Delete event"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EventList;
