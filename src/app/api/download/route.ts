import { NextRequest, NextResponse } from "next/server";

const UPDATE_SERVER_BASE = "https://update.ryujinx.app";

/**
 * API route that proxies download requests to the Ryubing Update Server.
 *
 * Tries the structured API v1 first (`/api/v1/version/{rc}/latest?os=...&arch=...`),
 * which returns JSON with a `download_url`. Falls back to the legacy `/download/query`
 * endpoint if the v1 API doesn't return a usable URL.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const os = searchParams.get("os");
  const arch = searchParams.get("arch");
  const rc = searchParams.get("rc") || "stable";

  if (!os || !arch) {
    return NextResponse.json(
      { error: "Missing required query parameters: os, arch" },
      { status: 400 },
    );
  }

  // 1. Try the structured API v1 first
  const v1Url = `${UPDATE_SERVER_BASE}/api/v1/version/${rc}/latest?os=${os}&arch=${arch}`;

  try {
    const v1Response = await fetch(v1Url, { cache: "no-store" });

    if (v1Response.ok) {
      const data = await v1Response.json();
      if (data.download_url) {
        return NextResponse.redirect(data.download_url, 302);
      }
      // If download_url is empty but we have a tag and format, redirect to the
      // Forgejo release page (the user can find the right asset there)
      if (data.tag && data.web_url_format) {
        const releaseUrl = data.web_url_format.replace("{0}", data.tag);
        return NextResponse.redirect(releaseUrl, 302);
      }
    }
  } catch {
    // Network error — fall through to legacy endpoint
  }

  // 2. Fallback: try the legacy /download/query endpoint
  const legacyUrl =
    `${UPDATE_SERVER_BASE}/download/query?os=${os}&arch=${arch}&rc=${rc}&version=latest`;

  try {
    const legacyResponse = await fetch(legacyUrl, {
      method: "GET",
      redirect: "manual",
      cache: "no-store",
    });

    if (legacyResponse.status >= 300 && legacyResponse.status < 400) {
      const location = legacyResponse.headers.get("location");
      if (location) {
        return NextResponse.redirect(location, 302);
      }
    }
  } catch {
    // Network error — fall through to error response
  }

  // 3. Everything failed — redirect to the Forgejo releases page as a last resort
  return NextResponse.redirect(
    `${UPDATE_SERVER_BASE}/${rc === "canary" ? "Ryubing/Canary" : "projects/Ryubing"}/releases`,
    302,
  );
}
