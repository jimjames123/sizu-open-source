import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "sizu_session_id";

function getSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id =
      (crypto as any).randomUUID?.() ??
      `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function classifySource(referrer: string | null): string {
  if (!referrer) return "direct";
  try {
    const url = new URL(referrer);
    const host = url.hostname.toLowerCase();
    if (host === window.location.hostname) return "internal";
    if (/google|bing|duckduckgo|yahoo|baidu|yandex/.test(host)) return "search";
    if (/facebook|twitter|x\.com|linkedin|instagram|t\.co|youtube|tiktok|whatsapp|reddit/.test(host))
      return "social";
    return "referral";
  } catch {
    return "direct";
  }
}

export default function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    // Don't track admin pages — keep analytics clean
    if (location.pathname.startsWith("/admin")) return;

    const sessionId = getSessionId();
    const referrer = document.referrer || null;

    (async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        await supabase.from("page_views").insert({
          path: location.pathname,
          referrer,
          source: classifySource(referrer),
          session_id: sessionId,
          user_id: user?.id ?? null,
          user_agent: navigator.userAgent.slice(0, 500),
        });
      } catch {
        // Silently ignore tracking failures
      }
    })();
  }, [location.pathname]);
}
