import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Content-Type": "application/json",
};

const sdgLookup: Record<string, string> = {
  "1": "No Poverty",
  "2": "Zero Hunger",
  "3": "Good Health and Well-being",
  "4": "Quality Education",
  "5": "Gender Equality",
  "6": "Clean Water and Sanitation",
  "7": "Affordable and Clean Energy",
  "8": "Decent Work and Economic Growth",
  "9": "Industry, Innovation and Infrastructure",
  "10": "Reduced Inequality",
  "11": "Sustainable Cities and Communities",
  "12": "Responsible Consumption and Production",
  "13": "Climate Action",
  "14": "Life Below Water",
  "15": "Life on Land",
  "16": "Peace, Justice and Strong Institutions",
  "17": "Partnerships for the Goals",
};

const normalizeValue = (value: string) =>
  value.toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();

serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    // Always use anon key on this public endpoint so RLS is enforced.
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase environment variables are not configured.");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const url = new URL(request.url);

    const location = url.searchParams.get("location")?.trim();
    const sector = url.searchParams.get("sector")?.trim();
    const sdg = url.searchParams.get("sdg")?.trim();
    const project =
      url.searchParams.get("project")?.trim() ?? url.searchParams.get("name")?.trim();
    const target = url.searchParams.get("target")?.trim();
    const status = url.searchParams.get("status")?.trim();
    const q = url.searchParams.get("q")?.trim();

    let query = supabase
      .from("projects")
      .select(
        `
          id,
          name,
          brief,
          location,
          sector,
          sdg,
          target_groups,
          status,
          start_date,
          end_date,
          image,
          organization_id,
          metadata,
          profiles:organization_id(organization_name)
        `,
      )
      .order("created_at", { ascending: false });

    if (status) {
      query = query.ilike("status", `%${status}%`);
    }

    if (q) {
      const normalizedQ = q.replace(/'/g, "''");
      query = query.or(
        `name.ilike.%${normalizedQ}%,location.ilike.%${normalizedQ}%,sector.ilike.%${normalizedQ}%,sdg.ilike.%${normalizedQ}%`,
      );
    }

    if (location) {
      query = query.ilike("location", `%${location}%`);
    }

    if (sector) {
      query = query.ilike("sector", `%${sector}%`);
    }

    if (project) {
      query = query.ilike("name", `%${project}%`);
    }

    if (sdg) {
      const sdgSearchValue = sdgLookup[sdg] ?? sdg;
      query = query.ilike("sdg", `%${sdgSearchValue}%`);
    }

    const { data, error } = await query;
    if (error) {
      throw error;
    }

    const filteredData = target
      ? (data ?? []).filter((projectRecord) =>
          Array.isArray(projectRecord.target_groups) &&
          projectRecord.target_groups.some((group) => {
            const normalizedGroup = normalizeValue(group);
            const normalizedTarget = normalizeValue(target);

            return (
              normalizedGroup.includes(normalizedTarget) ||
              normalizedTarget.includes(normalizedGroup)
            );
          }),
        )
      : (data ?? []);

    return new Response(JSON.stringify(filteredData), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Projects API error:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
});
