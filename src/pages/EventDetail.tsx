
import React from "react";
import SEO from "@/components/seo/SEO";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, ArrowLeft } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Button } from "@/components/ui/button";

interface Event {
  id: string;
  title: string;
  description: string | null;
  location: string;
  event_date: string;
  end_date: string | null;
  image_url: string | null;
  event_type?: string;
  online_link?: string | null;
}

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: event, isLoading, error } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Event;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="page-container">
          <div className="text-center py-10">
            <p className="text-gray-600">Loading event details...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !event) {
    return (
      <>
        <Navbar />
        <main className="page-container">
          <div className="text-center py-10">
            <p className="text-red-500">Error loading event details or event not found.</p>
            <Link to="/events" className="mt-4 inline-block">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Events
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO title={event?.title ? `${event.title} | SIZU Events` : "Event | SIZU"} description={event?.description?.slice(0, 160) || "Upcoming events on SIZU Market Place."} path={`/events/${id ?? ""}`} jsonLd={event?.title ? { "@context": "https://schema.org", "@type": "Event", name: event.title, startDate: event.event_date, location: event.location } : undefined} />
      <Navbar />
      <main className="page-container">
        <Link to="/events" className="inline-block mb-6">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Button>
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            {/* Image Section */}
            <div className="w-full lg:w-1/2 h-64 lg:h-auto bg-gray-200 flex-shrink-0">
              {event.image_url ? (
                <img 
                  src={event.image_url} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-sizu-black text-white">
                  <span className="font-bold text-3xl">SIZU</span>
                </div>
              )}
            </div>
            
            {/* Content Section */}
            <div className="w-full lg:w-1/2 p-6 md:p-8 flex flex-col">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>
              
              <div className="flex flex-col gap-4 mb-8 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-sizu-yellow" />
                  <span className="text-gray-700">
                    {format(new Date(event.event_date), "EEEE, MMMM d, yyyy")}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-sizu-yellow" />
                  <span className="text-gray-700">
                    {format(new Date(event.event_date), "h:mm a")}
                    {event.end_date && ` - ${format(new Date(event.end_date), "h:mm a")}`}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-sizu-yellow" />
                  <span className="text-gray-700">
                    {event.event_type === "online" ? "Online Event" : event.location}
                  </span>
                </div>
                
                {event.event_type === "online" && event.online_link && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-sizu-yellow">Join Link:</span>
                    <a 
                      href={event.online_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm underline break-all"
                    >
                      {event.online_link}
                    </a>
                  </div>
                )}
              </div>
              
              {event.description && (
                <div className="prose max-w-none flex-grow">
                  <h2 className="text-xl font-semibold mb-4">About This Event</h2>
                  <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
                </div>
              )}
              
              <div className="mt-8">
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto"
                  onClick={async () => {
                    const url = window.location.href;
                    try {
                      if (navigator.share) {
                        await navigator.share({
                          title: event.title,
                          text: `Check out this event: ${event.title}`,
                          url: url,
                        });
                      } else {
                        await navigator.clipboard.writeText(url);
                        // You might want to add a toast notification here
                        alert('Event link copied to clipboard!');
                      }
                    } catch (error) {
                      console.error('Error sharing:', error);
                    }
                  }}
                >
                  Share Event
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default EventDetail;
