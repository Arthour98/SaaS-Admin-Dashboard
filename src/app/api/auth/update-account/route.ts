import { updateUser } from "@/services/auth";

export async function PATCH(request: Request) {
    try {
        const payload = await request.json();
        const response = await updateUser(payload);
        return new Response(JSON.stringify(response), {
            status: response?.error ? 400 : 200,
            headers: { "content-type": "application/json" },
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: "Unable to update account" }), {
            status: 500,
            headers: { "content-type": "application/json" },
        });
    }
}
