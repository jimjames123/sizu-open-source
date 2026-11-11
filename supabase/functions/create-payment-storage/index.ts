// Creates the payment-proofs bucket. Admin-only.
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

  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  if (!supabaseKey || !supabaseUrl) {
    return new Response(
      JSON.stringify({ error: "Server is not configured" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) throw new Error(`Error listing buckets: ${listError.message}`);

    const bucketName = "payment-proofs";
    const exists = buckets.some((b) => b.name === bucketName);
    if (exists) {
      return new Response(
        JSON.stringify({ message: `Bucket ${bucketName} already exists` }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { error: createError } = await supabase.storage.createBucket(bucketName, {
      public: false,
      fileSizeLimit: 5242880,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/gif", "application/pdf"],
    });
    if (createError) throw new Error(`Error creating bucket: ${createError.message}`);

    return new Response(
      JSON.stringify({ message: `Successfully created bucket: ${bucketName}` }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in edge function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unknown error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
