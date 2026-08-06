import { updateOrderStatus } from "@/services/dashboard";

export async function PUT(req: Request) {
    try {
        const payload = await req.json();
        const order_id = payload.order_id;
        const user_id = payload.user_id;
        const user_name = payload.user_name;
        const org_id = payload.organization_id;
        const status = payload.status;
        const product_name = payload.product_name;
        const update = await updateOrderStatus(order_id,
            user_id,
            user_name,
            org_id,
            status,
            product_name);
        if (update?.status === "success") {
            return Response.json({ data: { status: "success" } })
        }
        else {
            return Response.json({ data: { status: "failed", message: update?.message } })
        }
    }
    catch (e) {
        return Response.json({ data: { status: "failed", message: e } })
    }
}