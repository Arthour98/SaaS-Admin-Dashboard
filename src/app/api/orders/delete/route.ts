import { DeleteOrder } from "@/services/dashboard";

export async function DELETE(req: Request) {
    try {
        const payload = await req.json();
        const order_id = payload.order_id;
        const user_id = payload.user_id;
        const user_name = payload.user_name;
        const order_name = payload.order_name;
        const organization_id = payload.organization_id;

        const deleted = await DeleteOrder(order_id, user_id, user_name, order_name, organization_id);
        return Response.json({ data: { status: deleted?.status } })
    }
    catch (e) {
        return Response.json({ data: { status: "failed", message: e } })
    }
}