import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "search_projects",
  title: "Search projects",
  description:
    "Search SIZU impact projects by free text, sector, SDG, location or status. Returns the most recent matches.",
  inputSchema: {
    query: z.string().trim().optional().describe("Free text matched against project name and brief."),
    sector: z.string().trim().optional().describe("Sector filter, e.g. Health or Agriculture."),
    sdg: z.string().trim().optional().describe("Sustainable Development Goal filter."),
    location: z.string().trim().optional().describe("Location or region filter."),
    status: z.string().trim().optional().describe("Project status filter."),
    limit: z.number().int().min(1).max(50).default(10).describe("Maximum number of projects to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, sector, sdg, location, status, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    let q = supabase
      .from("projects")
      .select("id, name, brief, sector, sdg, location, status, start_date, end_date, organization_id")
      .order("created_at", { ascending: false })
      .limit(limit ?? 10);

    if (query) {
      const safe = query.replace(/[,%]/g, " ").trim();
      if (safe) q = q.or(`name.ilike.%${safe}%,brief.ilike.%${safe}%`);
    }
    if (sector) q = q.ilike("sector", `%${sector}%`);
    if (sdg) q = q.ilike("sdg", `%${sdg}%`);
    if (location) q = q.ilike("location", `%${location}%`);
    if (status) q = q.ilike("status", `%${status}%`);

    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { projects: data ?? [] },
    };
  },
});
