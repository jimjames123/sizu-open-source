// Ensures that required storage buckets exist. Admin-only.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.4";
import { requireAdmin } from "../_shared/requireAdmin.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const gate = await requireAdmin(req, corsHeaders);
  if (!gate.ok) return gate.response;

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    const requiredBuckets = [
      {
        name: "payment-proofs",
        public: false,
        fileSizeLimit: 5242880,
        allowedMimeTypes: ["image/jpeg", "image/png", "image/gif", "application/pdf"],
      },
      {
        name: "event-images",
        public: true,
        fileSizeLimit: 10485760,
        allowedMimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/avif"],
      },
    ];

    const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) throw new Error(`Error listing buckets: ${listError.message}`);

    const results: Array<Record<string, string>> = [];
    for (const bucket of requiredBuckets) {
      const exists = existingBuckets?.some((b) => b.name === bucket.name);
      if (!exists) {
        const { error } = await supabase.storage.createBucket(bucket.name, {
          public: bucket.public,
          fileSizeLimit: bucket.fileSizeLimit,
          allowedMimeTypes: bucket.allowedMimeTypes,
        });
        results.push(
          error
            ? { bucket: bucket.name, status: "error", message: error.message }
            : { bucket: bucket.name, status: "created" }
        );
      } else {
        results.push({ bucket: bucket.name, status: "exists" });
      }
    }

    return new Response(JSON.stringify({ status: "success", results }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in ensure-storage-buckets function:", error);
    return new Response(
      JSON.stringify({ status: "error", message: error.message || "An unknown error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
