import { joinOrg } from "@/services/dashboard";

export async function POST(request: Request) {
    const payload = await request.json();
    try {
        const new_org = await joinOrg(payload.name, payload.user_id, payload.token);
        if (new_org) {
            if (new_org.status == "success") {
                return Response.json({ status: new_org.status });
            }
        }
    }
    catch (e) {
        return Response.json({ error: "[ERROR]->" + e });
    }
}