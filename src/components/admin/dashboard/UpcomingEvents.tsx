
import React from "react";
import EventCarousel from "@/components/home/EventCarousel";

interface Event {
  id: string;
  title: string;
  event_date: string;
  location: string;
}

interface UpcomingEventsProps {
  events: Event[];
}

const UpcomingEvents = ({ events }: UpcomingEventsProps) => {
  return (
    <>
      <div className="mb-6">
        <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full border border-primary/20">
          Discover Opportunities
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
          <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
            Market Place
          </span>
        </h2>
        <div className="w-20 h-1.5 bg-gradient-to-r from-primary to-destructive rounded-full mt-3" />
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
        <EventCarousel events={events} />
      </div>
    </>
  );
};

export default UpcomingEvents;
