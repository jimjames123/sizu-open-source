import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Loader2, ThumbsUp, ThumbsDown, Sparkles, MapPin, FileText, Users } from "lucide-react";

type ProjectLite = { id: string; name: string; location: string; sector: string };

export default function AdminAIInsights() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<ProjectLite[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");

  // Duplicates
  const [dupLoading, setDupLoading] = useState(false);
  const [dupResult, setDupResult] = useState<any>(null);

  // Collaborators
  const [collabLoading, setCollabLoading] = useState(false);
  const [collabResult, setCollabResult] = useState<any>(null);

  // Underserved
  const [regionLoading, setRegionLoading] = useState(false);
  const [regionResult, setRegionResult] = useState<any>(null);

  // Policy brief
  const [briefLoading, setBriefLoading] = useState(false);
  const [briefRegion, setBriefRegion] = useState("");
  const [briefSector, setBriefSector] = useState("");
  const [briefResult, setBriefResult] = useState<any>(null);
  const [savedBriefs, setSavedBriefs] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("projects")
      .select("id, name, location, sector")
      .order("created_at", { ascending: false })
      .limit(200)
      .then(({ data }) => setProjects(data ?? []));
    supabase
      .from("policy_briefs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => setSavedBriefs(data ?? []));
  }, []);

  const callFn = async (action: string, payload: Record<string, unknown> = {}) => {
    const { data, error } = await supabase.functions.invoke("ai-insights", {
      body: { action, ...payload },
    });
    if (error) throw error;
    return data;
  };

  const runDuplicates = async () => {
    if (!selectedProject) return toast({ title: "Select a project first" });
    setDupLoading(true);
    setDupResult(null);
    try {
      const data = await callFn("detect-duplicates", { project_id: selectedProject });
      setDupResult(data);
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    } finally {
      setDupLoading(false);
    }
  };

  const runCollaborators = async () => {
    if (!selectedProject) return toast({ title: "Select a project first" });
    setCollabLoading(true);
    setCollabResult(null);
    try {
      const data = await callFn("recommend-collaborators", { project_id: selectedProject });
      setCollabResult(data);
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    } finally {
      setCollabLoading(false);
    }
  };

  const runRegions = async () => {
    setRegionLoading(true);
    try {
      const data = await callFn("underserved-regions");
      setRegionResult(data);
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    } finally {
      setRegionLoading(false);
    }
  };

  const runBrief = async () => {
    setBriefLoading(true);
    setBriefResult(null);
    try {
      const data = await callFn("policy-brief", {
        region: briefRegion || undefined,
        sector: briefSector || undefined,
      });
      setBriefResult(data);
      const { data: refreshed } = await supabase
        .from("policy_briefs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);
      setSavedBriefs(refreshed ?? []);
      toast({ title: "Brief generated" });
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    } finally {
      setBriefLoading(false);
    }
  };

  const recordFeedback = async (
    table: "duplicate_feedback" | "collaboration_feedback",
    payload: Record<string, unknown>,
  ) => {
    const { error } = await supabase.from(table).insert(payload as any);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else toast({ title: "Feedback saved" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6">
        <AdminSidebar />
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <h1 className="text-2xl font-bold">AI Insights</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Lightweight v1: duplicate detection, collaborator recommendations, underserved-region
            analysis, and policy briefs. Powered by SIZU AI.
          </p>

          <Tabs defaultValue="duplicates">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
              <TabsTrigger value="duplicates"><FileText className="h-4 w-4 mr-1" />Duplicates</TabsTrigger>
              <TabsTrigger value="collab"><Users className="h-4 w-4 mr-1" />Collaboration</TabsTrigger>
              <TabsTrigger value="regions"><MapPin className="h-4 w-4 mr-1" />Underserved</TabsTrigger>
              <TabsTrigger value="brief"><Sparkles className="h-4 w-4 mr-1" />Policy Brief</TabsTrigger>
            </TabsList>

            {/* Shared project picker */}
            <Card className="mt-4">
              <CardContent className="pt-4">
                <label className="text-sm font-medium">Target project (for Duplicates & Collaboration)</label>
                <select
                  className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                >
                  <option value="">— Select a project —</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} · {p.location}</option>
                  ))}
                </select>
              </CardContent>
            </Card>

            <TabsContent value="duplicates" className="space-y-4 mt-4">
              <Button onClick={runDuplicates} disabled={dupLoading || !selectedProject}>
                {dupLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Detect duplicates
              </Button>
              {dupResult?.candidates?.length === 0 && (
                <p className="text-sm text-muted-foreground">No similar projects found.</p>
              )}
              {dupResult?.candidates?.map((c: any, i: number) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{c.project.name}</CardTitle>
                      <div className="flex gap-2">
                        <Badge>{Math.round((c.similarity ?? 0) * 100)}% match</Badge>
                        <Badge variant="outline">{c.verdict}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium mb-1">Target</div>
                        <div className="text-muted-foreground">{dupResult.target.brief}</div>
                      </div>
                      <div>
                        <div className="font-medium mb-1">Candidate</div>
                        <div className="text-muted-foreground">{c.project.brief}</div>
                      </div>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">Reasons</div>
                      <ul className="list-disc ml-5 text-muted-foreground">
                        {c.reasons?.map((r: string, j: number) => <li key={j}>{r}</li>)}
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => recordFeedback("duplicate_feedback", {
                        project_id: dupResult.target.id,
                        similar_project_id: c.project.id,
                        similarity_score: c.similarity,
                        verdict: "confirmed",
                        reasons: c.reasons,
                      })}><ThumbsUp className="h-4 w-4 mr-1" />Confirm duplicate</Button>
                      <Button size="sm" variant="outline" onClick={() => recordFeedback("duplicate_feedback", {
                        project_id: dupResult.target.id,
                        similar_project_id: c.project.id,
                        similarity_score: c.similarity,
                        verdict: "denied",
                        reasons: c.reasons,
                      })}><ThumbsDown className="h-4 w-4 mr-1" />Not a duplicate</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="collab" className="space-y-4 mt-4">
              <Button onClick={runCollaborators} disabled={collabLoading || !selectedProject}>
                {collabLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Recommend collaborators
              </Button>
              {collabResult?.recommendations?.map((r: any, i: number) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{r.org.organization_name}</CardTitle>
                      <Badge>{Math.round((r.fit ?? 0) * 100)}% fit</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p className="text-muted-foreground">{r.rationale}</p>
                    <div className="flex flex-wrap gap-1">
                      {r.complementary?.map((c: string, j: number) => (
                        <Badge key={j} variant="secondary">{c}</Badge>
                      ))}
                    </div>
                    {r.intro_message && (
                      <Textarea value={r.intro_message} readOnly className="text-xs h-20" />
                    )}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => recordFeedback("collaboration_feedback", {
                        project_id: collabResult.target.id,
                        suggested_org_id: r.org.id,
                        match_score: r.fit,
                        verdict: "accepted",
                        rationale: { rationale: r.rationale, complementary: r.complementary },
                      })}><ThumbsUp className="h-4 w-4 mr-1" />Accept</Button>
                      <Button size="sm" variant="outline" onClick={() => recordFeedback("collaboration_feedback", {
                        project_id: collabResult.target.id,
                        suggested_org_id: r.org.id,
                        match_score: r.fit,
                        verdict: "rejected",
                        rationale: { rationale: r.rationale },
                      })}><ThumbsDown className="h-4 w-4 mr-1" />Reject</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="regions" className="space-y-4 mt-4">
              <Button onClick={runRegions} disabled={regionLoading}>
                {regionLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Analyze coverage
              </Button>
              {regionResult && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Coverage by region (avg {regionResult.average_projects_per_million} projects per million people)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {regionResult.regions.map((r: any) => (
                        <div key={r.region} className="border rounded p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">{r.region} Region</div>
                            <Badge variant={r.status === "severely_underserved" ? "destructive" : r.status === "underserved" ? "default" : "secondary"}>
                              {r.status.replace(/_/g, " ")}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
                            <div>Population: {r.population_millions}M</div>
                            <div>Projects: {r.project_count}</div>
                            <div>Per million: {r.projects_per_million}</div>
                            <div>Unmet need: {r.unmet_need_index}</div>
                          </div>
                          <div className="mt-2 h-2 bg-gray-200 rounded overflow-hidden">
                            <div
                              className="h-full bg-red-500"
                              style={{ width: `${r.unmet_need_index * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="brief" className="space-y-4 mt-4">
              <Card>
                <CardContent className="pt-4 space-y-3">
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">Region (optional)</label>
                      <Input placeholder="e.g. Central" value={briefRegion} onChange={(e) => setBriefRegion(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Sector (optional)</label>
                      <Input placeholder="e.g. Health" value={briefSector} onChange={(e) => setBriefSector(e.target.value)} />
                    </div>
                  </div>
                  <Button onClick={runBrief} disabled={briefLoading}>
                    {briefLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Generate policy brief
                  </Button>
                </CardContent>
              </Card>

              {briefResult?.content && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{briefResult.content.title}</CardTitle>
                    <Badge variant="outline" className="w-fit">Confidence: {briefResult.content.confidence ?? "n/a"}</Badge>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p>{briefResult.content.executive_summary}</p>
                    <div>
                      <div className="font-medium">Key findings</div>
                      <ul className="list-disc ml-5 text-muted-foreground">
                        {briefResult.content.key_findings?.map((k: string, i: number) => <li key={i}>{k}</li>)}
                      </ul>
                    </div>
                    <div>
                      <div className="font-medium">Recommended actions</div>
                      <ul className="list-disc ml-5 text-muted-foreground">
                        {briefResult.content.recommended_actions?.map((k: string, i: number) => <li key={i}>{k}</li>)}
                      </ul>
                    </div>
                    {briefResult.content.data_limitations?.length > 0 && (
                      <div>
                        <div className="font-medium">Data limitations</div>
                        <ul className="list-disc ml-5 text-muted-foreground">
                          {briefResult.content.data_limitations.map((k: string, i: number) => <li key={i}>{k}</li>)}
                        </ul>
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" onClick={() => {
                        const blob = new Blob([briefResult.content.markdown ?? ""], { type: "text/markdown" });
                        const a = document.createElement("a");
                        a.href = URL.createObjectURL(blob);
                        a.download = `${briefResult.content.title ?? "brief"}.md`;
                        a.click();
                      }}>Download Markdown</Button>
                      <Button size="sm" variant="outline" onClick={() => {
                        const blob = new Blob([JSON.stringify(briefResult.content, null, 2)], { type: "application/json" });
                        const a = document.createElement("a");
                        a.href = URL.createObjectURL(blob);
                        a.download = `${briefResult.content.title ?? "brief"}.json`;
                        a.click();
                      }}>Download JSON</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {savedBriefs.length > 0 && (
                <Card>
                  <CardHeader><CardTitle className="text-base">Previous briefs</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-1">
                      {savedBriefs.map((b) => (
                        <li key={b.id} className="flex items-center justify-between border-b py-1">
                          <span>{b.title} <span className="text-muted-foreground text-xs">({b.region ?? "all"} · {b.sector ?? "all"})</span></span>
                          <span className="text-xs text-muted-foreground">{new Date(b.created_at).toLocaleDateString()}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
