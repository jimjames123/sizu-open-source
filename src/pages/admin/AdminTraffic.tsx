import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import {
  format,
  startOfDay,
  startOfWeek,
  startOfMonth,
  startOfYear,
  subDays,
  parseISO,
} from "date-fns";
import { Download, FileText, RefreshCcw, Activity } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Period = "daily" | "weekly" | "monthly" | "annual";

interface PageView {
  id: string;
  path: string;
  referrer: string | null;
  source: string | null;
  session_id: string;
  user_id: string | null;
  user_agent: string | null;
  created_at: string;
}

const PERIOD_DEFAULTS: Record<Period, number> = {
  daily: 30,
  weekly: 84, // 12 weeks
  monthly: 365,
  annual: 365 * 3,
};

const SOURCE_COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#7c3aed"];

function bucketStart(d: Date, period: Period): Date {
  switch (period) {
    case "daily":
      return startOfDay(d);
    case "weekly":
      return startOfWeek(d, { weekStartsOn: 1 });
    case "monthly":
      return startOfMonth(d);
    case "annual":
      return startOfYear(d);
  }
}

function bucketLabel(d: Date, period: Period): string {
  switch (period) {
    case "daily":
      return format(d, "MMM d");
    case "weekly":
      return `Wk ${format(d, "MMM d")}`;
    case "monthly":
      return format(d, "MMM yyyy");
    case "annual":
      return format(d, "yyyy");
  }
}

