// Shared helper: validates caller JWT and checks admin status.
// Returns the authenticated user record on success, or a Response to return on failure.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

export async function requireAdmin(
  req: Request,
  corsHeaders: Record<string, string>
): Promise<{ ok: true; userId: string } | { ok: false; response: Response }> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !anonKey) {
    return {
      ok: false,
      response: new Response(
        JSON.stringify({ error: "Server is not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      ),
    };
  }

  const auth = req.headers.get("Authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice("Bearer ".length) : "";
  if (!token) {
    return {
      ok: false,
      response: new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      ),
    };
  }

  const supabase = createClient(supabaseUrl, anonKey);
  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) {
    return {
      ok: false,
      response: new Response(
        JSON.stringify({ error: "Invalid or expired session" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      ),
    };
  }

  // Use the caller's JWT so RLS scopes the admin lookup correctly.
  const userScoped = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: adminRow } = await userScoped
    .from("admin_settings")
    .select("admin_email")
    .eq("admin_email", userData.user.email ?? "")
    .maybeSingle();

  if (!adminRow) {
    return {
      ok: false,
      response: new Response(
        JSON.stringify({ error: "Admin privileges required" }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      ),
    };
  }

  return { ok: true, userId: userData.user.id };
}
