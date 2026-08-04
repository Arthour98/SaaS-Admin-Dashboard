import { addNewCustomers } from "@/services/dashboard";

export async function POST(req: Request) {

    const payload = await req?.json();
    try {
        const customers = payload.customers;
        const org_id = payload.organization_id;
        const user_id = payload.user_id;
        const user_name = payload.user_name;

        if (customers && org_id) {
            const new_cus = await addNewCustomers(org_id, customers, user_id, user_name)
            if (new_cus?.status == "success") {
                return Response.json({ data: { status: new_cus.status } })
            }
            else {
                return Response.json({ data: { status: "failed" } })
            }
        }
    }
    catch (e) {
        return Response.json({ data: { status: "failed", message: e } })
    }
}