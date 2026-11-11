// AI Insights edge function: duplication detection, collaboration recommendation,
// underserved-region analysis, and policy-brief generation.
// Uses the Lovable AI Gateway (google/gemini-2.5-flash) for LLM reasoning,
// and Postgres aggregation for region coverage. Lightweight v1.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { requireAdmin } from "../_shared/requireAdmin.ts";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const MODEL = "google/gemini-2.5-flash";

type Project = {
  id: string;
  name: string;
  brief: string;
  description: string | null;
  sector: string;
  sdg: string;
  location: string;
  target_groups: string[];
  start_date: string;
  end_date: string | null;
  organization_id: string;
};

async function callLLM(system: string, user: string, jsonMode = true) {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${LOVABLE_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`AI gateway ${res.status}: ${txt}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

// Simple lexical similarity for candidate retrieval (no embeddings in v1).
function tokenize(s: string): Set<string> {
  return new Set(
    (s || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3),
  );
}
function jaccard(a: Set<string>, b: Set<string>): number {
  const inter = [...a].filter((x) => b.has(x)).length;
  const union = new Set([...a, ...b]).size || 1;
  return inter / union;
}

async function detectDuplicates(supabase: any, projectId: string) {
  const { data: target } = await supabase.from("projects").select("*").eq("id", projectId).single();
  if (!target) throw new Error("Project not found");
  const { data: others } = await supabase
    .from("projects")
    .select("*")
    .neq("id", projectId)
    .limit(500);

  const targetText = `${target.name} ${target.brief} ${target.description ?? ""} ${target.sector} ${target.sdg}`;
  const targetTokens = tokenize(targetText);
  const scored = (others ?? [])
    .map((p: Project) => {
      const text = `${p.name} ${p.brief} ${p.description ?? ""} ${p.sector} ${p.sdg}`;
      const lex = jaccard(targetTokens, tokenize(text));
      const sectorMatch = p.sector === target.sector ? 0.15 : 0;
      const sdgMatch = p.sdg === target.sdg ? 0.1 : 0;
      const locMatch = p.location === target.location ? 0.1 : 0;
      return { project: p, score: Math.min(1, lex + sectorMatch + sdgMatch + locMatch) };
    })
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 5);

  if (scored.length === 0) return { target, candidates: [] };

  const prompt = `Target project:\nName: ${target.name}\nBrief: ${target.brief}\nSector: ${target.sector} | SDG: ${target.sdg} | Location: ${target.location}\n\nCandidates:\n${scored
    .map(
      (c: any, i: number) =>
        `[${i}] ${c.project.name} — ${c.project.brief} (sector: ${c.project.sector}, location: ${c.project.location})`,
    )
    .join("\n")}\n\nFor each candidate return JSON {"results":[{"index":N,"similarity":0-1,"verdict":"likely_duplicate|partial_overlap|distinct","reasons":["...","...","..."]}]}`;

  const raw = await callLLM(
    "You are an expert NGO project reviewer detecting duplicate or overlapping projects. Return valid JSON only.",
    prompt,
  );
  let parsed: any = { results: [] };
  try { parsed = JSON.parse(raw); } catch { /* ignore */ }

  const enriched = scored.map((c: any, i: number) => {
    const r = parsed.results?.find((x: any) => x.index === i) ?? {};
    return {
      project: c.project,
      lexical_score: Number(c.score.toFixed(3)),
      similarity: r.similarity ?? c.score,
      verdict: r.verdict ?? "partial_overlap",
      reasons: r.reasons ?? ["sector/location overlap"],
    };
  });
  return { target, candidates: enriched };
}

async function recommendCollaborators(supabase: any, projectId: string) {
  const { data: target } = await supabase.from("projects").select("*, organizations(*)").eq("id", projectId).single();
  if (!target) throw new Error("Project not found");
  const { data: orgs } = await supabase
    .from("organizations")
    .select("id, organization_name, organization_brief, organization_type, address")
    .eq("is_approved", true)
    .neq("id", target.organization_id)
    .limit(200);

  const targetTokens = tokenize(`${target.brief} ${target.sector} ${target.sdg}`);
  const ranked = (orgs ?? [])
    .map((o: any) => ({
      org: o,
      score: jaccard(targetTokens, tokenize(`${o.organization_brief ?? ""} ${o.organization_type ?? ""}`)),
    }))
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 8);

  if (ranked.length === 0) return { target, recommendations: [] };

  const prompt = `Project: ${target.name}\nGoal: ${target.brief}\nSector: ${target.sector} | SDG: ${target.sdg} | Location: ${target.location}\n\nCandidate organizations:\n${ranked
    .map((r: any, i: number) => `[${i}] ${r.org.organization_name} (${r.org.organization_type}) — ${r.org.organization_brief ?? "no brief"}`)
    .join("\n")}\n\nReturn JSON {"results":[{"index":N,"fit":0-1,"rationale":"1 line","complementary":["skill1","skill2"],"intro_message":"2-sentence intro template"}]} for top 5 by collaboration fit.`;

  const raw = await callLLM(
    "You match NGOs for collaboration based on complementary skills, geography, and mission alignment. Return JSON only.",
    prompt,
  );
  let parsed: any = { results: [] };
  try { parsed = JSON.parse(raw); } catch { /* ignore */ }

  const enriched = (parsed.results ?? []).map((r: any) => ({
    org: ranked[r.index]?.org,
    fit: r.fit,
    rationale: r.rationale,
    complementary: r.complementary ?? [],
    intro_message: r.intro_message ?? "",
  })).filter((x: any) => x.org);
  return { target, recommendations: enriched };
}

// Lightweight population baseline for Uganda regions (millions, rough 2024 estimate).
const REGION_POP: Record<string, number> = {
  Central: 11.0,
  Western: 9.5,
  Eastern: 10.5,
  Northern: 7.5,
};

async function underservedRegions(supabase: any) {
  const { data: projects } = await supabase.from("projects").select("location, target_groups");
  const counts: Record<string, { projects: number; beneficiaries: number }> = {};
  for (const region of Object.keys(REGION_POP)) counts[region] = { projects: 0, beneficiaries: 0 };
  for (const p of projects ?? []) {
    // Try to match the project location to one of the known regions.
    const loc = (p.location ?? "").toString();
    const region = Object.keys(REGION_POP).find((r) => loc.toLowerCase().includes(r.toLowerCase()));
    if (region) {
      counts[region].projects += 1;
      counts[region].beneficiaries += (p.target_groups?.length ?? 0) * 100;
    }
  }
  const rows = Object.entries(REGION_POP).map(([region, popM]) => {
    const c = counts[region];
    const perCapita = c.projects / popM; // projects per million people
    return {
      region,
      population_millions: popM,
      project_count: c.projects,
      projects_per_million: Number(perCapita.toFixed(2)),
      estimated_beneficiaries: c.beneficiaries,
    };
  });
  const avg = rows.reduce((s, r) => s + r.projects_per_million, 0) / rows.length || 1;
  const ranked = rows
    .map((r) => ({
      ...r,
      unmet_need_index: Number(Math.max(0, 1 - r.projects_per_million / (avg * 1.5)).toFixed(2)),
      status:
        r.projects_per_million < avg * 0.5
          ? "severely_underserved"
          : r.projects_per_million < avg
            ? "underserved"
            : "adequately_served",
    }))
    .sort((a, b) => b.unmet_need_index - a.unmet_need_index);
  return { regions: ranked, average_projects_per_million: Number(avg.toFixed(2)) };
}

async function generatePolicyBrief(supabase: any, params: { region?: string; sector?: string; userId: string }) {
  let q = supabase.from("projects").select("*");
  if (params.region) q = q.ilike("location", `%${params.region}%`);
  if (params.sector) q = q.eq("sector", params.sector);
  const { data: projects } = await q.limit(200);

  const summary = {
    total_projects: projects?.length ?? 0,
    sectors: [...new Set((projects ?? []).map((p: any) => p.sector))],
    sdgs: [...new Set((projects ?? []).map((p: any) => p.sdg))],
    locations: [...new Set((projects ?? []).map((p: any) => p.location))],
    sample: (projects ?? []).slice(0, 15).map((p: any) => ({
      name: p.name,
      brief: p.brief?.slice(0, 200),
      sector: p.sector,
      sdg: p.sdg,
      location: p.location,
    })),
  };

  const prompt = `Generate a policy brief for ${params.region ?? "all regions"}${params.sector ? ` in the ${params.sector} sector` : ""}.\n\nProject portfolio data:\n${JSON.stringify(summary, null, 2)}\n\nReturn JSON: {"title":"...","executive_summary":"...","key_findings":["...","...","..."],"recommended_actions":["...","..."],"trade_offs":["..."],"data_limitations":["..."],"confidence":"low|medium|high","markdown":"# Title\\n\\n... full 300-word brief ..."}`;

  const raw = await callLLM(
    "You are a policy analyst producing concise evidence-based briefs for funders and government. Return valid JSON only.",
    prompt,
  );
  let parsed: any = {};
  try { parsed = JSON.parse(raw); } catch {
    parsed = { title: "Policy Brief", markdown: raw, key_findings: [], recommended_actions: [] };
  }

  const admin = createClient(SUPABASE_URL, SERVICE_KEY);
  const { data: saved } = await admin
    .from("policy_briefs")
    .insert({
      title: parsed.title ?? `${params.region ?? "All"} brief`,
      region: params.region ?? null,
      sector: params.sector ?? null,
      content_markdown: parsed.markdown ?? "",
      content_json: parsed,
      generated_by: params.userId,
    })
    .select()
    .single();
  return { brief: saved, content: parsed };
}

async function precheckDuplicates(
  supabase: any,
  input: { name: string; brief: string; sector?: string; sdg?: string; location?: string; region?: string },
) {
  const { data: others } = await supabase
    .from("projects")
    .select("id, name, brief, description, sector, sdg, location, organization_id, status")
    .limit(500);

  const targetText = `${input.name} ${input.brief} ${input.sector ?? ""} ${input.sdg ?? ""}`;
  const targetTokens = tokenize(targetText);
  const targetLoc = (input.location || input.region || "").toLowerCase();

  const scored = (others ?? [])
    .map((p: any) => {
      const text = `${p.name} ${p.brief} ${p.description ?? ""} ${p.sector} ${p.sdg}`;
      const lex = jaccard(targetTokens, tokenize(text));
      const sectorMatch = input.sector && p.sector === input.sector ? 0.15 : 0;
      const sdgMatch = input.sdg && p.sdg === input.sdg ? 0.1 : 0;
      const locMatch = targetLoc && (p.location ?? "").toLowerCase().includes(targetLoc) ? 0.1 : 0;
      return { project: p, score: Math.min(1, lex + sectorMatch + sdgMatch + locMatch) };
    })
    .filter((c: any) => c.score >= 0.15)
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 5);

  if (scored.length === 0) return { candidates: [] };

  try {
    const prompt = `New project being created:\nName: ${input.name}\nBrief: ${input.brief}\nSector: ${input.sector ?? "n/a"} | SDG: ${input.sdg ?? "n/a"} | Location: ${input.location ?? input.region ?? "n/a"}\n\nExisting candidates:\n${scored
      .map(
        (c: any, i: number) =>
          `[${i}] ${c.project.name} — ${c.project.brief} (sector: ${c.project.sector}, location: ${c.project.location})`,
      )
      .join("\n")}\n\nReturn JSON {"results":[{"index":N,"similarity":0-1,"verdict":"likely_duplicate|partial_overlap|distinct","reasons":["...","..."]}]}`;
    const raw = await callLLM(
      "You are an expert NGO project reviewer detecting duplicate or overlapping projects. Return valid JSON only.",
      prompt,
    );
    const parsed = JSON.parse(raw);
    const enriched = scored.map((c: any, i: number) => {
      const r = parsed.results?.find((x: any) => x.index === i) ?? {};
      return {
        project: c.project,
        lexical_score: Number(c.score.toFixed(3)),
        similarity: r.similarity ?? c.score,
        verdict: r.verdict ?? "partial_overlap",
        reasons: r.reasons ?? ["sector/location overlap"],
      };
    });
    return { candidates: enriched };
  } catch (_e) {
    return {
      candidates: scored.map((c: any) => ({
        project: c.project,
        lexical_score: Number(c.score.toFixed(3)),
        similarity: c.score,
        verdict: c.score > 0.45 ? "likely_duplicate" : "partial_overlap",
        reasons: ["lexical similarity"],
      })),
    };
  }
}

async function requireAuthUser(req: Request, cors: Record<string, string>) {
  const auth = req.headers.get("Authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice("Bearer ".length) : "";
  if (!token) {
    return {
      ok: false as const,
      response: new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401,
        headers: { ...cors, "Content-Type": "application/json" },
      }),
    };
  }
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const client = createClient(SUPABASE_URL, anonKey);
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user) {
    return {
      ok: false as const,
      response: new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
        headers: { ...cors, "Content-Type": "application/json" },
      }),
    };
  }
  return { ok: true as const, userId: data.user.id };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const action = body.action as string;
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    // precheck-duplicates is available to any authenticated user (project creation flow).
    if (action === "precheck-duplicates") {
      const auth = await requireAuthUser(req, corsHeaders);
      if (!auth.ok) return auth.response;
      if (!body.name || !body.brief) {
        return new Response(JSON.stringify({ error: "name and brief are required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const result = await precheckDuplicates(supabase, {
        name: body.name,
        brief: body.brief,
        sector: body.sector,
        sdg: body.sdg,
        location: body.location,
        region: body.region,
      });
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const gate = await requireAdmin(req, corsHeaders);
    if (!gate.ok) return gate.response;

    let result: unknown;
    if (action === "detect-duplicates") {
      result = await detectDuplicates(supabase, body.project_id);
    } else if (action === "recommend-collaborators") {
      result = await recommendCollaborators(supabase, body.project_id);
    } else if (action === "underserved-regions") {
      result = await underservedRegions(supabase);
    } else if (action === "policy-brief") {
      result = await generatePolicyBrief(supabase, {
        region: body.region,
        sector: body.sector,
        userId: gate.userId,
      });
    } else {
      return new Response(JSON.stringify({ error: "Unknown action" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-insights error", e);
    const msg = e instanceof Error ? e.message : String(e);
    const status = msg.includes("429") ? 429 : msg.includes("402") ? 402 : 500;
    return new Response(JSON.stringify({ error: msg }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
