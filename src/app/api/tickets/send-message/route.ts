import { submitOrgTicketMessage } from "@/services/dashboard";

export async function POST(req: Request) {
    try {
        const payload = await req.json()
        const user_id = payload.user_id;
        const ticket_id = payload.ticket_id;
        const message = payload.message;
        const send = await submitOrgTicketMessage(user_id, ticket_id, message);
        if (send?.status === "success") {
            return Response.json({
                data: {
                    status: "success",
                    messages: send.messages
                }
            })
        }
        else {
            return Response.json({ data: { status: "failed" } })
        }
    }
    catch (e) {
        return Response.json({ data: { status: "error " + e } })
    }
}