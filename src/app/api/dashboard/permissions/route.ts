import { assignRoleWithPermissions } from "@/services/dashboard";

export async function PUT(req: Request) {
    try {
        const payload = await req.json();
        const user_id = payload.user_id;
        const organization_id = payload.organization_id;
        const permissions = JSON.stringify(payload.permissions);
        const role = payload.role;
        const user_name = payload.user_name;
        const member_name = payload.member_name;
        const handler_id = payload.handler_id;

        const assign = await assignRoleWithPermissions({
            handler_id,
            user_id,
            organization_id,
            role,
            permissions,
            user_name,
            member_name
        });
        if (assign?.status === "success") {
            return Response.json({ data: { status: "success" } });
        }
        else {
            return Response.json({ data: { status: "failed" } });
        }
    }
    catch (e) {
        console.error(["ROUTE_ERROR"]);
        return Response.json({ data: { status: "failed", message: e } });
    }
}