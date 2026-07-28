import { DeleteOrder } from "@/services/dashboard";

export async function DELETE(req: Request) {
    try {
        const payload = await req.json();
        const order_id = payload.order_id;
        const deleted = await DeleteOrder(order_id);
        return Response.json({ data: { status: deleted?.status } })
    }
    catch (e) {
        return Response.json({ data: { status: "failed", message: e } })
    }
}