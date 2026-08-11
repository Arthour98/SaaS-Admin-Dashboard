import { stripeClient } from "@/services/stripe";
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
import { createStripeEvent } from "@/db/queries/events";
import { createConnection } from "@/db/connection";

export async function POST(req: Request) {

    const body = await req.text();
    const signarute = req.headers.get("stripe-signature");
    let event = null;

    try {
        event = stripeClient.webhooks.constructEvent(body, signarute as string, WEBHOOK_SECRET as string);
    }
    catch (e) {
        console.error("[ERROR]->", e)
        return Response.json({ status: 400 })
    }

    const payload =
    {
        stripe_event_id: event.id,
        type: event.type,
        payload: event,
        processed: false
    }
    const conn = await createConnection();
    await createStripeEvent(conn, payload)

    return Response.json({ received: true })
}