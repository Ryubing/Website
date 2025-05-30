import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = ({ params, request, redirect }) => {
    if (!(request.headers.get("user-agent") || "").includes("Ryujinx"))
        return redirect("/", 307)

    return new Response(
        JSON.stringify({
            canary: "iurehg8uetgyh8ui5e/cr",
            stable: "Ryubing/Stable-Releases"
        }),
        {
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
};