import { leaveOrganization } from "@/services/dashboard";

export async function DELETE(request: Request) {
    const payload = await request.json();
    try {
        const org_id = payload.organization_id;
        const user_id = payload.user_id;
        const user_name = payload.user_name;
        const deleted = await leaveOrganization(org_id, user_id, user_name);
        if (deleted?.status == "success") {
            return Response.json({ data: { status: deleted?.status } })
        }
    }
    catch (e) {
        console.error(e);
        return Response.json({ data: { status: "error", error: e } });
    }
}