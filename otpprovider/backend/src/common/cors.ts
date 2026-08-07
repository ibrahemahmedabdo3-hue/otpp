// Builds the CORS options for both the local/docker entry point (main.ts)
// and the Vercel serverless entry point (api/index.ts), so the two never
// drift apart.
//
// Comparing against FRONTEND_URL with a plain string match is fragile:
// "https://otpprovider.com" and "https://www.otpprovider.com" are
// different origins as far as the browser/CORS spec is concerned, but
// they're the same site from the user's point of view, and it's easy to
// end up on the "wrong" one depending on how Vercel's domain redirect is
// configured. This treats the www and apex versions of FRONTEND_URL as
// interchangeable instead of requiring an exact match.
export function buildCorsOptions():
  | boolean
  | { origin: (origin: string | undefined, cb: (err: Error | null, allow?: boolean) => void) => void; credentials: boolean } {
  const frontendUrl = process.env.FRONTEND_URL;

  if (process.env.NODE_ENV !== 'production' || !frontendUrl) {
    // Local dev / docker-compose: allow everything so it works out of the box.
    return true;
  }

  let bareHost: string;
  try {
    bareHost = new URL(frontendUrl).hostname.replace(/^www\./, '');
  } catch {
    // FRONTEND_URL isn't a valid URL - fall back to a plain exact match
    // rather than crashing the whole app on a misconfigured env var.
    return {
      origin: (origin, cb) => cb(null, origin === frontendUrl),
      credentials: true,
    };
  }

  return {
    origin: (origin, cb) => {
      if (!origin) {
        // Non-browser requests (curl, server-to-server, health checks)
        // don't send an Origin header at all - always allow those.
        return cb(null, true);
      }
      try {
        const host = new URL(origin).hostname.replace(/^www\./, '');
        return cb(null, host === bareHost);
      } catch {
        return cb(null, false);
      }
    },
    credentials: true,
  };
}
