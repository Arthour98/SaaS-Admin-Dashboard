import { getOrganizationLogs } from "@/services/dashboard";
import { User } from "@/services/auth";

export async function GET(req: Request) {
    try {
        const user = await User();
        const organization_id = Number(new URL(req.url).searchParams.get("organization_id"));
        if (!user || !organization_id) {
            return Response.json({ data: { status: "error", message: "Unauthorized or invalid organization" } }, { status: 400 });
        }

        const logs = await getOrganizationLogs(organization_id);
        return Response.json({ data: { status: "success", logs: logs.logs || [] } });
    }
    catch (e) {
        return Response.json({ data: { status: "error", message: String(e) } }, { status: 500 });
    }
}
