import { DeleteCustomer } from "@/services/dashboard";

export async function DELETE(req: Request) {
    try {
        const payload = await req.json();
        const customer_id = payload.customer_id;
        const user_id = payload.user_id;
        const org_id = payload.organization_id;
        const customer_name = payload.customer_name;
        const user_name = payload.user_name;

        const deleted = await DeleteCustomer(user_id, user_name, org_id, customer_id, customer_name);
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