const AdminTraffic = () => {
  const [period, setPeriod] = useState<Period>("daily");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [segment, setSegment] = useState<"all" | "anonymous" | "authenticated">(
    "all"
  );
  const [from, setFrom] = useState<string>(
    format(subDays(new Date(), PERIOD_DEFAULTS.daily - 1), "yyyy-MM-dd")
  );
  const [to, setTo] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [rows, setRows] = useState<PageView[]>([]);
  const [loading, setLoading] = useState(false);
  const [liveCount, setLiveCount] = useState<number>(0);

  // Reset date range when period changes
  useEffect(() => {
    setFrom(format(subDays(new Date(), PERIOD_DEFAULTS[period] - 1), "yyyy-MM-dd"));
    setTo(format(new Date(), "yyyy-MM-dd"));
  }, [period]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const fromISO = new Date(from + "T00:00:00").toISOString();
      const toISO = new Date(to + "T23:59:59").toISOString();
      let query = supabase
        .from("page_views")
        .select("*")
        .gte("created_at", fromISO)
        .lte("created_at", toISO)
        .order("created_at", { ascending: false })
        .limit(10000);

      if (sourceFilter !== "all") query = query.eq("source", sourceFilter);
      if (segment === "anonymous") query = query.is("user_id", null);
      if (segment === "authenticated") query = query.not("user_id", "is", null);

      const { data, error } = await query;
      if (error) throw error;
      setRows((data || []) as PageView[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, sourceFilter, segment]);

  // Real-time: last 5 minutes count
  useEffect(() => {
    const refresh = async () => {
      const since = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const { count } = await supabase
        .from("page_views")
        .select("*", { count: "exact", head: true })
        .gte("created_at", since);
      setLiveCount(count || 0);
    };
    refresh();
    const interval = setInterval(refresh, 15000);

    const channel = supabase
      .channel("page_views_live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "page_views" },
        () => refresh()
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  // Aggregations
  const stats = useMemo(() => {
    const totalViews = rows.length;
    const sessions = new Set(rows.map((r) => r.session_id)).size;
    const users = new Set(
      rows.filter((r) => r.user_id).map((r) => r.user_id as string)
    ).size;
    // Approx session duration: per-session (max-min) avg
    const bySession = new Map<string, { min: number; max: number }>();
    rows.forEach((r) => {
      const t = new Date(r.created_at).getTime();
      const cur = bySession.get(r.session_id);
      if (cur) {
        cur.min = Math.min(cur.min, t);
        cur.max = Math.max(cur.max, t);
      } else {
        bySession.set(r.session_id, { min: t, max: t });
      }
    });
    const durations = Array.from(bySession.values()).map((s) => s.max - s.min);
    const avgDurationSec =
      durations.length > 0
        ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length / 1000)
        : 0;
    return { totalViews, sessions, users, avgDurationSec };
  }, [rows]);

  const series = useMemo(() => {
    const map = new Map<
      string,
      { ts: number; label: string; views: number; sessions: Set<string> }
    >();
    rows.forEach((r) => {
      const d = bucketStart(parseISO(r.created_at), period);
      const key = d.toISOString();
      const item =
        map.get(key) ||
        { ts: d.getTime(), label: bucketLabel(d, period), views: 0, sessions: new Set<string>() };
      item.views += 1;
      item.sessions.add(r.session_id);
      map.set(key, item);
    });
    return Array.from(map.values())
      .sort((a, b) => a.ts - b.ts)
      .map((x) => ({ label: x.label, views: x.views, sessions: x.sessions.size }));
  }, [rows, period]);

  const topPages = useMemo(() => {
    const m = new Map<string, number>();
    rows.forEach((r) => m.set(r.path, (m.get(r.path) || 0) + 1));
    return Array.from(m.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, views]) => ({ path, views }));
  }, [rows]);

  const sourceBreakdown = useMemo(() => {
    const m = new Map<string, number>();
    rows.forEach((r) => {
      const s = r.source || "direct";
      m.set(s, (m.get(s) || 0) + 1);
    });
    return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
  }, [rows]);

  // Comparison vs previous equal-length period
  const [prevTotal, setPrevTotal] = useState<number | null>(null);
  useEffect(() => {
    (async () => {
      const fromDate = new Date(from + "T00:00:00");
      const toDate = new Date(to + "T23:59:59");
      const span = toDate.getTime() - fromDate.getTime();
      const prevFrom = new Date(fromDate.getTime() - span - 1).toISOString();
      const prevTo = new Date(fromDate.getTime() - 1).toISOString();
      const { count } = await supabase
        .from("page_views")
        .select("*", { count: "exact", head: true })
        .gte("created_at", prevFrom)
        .lte("created_at", prevTo);
      setPrevTotal(count ?? 0);
    })();
  }, [from, to]);

  const growth =
    prevTotal && prevTotal > 0
      ? Math.round(((stats.totalViews - prevTotal) / prevTotal) * 100)
      : null;

  // Exports
  const exportCSV = () => {
    const header = ["bucket", "views", "sessions"];
    const lines = [header.join(",")].concat(
      series.map((s) => `${s.label},${s.views},${s.sessions}`)
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `traffic-${period}-${from}-to-${to}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Traffic Report", 14, 18);
    doc.setFontSize(10);
    doc.text(
      `${period.toUpperCase()} • ${from} → ${to} • Source: ${sourceFilter} • Segment: ${segment}`,
      14,
      26
    );

    autoTable(doc, {
      startY: 32,
      head: [["Metric", "Value"]],
      body: [
        ["Total page views", String(stats.totalViews)],
        ["Unique sessions", String(stats.sessions)],
        ["Logged-in users", String(stats.users)],
        ["Avg session duration", `${stats.avgDurationSec}s`],
        ["Vs previous period", growth === null ? "—" : `${growth > 0 ? "+" : ""}${growth}%`],
      ],
    });

    autoTable(doc, {
      head: [["Bucket", "Views", "Sessions"]],
      body: series.map((s) => [s.label, s.views, s.sessions]),
    });

    autoTable(doc, {
      head: [["Top page", "Views"]],
      body: topPages.map((p) => [p.path, p.views]),
    });

    autoTable(doc, {
      head: [["Source", "Views"]],
      body: sourceBreakdown.map((s) => [s.name, s.value]),
    });

    doc.save(`traffic-${period}-${from}-to-${to}.pdf`);
  };

  return (
    <AdminLayout
      title="Traffic Reports"
      description="Monitor site activity and generate daily, weekly, monthly, and annual reports."
    >
      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <Label>Period</Label>
              <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>From</Label>
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div>
              <Label>To</Label>
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <div>
              <Label>Source</Label>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="direct">Direct</SelectItem>
                  <SelectItem value="search">Search</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="internal">Internal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Segment</Label>
              <Select value={segment} onValueChange={(v) => setSegment(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All visitors</SelectItem>
                  <SelectItem value="authenticated">Logged in</SelectItem>
                  <SelectItem value="anonymous">Anonymous</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={fetchData} variant="outline" disabled={loading}>
                <RefreshCcw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Button onClick={exportCSV} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" /> CSV
            </Button>
            <Button onClick={exportPDF} variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" /> PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-600" /> Live (5 min)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{liveCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Page views</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Unique sessions</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.sessions.toLocaleString()}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Avg duration</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.avgDurationSec}s</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">vs previous</CardTitle></CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${growth === null ? "" : growth >= 0 ? "text-green-600" : "text-red-600"}`}>
              {growth === null ? "—" : `${growth > 0 ? "+" : ""}${growth}%`}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Traffic trend ({period})</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <LineChart data={series}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="views" stroke="#2563eb" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="sessions" stroke="#16a34a" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Top pages</CardTitle></CardHeader>
          <CardContent>
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <BarChart data={topPages} layout="vertical" margin={{ left: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="path" tick={{ fontSize: 11 }} width={140} />
                  <Tooltip />
                  <Bar dataKey="views" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Traffic sources</CardTitle></CardHeader>
          <CardContent>
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={sourceBreakdown} dataKey="value" nameKey="name" outerRadius={110} label>
                    {sourceBreakdown.map((_, i) => (
                      <Cell key={i} fill={SOURCE_COLORS[i % SOURCE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{period[0].toUpperCase() + period.slice(1)} report breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bucket</TableHead>
                <TableHead className="text-right">Page views</TableHead>
                <TableHead className="text-right">Unique sessions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {series.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                    {loading ? "Loading…" : "No traffic in this range yet."}
                  </TableCell>
                </TableRow>
              ) : (
                series.map((s) => (
                  <TableRow key={s.label}>
                    <TableCell className="font-medium">{s.label}</TableCell>
                    <TableCell className="text-right">{s.views.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{s.sessions.toLocaleString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminTraffic;
