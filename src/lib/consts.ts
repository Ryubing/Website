export default class Consts {
    static readonly WINDOWS_URL = "https://update.ryujinx.app/download/query?os=win&arch=x64&rc=stable" as const;
    static readonly MACOS_URL = "https://update.ryujinx.app/download/query?os=mac&arch=arm64&rc=stable" as const;
    static readonly LINUX_URL = "https://update.ryujinx.app/download/query?os=linux&arch=x64&rc=stable" as const;
    static readonly APPIMAGE_URL = "https://update.ryujinx.app/download/query?os=linuxai&arch=x64&rc=stable" as const;
    static readonly LINUXARM_URL = "https://update.ryujinx.app/download/query?os=linux&arch=arm64&rc=stable" as const;
    static readonly APPIMAGEARM_URL = "https://update.ryujinx.app/download/query?os=linuxai&arch=arm64&rc=stable" as const;

    static readonly FORGEJO_HOST = "git.greemdev.net"
}