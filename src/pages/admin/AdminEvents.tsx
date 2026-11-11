import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import EventModal from "@/components/admin/event/EventModal";
import BusinessAdvertModal from "@/components/admin/business/BusinessAdvertModal";
import MarketplaceTypeSelector from "@/components/admin/marketplace/MarketplaceTypeSelector";
import EventsHeader from "@/components/admin/event/components/EventsHeader";
import EventList from "@/components/admin/event/components/EventList";
import EventsEmptyState from "@/components/admin/event/components/EventsEmptyState";
import EventsLoadingState from "@/components/admin/event/components/EventsLoadingState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminEvents = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<any[]>([]);
  const [businessAdverts, setBusinessAdverts] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [filteredAdverts, setFilteredAdverts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedAdvert, setSelectedAdvert] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("events");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      const [eventsResult, advertsResult] = await Promise.all([
        supabase.from("events").select("*").order("event_date", { ascending: false }),
        supabase.from("business_adverts").select("*").order("start_date", { ascending: false })
      ]);
      
      if (eventsResult.error) throw eventsResult.error;
      if (advertsResult.error) throw advertsResult.error;
      
      setEvents(eventsResult.data);
      setFilteredEvents(eventsResult.data);
      setBusinessAdverts(advertsResult.data);
      setFilteredAdverts(advertsResult.data);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error loading data",
        description: error.message || "Could not load data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredEvents(events);
      setFilteredAdverts(businessAdverts);
    } else {
      const filteredEvts = events.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredEvents(filteredEvts);

      const filteredAds = businessAdverts.filter(ad => 
        ad.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.business_category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.physical_address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAdverts(filteredAds);
    }
  }, [searchTerm, events, businessAdverts]);

  const handleAddNew = () => {
    setShowTypeSelector(true);
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setShowEventModal(true);
  };

  const handleAddBusiness = () => {
    setSelectedAdvert(null);
    setShowBusinessModal(true);
  };

  const handleEditEvent = (event: any) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleEditBusiness = (advert: any) => {
    setSelectedAdvert(advert);
    setShowBusinessModal(true);
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from("events")
        .update({ is_active: isActive } as any)
        .eq("id", id);
      
      if (error) throw error;
      
      toast({
        title: isActive ? "Event activated" : "Event paused",
        description: isActive ? "The event is now visible" : "The event is now hidden"
      });
      
      fetchData();
    } catch (error: any) {
      console.error("Error updating event:", error);
      toast({
        title: "Error updating event",
        description: error.message || "Failed to update the event",
        variant: "destructive"
      });
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event deleted successfully",
      });

      fetchData();
    } catch (error: any) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBusiness = async (id: string) => {
    try {
      const { error } = await supabase
        .from("business_adverts")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Business advertisement deleted successfully",
      });

      fetchData();
    } catch (error: any) {
      console.error("Error deleting business advert:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete business advertisement",
        variant: "destructive",
      });
    }
  };

  const handleModalClose = (refresh: boolean) => {
    setShowEventModal(false);
    setShowBusinessModal(false);
    if (refresh) {
      fetchData();
    }
  };

  return (
    <AdminLayout
      title="Marketplace Management"
      description="Manage events and business advertisements"
    >
      <EventsHeader 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddEvent={handleAddNew}
        title="Marketplace Management"
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="business">Business Ads</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="mt-6">
          {isLoading ? (
            <EventsLoadingState />
          ) : filteredEvents.length > 0 ? (
            <EventList 
              events={filteredEvents}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
              onToggleActive={handleToggleActive}
            />
          ) : (
            <EventsEmptyState 
              searchTerm={searchTerm}
              onAddEvent={handleAddEvent}
            />
          )}
        </TabsContent>

        <TabsContent value="business" className="mt-6">
          {isLoading ? (
            <EventsLoadingState />
          ) : filteredAdverts.length > 0 ? (
            <EventList 
              events={filteredAdverts.map(ad => ({
                id: ad.id,
                title: ad.business_name,
                description: ad.business_category,
                location: ad.physical_address,
                event_date: ad.start_date,
                end_date: ad.end_date,
                image_url: ad.flyer_url,
                is_active: ad.is_active,
              }))}
              onEditEvent={(item) => {
                const originalAd = businessAdverts.find(ad => ad.id === item.id);
                if (originalAd) handleEditBusiness(originalAd);
              }}
              onDeleteEvent={handleDeleteBusiness}
              onToggleActive={async (id: string, isActive: boolean) => {
                try {
                  const { error } = await supabase
                    .from("business_adverts")
                    .update({ is_active: isActive })
                    .eq("id", id);

                  if (error) throw error;

                  toast({
                    title: "Success",
                    description: `Business advertisement ${isActive ? "activated" : "deactivated"}`,
                  });

                  fetchData();
                } catch (error: any) {
                  toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                  });
                }
              }}
            />
          ) : (
            <EventsEmptyState 
              searchTerm={searchTerm}
              onAddEvent={handleAddBusiness}
            />
          )}
        </TabsContent>
      </Tabs>

      <MarketplaceTypeSelector
        isOpen={showTypeSelector}
        onClose={() => setShowTypeSelector(false)}
        onSelectEvent={handleAddEvent}
        onSelectBusiness={handleAddBusiness}
      />

      <EventModal 
        isOpen={showEventModal} 
        onClose={handleModalClose} 
        event={selectedEvent}
      />

      <BusinessAdvertModal 
        isOpen={showBusinessModal} 
        onClose={handleModalClose} 
        advert={selectedAdvert}
      />
    </AdminLayout>
  );
};

export default AdminEvents;
