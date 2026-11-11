import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_organizations",
  title: "List organizations",
  description: "List organizations registered on SIZU, optionally filtered by name or type.",
  inputSchema: {
    query: z.string().trim().optional().describe("Text matched against the organization name."),
    organization_type: z.string().trim().optional().describe("Organization type filter, e.g. NGO."),
    limit: z.number().int().min(1).max(50).default(15).describe("Maximum number of organizations to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, organization_type, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    let q = supabase
      .from("organizations")
      .select("id, name, organization_type, address, website, description")
      .order("created_at", { ascending: false })
      .limit(limit ?? 15);
    if (query) q = q.ilike("name", `%${query}%`);
    if (organization_type) q = q.ilike("organization_type", `%${organization_type}%`);

    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { organizations: data ?? [] },
    };
  },
});
