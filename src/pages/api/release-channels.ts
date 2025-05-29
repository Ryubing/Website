export async function GET() {
    return new Response(
        JSON.stringify({
            canary: "iurehg8uetgyh8ui5e/cr",
            stable: "iurehg8uetgyh8ui5e/sr"
        }),
        {
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
}