import { editOrganization } from "@/services/dashboard";

export async function PUT(request: Request) {
    const payload = await request.json();
    try {
        const org_id = payload.organization_id;
        const user_id = payload.user_id;
        const name = payload.name;

        const deleted = await editOrganization(org_id, user_id, name);
        if (deleted?.status == "success") {
            return Response.json({ data: deleted.data, status: deleted?.status })
        }
    }
    catch (e) {
        console.error(e);
        return Response.json({ status: "error", error: e });
    }
}