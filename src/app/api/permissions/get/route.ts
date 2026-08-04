import { getRoleAndPermissions } from "@/services/dashboard";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const user_id = Number(searchParams.get("user_id"));
        const perms = await getRoleAndPermissions(user_id);
        if (perms?.status === "success") {
            return Response.json({
                data: {
                    status: "success",
                    role: perms.role,
                    permissions: perms.permissions
                }
            })
        }
    }
    catch (e) {
        return Response.json({ data: { status: "error", message: e } })
    }
}