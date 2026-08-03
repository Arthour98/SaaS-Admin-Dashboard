import { deleteUserAccount } from "@/services/auth";

export async function DELETE(request: Request) {
    try {
        const payload = await request.json();
        const response = await deleteUserAccount(payload.current_password);
        return new Response(JSON.stringify(response), {
            status: response?.error ? 400 : 200,
            headers: { "content-type": "application/json" },
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: "Unable to delete account" }), {
            status: 500,
            headers: { "content-type": "application/json" },
        });
    }
}
