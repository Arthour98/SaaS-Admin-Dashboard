import { getOrgTickets } from "@/services/dashboard";

export async function GET(req: Request) {
    try {
        const payload = await req.json();
        const user_id = payload.user_id;
        const org_id = payload.organization_id;
        const tickets = await getOrgTickets(user_id, org_id);
        if (tickets?.tickets) {
            return Response.json({ tickets: tickets })
        }
    }
    catch (e) {
        return Response.json({ error: e })
    }
}