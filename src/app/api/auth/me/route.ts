import { User } from "@/services/auth";

export async function GET() {
    const userData = await User();
    if (!userData?.user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "content-type": "application/json" },
        });
    }

    return new Response(JSON.stringify({ user: userData.user }), {
        status: 200,
        headers: { "content-type": "application/json" },
    });
}
