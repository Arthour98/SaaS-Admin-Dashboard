import { joinOrg } from "@/services/dashboard";

export async function POST(request: Request) {
    const payload = await request.json();
    try {
        const new_org = await joinOrg(payload.id, payload.user_id, payload.token_id, payload.token);
        if (new_org) {
            return Response.json({ data: { status: new_org.status } });
        }
    }
    catch (e) {
        return Response.json({ data: { error: "[ERROR]->" + e } });
    }
}