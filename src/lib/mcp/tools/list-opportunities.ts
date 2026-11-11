import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_opportunities",
  title: "List funding opportunities",
  description: "List grants, donations and other funding opportunities tracked on SIZU.",
  inputSchema: {
    opportunity_type: z.string().trim().optional().describe("Opportunity type filter, e.g. Grant."),
    sector: z.string().trim().optional().describe("Sector filter."),
    region: z.string().trim().optional().describe("Region filter."),
    limit: z.number().int().min(1).max(50).default(15).describe("Maximum number of opportunities to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ opportunity_type, sector, region, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    let q = supabase
      .from("opportunities")
      .select(
        "id, title, funder_name, opportunity_type, sector, region, sdg, amount_min, amount_max, currency, deadline, application_link, status",
      )
      .order("deadline", { ascending: true, nullsFirst: false })
      .limit(limit ?? 15);
    if (opportunity_type) q = q.ilike("opportunity_type", `%${opportunity_type}%`);
    if (sector) q = q.ilike("sector", `%${sector}%`);
    if (region) q = q.ilike("region", `%${region}%`);

    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { opportunities: data ?? [] },
    };
  },
});
