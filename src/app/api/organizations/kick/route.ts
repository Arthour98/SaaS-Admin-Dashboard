import { kickOrganizationMember } from "@/services/dashboard";

export async function DELETE(req: Request) {
    try {
        const payload = await req.json();
        const delete_user_id = payload.deleted_user_id;
        const delete_user_name = payload.deleted_user_name;
        const user_id = payload.user_id;
        const user_name = payload.user_name;
        const org_id = payload.organization_id;

        const deleted = await kickOrganizationMember(
            delete_user_id,
            delete_user_name,
            user_id,
            user_name,
            org_id
        )
        if (deleted?.status == "success") {
            return Response.json({ data: { status: deleted.status } })
        }
        else {
            return Response.json({ data: { status: deleted?.status, message: deleted?.message } })
        }
    }
    catch (e) {
        return Response.json({ data: { status: "failed", message: e } })
    }
}