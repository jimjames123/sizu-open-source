import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import SEO from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

const CATEGORIES = [
  "All",
  "Business Registration",
  "Tax & Compliance",
  "Finance",
  "Legal",
  "Agriculture",
  "Health",
] as const;

interface VitalInfoEntry {
  id: string;
  title: string;
  summary: string;
  source_name: string;
  category: string;
  web_link: string;
  valid_until: string | null;
  status: string;
  last_updated: string;
}

const PAGE_SIZE = 8;

const VitalInfo = () => {
  const [entries, setEntries] = useState<VitalInfoEntry[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("vital_info")
        .select("*")
        .eq("status", "live")
        .order("last_updated", { ascending: false });
      if (!error && data) setEntries(data as VitalInfoEntry[]);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory]);

  const filtered =
    activeCategory === "All"
      ? entries
      : entries.filter((e) => e.category === activeCategory);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <>
      <SEO
        title="Vital Info Hub | SIZU"
        description="Practical, verified information from SIZU's partners — MDAs, embassies, and private sector. Browse business, tax, legal, and sector guidance."
        path="/vital-info"
      />
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Vital Info Hub
            </h1>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Practical, verified information shared directly by SIZU's
              partners — MDAs, embassies, and private sector
            </p>
          </header>

          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                size="sm"
                variant={activeCategory === cat ? "default" : "outline"}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          {loading ? (
            <p className="text-center text-muted-foreground">Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              No vital info entries found in this category.
            </p>
          ) : (
            <>
              <p className="text-center text-xs text-muted-foreground mb-4">
                Showing{" "}
                <span className="font-semibold text-gray-800">
                  {visible.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-800">
                  {filtered.length}
                </span>{" "}
                {filtered.length === 1 ? "entry" : "entries"}
              </p>
              <div className="space-y-4">
                {visible.map((entry) => (
                  <article
                    key={entry.id}
                    className="bg-white rounded-lg border shadow-sm p-5 flex flex-col md:flex-row md:items-start gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-[14px] text-gray-900 mb-1">
                        {entry.title}
                      </h2>
                      <p className="text-[12px] text-muted-foreground mb-2">
                        {entry.source_name} · Updated{" "}
                        {format(new Date(entry.last_updated), "MMM d, yyyy")}
                      </p>
                      <p className="text-[12px] text-gray-700 mb-3">
                        {entry.summary}
                      </p>
                      <Badge variant="secondary" className="text-[11px]">
                        {entry.category}
                      </Badge>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-2 md:min-w-[180px]">
                      {entry.valid_until && (
                        <span className="text-[12px] text-muted-foreground">
                          Valid to:{" "}
                          <span className="font-medium text-gray-800">
                            {format(new Date(entry.valid_until), "MMM d, yyyy")}
                          </span>
                        </span>
                      )}
                      <Button
                        size="sm"
                        asChild
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        <a
                          href={entry.web_link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Open Here
                          <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                        </a>
                      </Button>
                    </div>
                  </article>
                ))}
              </div>

              <div className="flex justify-center mt-6 gap-3">
                {hasMore && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setVisibleCount((c) =>
                        Math.min(c + PAGE_SIZE, filtered.length)
                      )
                    }
                  >
                    Show more ({filtered.length - visibleCount} remaining)
                  </Button>
                )}
                {!hasMore && filtered.length > PAGE_SIZE && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setVisibleCount(PAGE_SIZE);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Show less
                  </Button>
                )}
              </div>
            </>
          )}

          <p className="mt-10 text-center text-xs text-muted-foreground">
            Information is shared by partners at agreed intervals and reviewed
            by the SIZU team before publishing.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default VitalInfo;
