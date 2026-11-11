import React from "react";
import SEO from "@/components/seo/SEO";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { MapPin, Phone, Tag, ArrowLeft, Calendar } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Button } from "@/components/ui/button";

const AdvertDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: advert, isLoading, error } = useQuery({
    queryKey: ["advert", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("business_adverts")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as any;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="page-container">
          <div className="text-center py-10">
            <p className="text-gray-600">Loading advert details...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !advert) {
    return (
      <>
        <Navbar />
        <main className="page-container">
          <div className="text-center py-10">
            <p className="text-red-500">Advert not found.</p>
            <Link to="/events" className="mt-4 inline-block">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Market Place
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
      <SEO
        title={`${advert.business_name} | SIZU Market Place`}
        description={advert.business_category || `Business advert from ${advert.business_name} on SIZU.`}
        path={`/adverts/${id ?? ""}`}
      />
      <Navbar />
      <main className="page-container">
        <Link to="/events" className="inline-block mb-6">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Market Place
          </Button>
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            <div className="w-full lg:w-1/2 h-64 lg:h-auto bg-gray-200 flex-shrink-0">
              {advert.flyer_url ? (
                <img
                  src={advert.flyer_url}
                  alt={advert.business_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-sizu-black text-white">
                  <span className="font-bold text-3xl">SIZU</span>
                </div>
              )}
            </div>

            <div className="w-full lg:w-1/2 p-6 md:p-8 flex flex-col">
              <span className="inline-block w-fit mb-3 px-3 py-1 text-xs font-bold uppercase tracking-wide bg-sizu-red text-white rounded-full">
                Sponsored
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{advert.business_name}</h1>

              <div className="flex flex-col gap-4 mb-8 text-sm">
                {advert.business_category && (
                  <div className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-sizu-yellow" />
                    <span className="text-gray-700">{advert.business_category}</span>
                  </div>
                )}
                {advert.physical_address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-sizu-yellow" />
                    <span className="text-gray-700">{advert.physical_address}</span>
                  </div>
                )}
                {advert.contact_info && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-sizu-yellow" />
                    <span className="text-gray-700">{advert.contact_info}</span>
                  </div>
                )}
                {advert.start_date && advert.end_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-sizu-yellow" />
                    <span className="text-gray-700">
                      Runs {format(new Date(advert.start_date), "MMM d, yyyy")} – {format(new Date(advert.end_date), "MMM d, yyyy")}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={async () => {
                    const url = window.location.href;
                    try {
                      if (navigator.share) {
                        await navigator.share({
                          title: advert.business_name,
                          url,
                        });
                      } else {
                        await navigator.clipboard.writeText(url);
                        alert("Link copied to clipboard!");
                      }
                    } catch (e) {
                      console.error("Error sharing:", e);
                    }
                  }}
                >
                  Share
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

export default AdvertDetail;
