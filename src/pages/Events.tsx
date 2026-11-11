
import React from "react";
import SEO from "@/components/seo/SEO";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, Image } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Event {
  id: string;
  title: string;
  description: string | null;
  location: string;
  event_date: string;
  end_date: string | null;
  image_url: string | null;
  is_active?: boolean;
  event_type?: string;
  online_link?: string | null;
}

const Events = () => {
  const { data: marketplaceData, isLoading, error } = useQuery({
    queryKey: ["marketplace"],
    queryFn: async () => {
      const [eventsResult, advertsResult] = await Promise.all([
        supabase.from("events").select("*").eq("is_active", true).order("event_date", { ascending: true }),
        supabase.from("business_adverts").select("*").eq("is_active", true)
      ]);
      
      if (eventsResult.error) throw eventsResult.error;
      if (advertsResult.error) throw advertsResult.error;
      
      return {
        events: eventsResult.data || [],
        adverts: advertsResult.data || []
      };
    },
  });

  const events = marketplaceData?.events || [];
  const businessAdverts = marketplaceData?.adverts || [];

  return (
    <>
      <SEO title="Market Place — Events & Opportunities | SIZU" description="Discover upcoming events, business opportunities, and announcements from impact organizations across Uganda on the SIZU Market Place." path="/events" />
      <Navbar />
      <main className="page-container pt-12 pb-20">
        {/* Red header section */}
        <div className="red-header text-center">
          <h1>Market Place</h1>
          <p className="mx-auto">
            Join us for collaborative workshops, conferences, and networking opportunities
            to strengthen development efforts across Uganda.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-10">
            <p className="text-gray-600">Loading marketplace...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">Error loading marketplace. Please try again later.</p>
          </div>
        ) : (events.length > 0 || businessAdverts.length > 0) ? (
          <div className="space-y-12">
            {events.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}

            {businessAdverts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Business Advertisements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {businessAdverts.map((advert: any) => (
                    <BusinessAdvertCard key={advert.id} advert={advert} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-600">No marketplace items at the moment.</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

const EventCard = ({ event }: { event: Event }) => {
  // Get first two letters from event title for placeholder
  const initials = event.title
    .split(' ')
    .slice(0, 2)
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase();
    
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <div className="h-48 bg-gray-200 flex-shrink-0">
        {event.image_url ? (
          <img 
            src={event.image_url} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-sizu-red/90 to-sizu-red text-white">
            <div className="flex flex-col items-center justify-center">
              <div className="text-3xl font-bold mb-2">{initials}</div>
              <Image className="h-8 w-8 opacity-50" />
            </div>
          </div>
        )}
      </div>
      <CardContent className="p-6 flex-grow flex flex-col min-h-[200px]">
        <h3 className="text-xl font-bold mb-2 line-clamp-2">{event.title}</h3>
        
        {event.description && (
          <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
        )}
        
        <div className="mt-auto pt-4 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-sizu-red" />
            <span className="text-gray-700">
              {format(new Date(event.event_date), "MMM d, yyyy")}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-sizu-red" />
            <span className="text-gray-700">
              {format(new Date(event.event_date), "h:mm a")}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-sizu-red" />
            <span className="text-gray-700">
              {event.event_type === "online" ? "Online Event" : event.location}
            </span>
          </div>
        </div>
        
        <Link to={`/events/${event.id}`} className="mt-6 block">
          <Button variant="outline" className="w-full">
            Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

const BusinessAdvertCard = ({ advert }: { advert: any }) => {
  const initials = advert.business_name
    .split(' ')
    .slice(0, 2)
    .map((word: string) => word.charAt(0))
    .join('')
    .toUpperCase();

  const isActive = new Date() >= new Date(advert.start_date) && new Date() <= new Date(advert.end_date);

  return (
    <Link to={`/adverts/${advert.id}`} className="block h-full">
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col cursor-pointer">
      <div className="h-48 bg-gray-200 flex-shrink-0">
        {advert.flyer_url ? (
          <img 
            src={advert.flyer_url} 
            alt={advert.business_name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-sizu-red/90 to-sizu-red text-white">
            <div className="flex flex-col items-center justify-center">
              <div className="text-3xl font-bold mb-2">{initials}</div>
              <Image className="h-8 w-8 opacity-50" />
            </div>
          </div>
        )}
      </div>
      <CardContent className="p-6 flex-grow flex flex-col min-h-[200px]">
        <h3 className="text-xl font-bold mb-2 line-clamp-2">{advert.business_name}</h3>
        
        {advert.business_category && (
          <p className="text-gray-600 mb-4 line-clamp-3">{advert.business_category}</p>
        )}
        
        <div className="mt-auto pt-4 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-sizu-red" />
            <span className="text-gray-700">{advert.physical_address}</span>
          </div>
          
          {advert.contact_info && (
            <div className="flex items-center gap-2">
              <span className="text-gray-700">{advert.contact_info}</span>
            </div>
          )}

          {!isActive && (
            <div className="text-xs text-gray-500 italic">
              Runs {format(new Date(advert.start_date), "MMM d")} - {format(new Date(advert.end_date), "MMM d, yyyy")}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
    </Link>
  );
};

export default Events;
