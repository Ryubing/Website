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
