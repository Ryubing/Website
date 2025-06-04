import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const API_URL = `https://git.ryujinx.app/api/v4/projects/1/releases/permalink/latest`;

interface ReleaseAssets {
    links: ReleaseAssetLink[];
}

interface ReleaseAssetLink {
    name: string;
    url: string;
}

async function fetchLatestRelease() {
    try {
        const response = await fetch(API_URL, {
            headers: {
                "User-Agent": "Ryujinx",
                "Accept": "application/vnd.github.v3+json",
            },
        });

        const data = await response.json();
        const assets: ReleaseAssets = data.assets;

        const downloads = {
            WINDOWS_URL: assets.links.find(asset => asset.name.includes("win_x64.zip"))?.url || "",
            WINDOWSARM_URL: assets.links.find(asset => asset.name.includes("win_arm64.zip"))?.url || "",
            MACOS_URL: assets.links.find(asset => asset.name.includes("macos_universal.app.tar.gz"))?.url || "",
            LINUX_URL: assets.links.find(asset => asset.name.includes("linux_x64.tar.gz"))?.url || "",
            APPIMAGE_URL: assets.links.find(asset => asset.name.includes("-x64.AppImage"))?.url || "",
            LINUXARM_URL: assets.links.find(asset => asset.name.includes("linux_arm64.tar.gz"))?.url || "",
            APPIMAGEARM_URL: assets.links.find(asset => asset.name.includes("-arm64.AppImage"))?.url || ""
        };

        // update Consts class
    const constsContent = `export default class Consts {
    static readonly WINDOWS_URL = "${downloads.WINDOWS_URL}" as const;
    static readonly WINDOWSARM_URL = "${downloads.WINDOWSARM_URL}" as const;
    static readonly MACOS_URL = "${downloads.MACOS_URL}" as const;
    static readonly LINUX_URL = "${downloads.LINUX_URL}" as const;
    static readonly APPIMAGE_URL = "${downloads.APPIMAGE_URL}" as const;
    static readonly LINUXARM_URL = "${downloads.LINUXARM_URL}" as const;
    static readonly APPIMAGEARM_URL = "${downloads.APPIMAGEARM_URL}" as const;
}`;

fs.writeFileSync(path.join(__dirname, "../lib/consts.ts"), constsContent);
} catch {}
}

fetchLatestRelease();