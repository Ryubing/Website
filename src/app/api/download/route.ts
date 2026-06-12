import { NextRequest, NextResponse } from "next/server";
import { ReleaseChannel, SupportedCPUs, SupportedPlatform } from "@/utils/downloads";

type LatestQueryResponse = {
  tag?: string;
  version?: string;
  web_url_format?: string;
  releaseUrlFormat?: string;
};

const UPDATE_SERVER_URL = "https://update.ryujinx.app/latest/query";

function isSupportedPlatform(value: string): value is SupportedPlatform {
  return ["win", "mac", "linux", "linuxai"].includes(value);
}

function isSupportedCpu(value: string): value is SupportedCPUs {
  return ["x64", "arm64"].includes(value);
}

function toServerReleaseChannel(rc: ReleaseChannel): "stable" | "canary" {
  if (rc === "canary" || rc === "kenjinx") return "canary";
  return "stable";
}

function getArtifactSuffix(platform: SupportedPlatform, cpu: SupportedCPUs): string {
  if (platform === "win") return cpu === "arm64" ? "win_arm64.zip" : "win_x64.zip";
  if (platform === "mac") return "macos_universal.app.tar.gz";
  if (platform === "linux") return cpu === "arm64" ? "linux_arm64.tar.gz" : "linux_x64.tar.gz";
  return cpu === "arm64" ? "arm64.AppImage" : "x64.AppImage";
}

function getReleaseBaseUrl(webUrlFormat: string): string {
  const releaseTagPath = "/releases/tag/{0}";
  if (webUrlFormat.includes(releaseTagPath)) {
    return webUrlFormat.slice(0, webUrlFormat.indexOf(releaseTagPath));
  }

  return webUrlFormat.replace("{0}", "").replace(/\/$/, "");
}

function buildDownloadUrl(
  webUrlFormat: string,
  tag: string,
  platform: SupportedPlatform,
  cpu: SupportedCPUs,
  rc: "stable" | "canary",
): string {
  const releaseBaseUrl = getReleaseBaseUrl(webUrlFormat);
  const artifactPrefix = rc === "canary" ? "ryujinx-canary" : "ryujinx";
  const artifactSuffix = getArtifactSuffix(platform, cpu);

  return `${releaseBaseUrl}/releases/download/${tag}/${artifactPrefix}-${tag}-${artifactSuffix}`;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const rawPlatform = searchParams.get("os");
  const rawCpu = searchParams.get("arch");
  const rawRc = searchParams.get("rc");

  if (!rawPlatform || !isSupportedPlatform(rawPlatform)) {
    return NextResponse.json({ error: "Invalid platform." }, { status: 400 });
  }

  if (!rawCpu || !isSupportedCpu(rawCpu)) {
    return NextResponse.json({ error: "Invalid architecture." }, { status: 400 });
  }

  const rc = toServerReleaseChannel((rawRc as ReleaseChannel | null) ?? "stable");

  const latestResponse = await fetch(
    `${UPDATE_SERVER_URL}?os=${rawPlatform}&arch=${rawCpu}&rc=${rc}`,
    { cache: "no-store" },
  );

  if (!latestResponse.ok) {
    return NextResponse.json({ error: "Failed to resolve latest release." }, { status: 502 });
  }

  const latest = (await latestResponse.json()) as LatestQueryResponse;
  const tag = latest.tag ?? latest.version;
  const webUrlFormat = latest.web_url_format ?? latest.releaseUrlFormat;

  if (!tag || !webUrlFormat) {
    return NextResponse.json({ error: "Malformed update metadata." }, { status: 502 });
  }

  const downloadUrl = buildDownloadUrl(webUrlFormat, tag, rawPlatform, rawCpu, rc);

  return NextResponse.redirect(downloadUrl);
}
