import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const GITHUB_REPO = "Ryubing/Stable-Releases";
const API_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;

interface ReleaseAsset {
    name: string;
    browser_download_url: string;
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
        const assets: ReleaseAsset[] = data.assets;

        const downloads = {
            WINDOWS_URL: assets.find(asset => asset.name.includes("win_x64.zip"))?.browser_download_url || "",
            WINDOWSARM_URL: assets.find(asset => asset.name.includes("win_arm64.zip"))?.browser_download_url || "",
            MACOS_URL: assets.find(asset => asset.name.includes("macos_universal.app.tar.gz"))?.browser_download_url || "",
            LINUX_URL: assets.find(asset => asset.name.includes("linux_x64.tar.gz"))?.browser_download_url || "",
            APPIMAGE_URL: assets.find(asset => asset.name.includes("-x64.AppImage"))?.browser_download_url || "",
            LINUXARM_URL: assets.find(asset => asset.name.includes("linux_arm64.tar.gz"))?.browser_download_url || "",
            APPIMAGEARM_URL: assets.find(asset => asset.name.includes("-arm64.AppImage"))?.browser_download_url || "",
            GITHUB_URL: "https://github.com/Ryubing/Stable-Releases/releases/"
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
    static readonly GITHUB_URL = "${downloads.GITHUB_URL}" as const;
}`;

fs.writeFileSync(path.join(__dirname, "../lib/consts.ts"), constsContent);
} catch {}
}

fetchLatestRelease();