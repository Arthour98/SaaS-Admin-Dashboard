import { deleteOrganization } from "@/services/dashboard";

export async function DELETE(request: Request) {
    const payload = await request.json();
    try {
        const org_id = payload.organization_id;
        const user_id = payload.user_id;
        const deleted = await deleteOrganization(org_id, user_id);
        if (deleted?.status == "success") {
            return Response.json({ data: { status: deleted?.status } })
        }
        else {
            return Response.json({ data: { status: deleted?.status, error: deleted?.error } });
        }
    }
    catch (e) {
        console.error(e);
        return Response.json({ data: { status: "error", error: e } });
    }
}