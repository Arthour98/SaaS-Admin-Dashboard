import { DeleteCustomer } from "@/services/dashboard";

export async function DELETE(req: Request) {
    try {
        const payload = await req.json();
        const customer_id = payload.customer_id;
        const deleted = await DeleteCustomer(customer_id)
        if (deleted?.status == "success") {
            return Response.json({ data: { status: deleted?.status } })
        }
        else {
            return Response.json({ status: "failed" })
        }
    }
    catch (e) {
        return Response.json({ data: { status: "failed", message: e } })
    }
}