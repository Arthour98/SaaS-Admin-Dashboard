import { createOrgTicket } from "@/services/dashboard";

export async function POST(req: Request) {
    try {
        const payload = await req.json();
        const title = payload.title;
        const content = payload.content;
        const user_id = payload.user_id;
        const org_id = payload.organization_id;
        const user_name = payload.user_name;
        const create = await createOrgTicket(org_id, user_id, user_name, title, content);
        if (create?.status == "success") {
            return Response.json({ data: { status: "success" } })
        }
        else {
            return Response.json({ data: { status: "failed" } })
        }
    }
    catch (e) {
        return Response.json({ data: { status: "failed, " + e } })
    }
}
