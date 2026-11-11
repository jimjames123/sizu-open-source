
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

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

const UpcomingEvents = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { data: marketplaceItems, isLoading, error } = useQuery({
    queryKey: ["marketplace-homepage"],
    queryFn: async () => {
      const now = new Date().toISOString();
      const [eventsResult, advertsResult] = await Promise.all([
        supabase
          .from("events")
          .select("*")
          .eq("is_active", true)
          .or(`event_date.gte.${now},end_date.gte.${now}`)
          .order("event_date", { ascending: true })
          .limit(10),
        supabase
          .from("business_adverts")
          .select("*")
          .eq("is_active", true)
          .limit(10),
      ]);
      
      if (eventsResult.error) throw eventsResult.error;
      if (advertsResult.error) throw advertsResult.error;
      
      const events = (eventsResult.data || []).map((e: any) => ({ ...e, _type: "event" as const }));
      const adverts = (advertsResult.data || []).map((a: any) => ({ ...a, _type: "advert" as const }));
      return [...events, ...adverts];
    },
  });

  if (isLoading) {
    return (
      <section ref={ref} className="py-16 bg-gradient-to-br from-sizu-black via-gray-900 to-sizu-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            Loading Marketplace...
          </h2>
        </div>
      </section>
    );
  }

  if (error) {
    console.error("Error loading events:", error);
    return <section ref={ref} />;
  }

  return (
    <section ref={ref} className={`py-16 bg-gradient-to-br from-sizu-black via-gray-900 to-sizu-black relative overflow-hidden transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(234,179,8,0.1),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(239,68,68,0.1),transparent)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex flex-col items-center">
            <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider text-sizu-yellow uppercase bg-sizu-yellow/10 rounded-full border border-sizu-yellow/20">
              Discover Opportunities
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-sizu-yellow via-yellow-300 to-sizu-yellow bg-clip-text text-transparent">
                Market Place
              </span>
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-sizu-yellow to-sizu-red rounded-full mt-2" />
          </div>
        </div>
        
        {marketplaceItems && marketplaceItems.length > 0 ? (
          <Carousel
            plugins={[
              Autoplay({
                delay: 4000,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
            ]}
            opts={{
              align: "center",
              loop: marketplaceItems.length > 1,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {marketplaceItems.map((item) => (
                <CarouselItem
                  key={item.id}
                  className="pl-4 basis-[85%] sm:basis-[70%] md:basis-[60%] lg:basis-[55%]"
                >
                  {item._type === "event" ? <EventCard event={item} /> : <AdvertCard advert={item} />}
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 border-white/20 text-white hover:bg-white/10" />
            <CarouselNext className="right-2 border-white/20 text-white hover:bg-white/10" />
          </Carousel>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-300">No market place events at the moment.</p>
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link to="/events">
            <Button className="bg-sizu-yellow text-sizu-black hover:bg-yellow-400 font-semibold px-6 py-3">
              View All
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

const EventCard = ({ event }: { event: Event }) => {
  return (
    <Link to={`/events/${event.id}`} className="group block">
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-[1.015]">
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-sizu-red/60 to-sizu-yellow/60 flex items-center justify-center">
            <span className="font-extrabold text-3xl text-white">SIZU</span>
          </div>
        )}

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

        {/* Date badge */}
        <div className="absolute top-4 right-4 bg-sizu-yellow text-sizu-black px-3 py-1 rounded-full text-xs font-bold shadow-md">
          {format(new Date(event.event_date), "MMM d")}
        </div>

        {/* Bottom-left title block */}
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
          <h3 className="text-white text-xl md:text-2xl font-bold leading-tight line-clamp-2 drop-shadow-md">
            {event.title}
          </h3>
          <div className="mt-2 flex items-center gap-3 text-xs md:text-sm text-white/80">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-sizu-yellow" />
              {format(new Date(event.event_date), "MMM d, yyyy")}
            </span>
            <span className="inline-flex items-center gap-1 truncate">
              <MapPin className="h-3.5 w-3.5 text-sizu-yellow" />
              <span className="truncate">
                {event.event_type === "online" ? "Online Event" : event.location}
              </span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const AdvertCard = ({ advert }: { advert: any }) => {
  return (
    <Link to={`/adverts/${advert.id}`} className="group block">
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-[1.015]">
        {advert.flyer_url ? (
          <img
            src={advert.flyer_url}
            alt={advert.business_name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-sizu-red/60 to-sizu-yellow/60 flex items-center justify-center">
            <span className="font-extrabold text-3xl text-white">SIZU</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

        <div className="absolute top-4 right-4 bg-sizu-red text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-md">
          Sponsored
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
          <h3 className="text-white text-xl md:text-2xl font-bold leading-tight line-clamp-2 drop-shadow-md">
            {advert.business_name}
          </h3>
          {advert.physical_address && (
            <div className="mt-2 flex items-center gap-1 text-xs md:text-sm text-white/80">
              <MapPin className="h-3.5 w-3.5 text-sizu-yellow" />
              <span className="truncate">{advert.physical_address}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default UpcomingEvents;
