"use server";

import {Button} from "@once-ui-system/core";
import {headers} from "next/headers";
import {
    formatSupportedPlatform,
    resolveDownloadUrl,
    UpdateServerEndpoints,
    SupportedPlatform,
    SupportedCPUs,
    ReleaseChannel
} from "@/utils/downloads";

/**
 * @returns An empty JSX fragment if the requesting platform could not be detected; a clickable download button otherwise.
 */
export async function UserAgentDownloadButton({ getLabel }: {
    getLabel?: ((platform: SupportedPlatform, cpu: SupportedCPUs, rc?: ReleaseChannel) => string) | string
}) {
    const headerList = await headers();

    const variant = UpdateServerEndpoints.readUserAgent(headerList.get("user-agent"));

    if (!variant) return <></>;

    return <DownloadButton platform={variant.platform} cpu={variant.cpu} getLabel={getLabel}/>
}

/**
 * @returns A clickable download button, directing the user to an Update Server download API endpoint matching the specified parameters.
 */
export async function DownloadButton(
    {
        platform, cpu, rc, getLabel
    }: {
        platform: SupportedPlatform,
        cpu: SupportedCPUs,
        rc?: ReleaseChannel,
        getLabel?: ((platform: SupportedPlatform, cpu: SupportedCPUs, rc?: ReleaseChannel) => string) | string
    }
) {

    const label = getLabel == undefined
        ? `${formatSupportedPlatform(platform)} (${cpu})`
        : typeof getLabel === "string"
            ? getLabel
            : getLabel(platform, cpu, rc);

    return (
        <Button
            prefixIcon="download"
            label={label}
            href={await resolveDownloadUrl(platform, cpu, rc)}
        ></Button>
    );
}
