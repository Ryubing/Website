export type SupportedPlatform = "win" | "mac" | "linux" | "linuxai";
export type SupportedCPUs = "x64" | "arm64";
export type ReleaseChannel = "stable" | "canary" | "kenjinx";

export class UpdateServerEndpoints {
  private static readonly _urlFormat: string =
    "https://update.ryujinx.app/download/query?os={OS}&arch={ARCH}&rc={RC}" as const;

  public static get(
    platform: SupportedPlatform,
    cpu: SupportedCPUs,
    rc: ReleaseChannel = "stable",
  ) {
    return this._urlFormat.replace("{OS}", platform).replace("{ARCH}", cpu).replace("{RC}", rc);
  }

  public static readUserAgent(userAgent: string | undefined | null): {
    platform: SupportedPlatform;
    cpu: SupportedCPUs;
  } | undefined {
    if (!userAgent) return undefined;

    if (userAgent.includes("Windows")) {
      return userAgent.includes("ARM")
        ? { platform: "win", cpu: "arm64" }
        : { platform: "win", cpu: "x64" }
    } else if (userAgent.includes("Macintosh")) {
      return { platform: "mac", cpu: "arm64" }
    } else if (userAgent.includes("Linux")) {
      return userAgent.includes("aarch") || userAgent.includes("arm")
        ? { platform: "linux", cpu: "arm64" }
        : { platform: "linux", cpu: "x64" }
    }

    return undefined;
  }
}

export function formatSupportedCPU(cpu: SupportedCPUs) {
  switch (cpu) {
    case "x64":
      return "Intel/AMD";
    case "arm64":
      return "ARM";
  }
}

export function formatSupportedPlatform(platform: SupportedPlatform) {
  switch (platform) {
    case "win":
      return "Windows";
    case "mac":
      return "Mac";
    case "linux":
      return "Linux";
    case "linuxai":
      return "Linux (AppImage)";
  }
}

export function getDownloadUrlFromUserAgent(
  userAgent: string | undefined | null,
  rc: ReleaseChannel = "stable",
): string {
  const variant = UpdateServerEndpoints.readUserAgent(userAgent)

  if (!variant)
    return ""

  return UpdateServerEndpoints.get(variant.platform, variant.cpu, rc)
}

// The public UpdateServer instance has its /download/* endpoints disabled
// (HTTP 418), so download links are resolved straight from the Forgejo
// releases API instead, mirroring the UpdateServer's own asset matching.
const forgejoBaseUrl = "https://git.ryujinx.app";

const forgejoRepos: Record<ReleaseChannel, { owner: string; repo: string }> = {
  stable: { owner: "projects", repo: "Ryubing" },
  canary: { owner: "Ryubing", repo: "Canary" },
  kenjinx: { owner: "projects", repo: "Kenji-NX" },
};

interface ForgejoAsset {
  name?: string;
  browser_download_url?: string;
}

interface ForgejoRelease {
  tag_name?: string;
  assets?: ForgejoAsset[];
}

export function getReleasesPageUrl(rc: ReleaseChannel = "stable"): string {
  const { owner, repo } = forgejoRepos[rc] ?? forgejoRepos.stable;
  return `${forgejoBaseUrl}/${owner}/${repo}/releases`;
}

function matchesVariant(name: string, platform: SupportedPlatform, cpu: SupportedCPUs): boolean {
  const n = name.toLowerCase();

  switch (platform) {
    case "win":
      return n.includes(`win_${cpu}`);
    case "mac":
      return n.includes("macos_universal") || n.includes("macos_arm64");
    case "linux":
      return n.includes(`linux_${cpu}`) && n.includes(".tar.");
    case "linuxai":
      return n.endsWith(`${cpu}.appimage`);
  }
}

function pickAssetUrl(
  assets: ForgejoAsset[],
  platform: SupportedPlatform,
  cpu: SupportedCPUs,
): string {
  const matches = assets.filter(
    (a) => a.name && a.browser_download_url && matchesVariant(a.name, platform, cpu),
  );

  if (matches.length === 0) return "";

  // Canary ships both .zip/.7z and .tar.gz/.tar.xz variants; prefer the most widely supported one.
  const preferred = matches.find((a) => {
    const n = (a.name as string).toLowerCase();
    return n.endsWith(".zip") || n.endsWith(".tar.gz") || n.endsWith(".appimage");
  });

  return (preferred ?? matches[0]).browser_download_url as string;
}

export async function resolveDownloadUrl(
  platform: SupportedPlatform,
  cpu: SupportedCPUs,
  rc: ReleaseChannel = "stable",
): Promise<string> {
  const { owner, repo } = forgejoRepos[rc] ?? forgejoRepos.stable;

  try {
    const res = await fetch(`${forgejoBaseUrl}/api/v1/repos/${owner}/${repo}/releases/latest`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return getReleasesPageUrl(rc);

    const release: ForgejoRelease = await res.json();

    return pickAssetUrl(release.assets ?? [], platform, cpu) || getReleasesPageUrl(rc);
  } catch {
    return getReleasesPageUrl(rc);
  }
}
