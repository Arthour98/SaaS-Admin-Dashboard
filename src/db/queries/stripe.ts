
export const registerStripeAccount = async (conn: any, org_id: number, stripe_account_id: string) => {
    try {
        const [rows] = await conn.query(`INSERT INTO stripe(organization_id,stripe_account_id)
        VALUES(?,?)`, [org_id, stripe_account_id]);
        return { status: "success" }
    }
    catch (e) {
        console.error(e);
        return null;
    }

}

export const createStripeOrg = async (conn: any, org_id: number, stripe_account_id: string) => {
    try {
        const [rows] = await conn.query(`INSERT INTO stripe(organization_id,stripe_account_id)
            VALUES(?,?)`, [org_id, stripe_account_id]);
        return {
            data: { organization_id: org_id, stripe_account_id: stripe_account_id }
        }
    }
    catch (e) {
        console.error(e);
        return null
    }
}


export const syncData = async (connection: any, customers: any[], invoices: any[], subscriptions: any[], org_id: number) => {

    const conn = await connection.getConnection();

    const customers_payload = customers.map((customer) =>
        [
            "stripe",
            customer.id,
            customer.name,
            customer.phone,
            org_id
        ])


    const invoices_payload = invoices.map((invoice) =>
        [
            invoice.description,
            invoice.object === "subscription" ? invoice?.plan.amount : invoice.amount,
            invoice.customer,
            invoice.object === "subscription" ? "subscription" : "product",
            invoice.invoice === null ? "pending" : "succeded",
            "stripe",
            invoice.id,
            org_id
        ])
    const subscriptions_payload = subscriptions.map((sub) =>
        [
            sub.description,
            sub.object === "subscription" ? sub?.plan.amount : sub.amount,
            sub.customer,
            sub.object === "subscription" ? "subscription" : "product",
            sub.invoice === null ? "pending" : "succeded",
            "stripe",
            sub.id,
            org_id
        ])

    const merged_subs_invs = invoices_payload.concat(subscriptions_payload)
    try {
        await conn.beginTransaction();
        await conn.query(`INSERT INTO customers(origin,stripe_customer_id,name,phone_number,organization_id)
             VALUES?`, [customers_payload]);
        await conn.query(`INSERT INTO orders(name,price,customer_stripe_id,type,status,origin,stripe_product_id,organization_id)
        VALUES ?`, [merged_subs_invs]);
        await conn.commit();
        return { status: "success" }
    }
    catch (e) {
        await conn.rollback();
        console.error("[DB_ERROR]", e);
        return null;
    }
    finally {
        await conn.release();
    }

}

export const updateSingleCustomer = async (conn: any, customer: any) => {

}