import { getOrgTicketMessages } from "@/services/dashboard";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const user_id = Number(searchParams.get("user_id"));
        const ticket_id = Number(searchParams.get("ticket_id"));

        const messages = await getOrgTicketMessages(user_id, ticket_id);
        if (messages?.status === "success") {
            return Response.json({ data: { status: "success", messages: messages.messages } })
        }
    }
    catch (e) {
        return Response.json({ error: e })
    }
}