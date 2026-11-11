import { useEffect, useMemo, useState } from "react";
import { format, differenceInCalendarDays } from "date-fns";
import { ExternalLink, CalendarClock } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import SEO from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import {
  OPPORTUNITY_TYPES,
  OPPORTUNITY_SECTORS,
  formatAmount,
  type Opportunity,
} from "@/constants/opportunities";

const PAGE_SIZE = 8;

const Opportunities = () => {
  const [items, setItems] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("All");
  const [sector, setSector] = useState("All");
  const [deadlineFilter, setDeadlineFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    const load = async () => {
      const today = new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .eq("status", "live")
        .or(`deadline.is.null,deadline.gte.${today}`)
        .order("deadline", { ascending: true, nullsFirst: false });
      if (!error && data) setItems(data as Opportunity[]);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [type, sector, deadlineFilter]);

  const filtered = useMemo(() => {
    return items.filter((o) => {
      if (type !== "All" && o.opportunity_type !== type) return false;
      if (sector !== "All" && o.sector !== sector) return false;
      if (deadlineFilter !== "All") {
        if (!o.deadline) return false;
        const days = differenceInCalendarDays(new Date(o.deadline), new Date());
        if (deadlineFilter === "7" && days > 7) return false;
        if (deadlineFilter === "30" && days > 30) return false;
      }
      return true;
    });
  }, [items, type, sector, deadlineFilter]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <>
      <SEO
        title="Opportunity Tracker | Grants & Donations | SIZU"
        description="Track open grants, donations and funding calls for impact organizations in Uganda. Filter by type, sector and deadline."
        path="/opportunities"
      />
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Opportunity Hub
            </h1>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Open grants, donations and funding calls available to impact
              organizations — updated by the SIZU team.
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All types</SelectItem>
                {OPPORTUNITY_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sector} onValueChange={setSector}>
              <SelectTrigger>
                <SelectValue placeholder="Sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All sectors</SelectItem>
                {OPPORTUNITY_SECTORS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={deadlineFilter} onValueChange={setDeadlineFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Deadline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">Any deadline</SelectItem>
                <SelectItem value="7">Closing in 7 days</SelectItem>
                <SelectItem value="30">Closing in 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <p className="text-center text-muted-foreground">Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              No open opportunities match these filters.
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
                {filtered.length === 1 ? "opportunity" : "opportunities"}
              </p>

              <div className="space-y-4">
                {visible.map((o) => {
                  const days = o.deadline
                    ? differenceInCalendarDays(new Date(o.deadline), new Date())
                    : null;
                  return (
                    <article
                      key={o.id}
                      className="bg-white rounded-lg border shadow-sm p-5 flex flex-col md:flex-row md:items-start gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <h2 className="font-bold text-[15px] text-gray-900 mb-1">
                          {o.title}
                        </h2>
                        <p className="text-[12px] text-muted-foreground mb-2">
                          {o.funder_name}
                          {o.region ? ` · ${o.region}` : ""}
                        </p>
                        {o.description && (
                          <p className="text-[12px] text-gray-700 mb-2">
                            {o.description}
                          </p>
                        )}
                        {o.eligibility && (
                          <p className="text-[12px] text-gray-600 mb-3">
                            <span className="font-medium">Eligibility:</span>{" "}
                            {o.eligibility}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1.5">
                          <Badge variant="default" className="text-[11px]">
                            {o.opportunity_type}
                          </Badge>
                          <Badge variant="secondary" className="text-[11px]">
                            {o.sector}
                          </Badge>
                          {o.sdg && (
                            <Badge variant="outline" className="text-[11px]">
                              {o.sdg}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-start md:items-end gap-2 md:min-w-[200px]">
                        <span className="text-[13px] font-semibold text-gray-900">
                          {formatAmount(o)}
                        </span>
                        {o.deadline && (
                          <span className="text-[12px] text-muted-foreground flex items-center gap-1">
                            <CalendarClock className="h-3.5 w-3.5" />
                            Closes{" "}
                            <span className="font-medium text-gray-800">
                              {format(new Date(o.deadline), "MMM d, yyyy")}
                            </span>
                          </span>
                        )}
                        {days !== null && days <= 7 && (
                          <span className="text-[11px] font-semibold text-red-600">
                            {days <= 0 ? "Closing today" : `${days} day${days === 1 ? "" : "s"} left`}
                          </span>
                        )}
                        <Button
                          size="sm"
                          asChild
                          className="bg-red-600 text-white hover:bg-red-700"
                        >
                          <a
                            href={o.application_link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Apply Here
                            <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                          </a>
                        </Button>
                      </div>
                    </article>
                  );
                })}
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
            Opportunities close automatically once their deadline passes. Always
            confirm details on the funder's official page before applying.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Opportunities;
