
import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, ArrowRight } from "lucide-react";
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
  event_date: string;
  location: string;
}

interface EventCarouselProps {
  events: Event[];
}

const EventCarousel = ({ events }: EventCarouselProps) => {
  if (!events.length) {
    return (
      <Card className="shadow-sm">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No market place events found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 3000,
          stopOnInteraction: true,
        }),
      ]}
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full relative"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {events.map((event) => (
          <CarouselItem key={event.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="mb-3">
                  <Badge className="bg-purple-100 text-purple-800">
                    {format(new Date(event.event_date), "MMM dd, yyyy")}
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                <div className="flex items-center text-gray-500 mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  {event.location}
                </div>
                <Link 
                  to={`/admin/events`}
                  className="text-blue-600 hover:underline flex items-center"
                >
                  View Details <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
};

export default EventCarousel;
