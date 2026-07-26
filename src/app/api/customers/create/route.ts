import { addNewCustomer } from "@/services/dashboard";

export  async function POST(req: Request) {

    const payload = await req?.json();
    try {
        const customer = payload.customers[0];
        const org_id = payload.organization_id;
        const cus_name = customer.customer_name;
        const phone_number = customer.phone_number

        if (customer && org_id) {
            const new_cus = await addNewCustomer(org_id, cus_name, phone_number)
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