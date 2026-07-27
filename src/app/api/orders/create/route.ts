import { addNewOrder } from "@/services/dashboard";

export async function POST(req: Request) {
    const payload = await req?.json();

    try {
        const orders = payload.orders;
        const org_id = payload.organization_id;

        if (orders && org_id) {
            const new_orders = await addNewOrder(org_id, orders);
            if (new_orders?.status === "success") {
                return Response.json({ data: { status: new_orders.status } });
            }

            return Response.json({ data: { status: "failed" } });
        }
    } catch (e) {
        return Response.json({ data: { status: "failed", message: e } });
    }
}
