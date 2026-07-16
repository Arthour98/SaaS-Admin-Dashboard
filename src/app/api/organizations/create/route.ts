import { createOrg } from "@/services/dashboard";

export async function POST(request: Request) {
    const payload = await request.json();
    try {
        const new_org = await createOrg(payload.name, payload.user_id);
        if (new_org) {
            if (new_org.status == "success") {
                return Response.json({ data: { status: new_org.status } });
            }
        }
    }
    catch (e) {
        return Response.json({ data: { error: "[ERROR]->" + e } });
    }
}