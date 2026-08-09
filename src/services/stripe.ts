
import Stripe from 'stripe';
export const runtime = "nodejs";
import { createConnection } from '@/db/connection';
import { createStripeOrg, getStripe, syncData } from '@/db/queries/stripe';

const SECRET_KEY = process.env.STRIPE_DEV_SECRET_KEY

if (!SECRET_KEY) {
    throw new Error("Missing STRIPE_DEV_SECRET_KEY");
}

const stripeClient = new Stripe(SECRET_KEY as string);

const getCustomers = async (stripeAccountId: string) => {
    const customers = await stripeClient.customers.list({},
        {
            stripeAccount: stripeAccountId
        });
    return customers;
}

const getInvoices = async (stripeAccountId: string) => {
    const invoices = await stripeClient.invoiceItems.list({},
        {
            stripeAccount: stripeAccountId
        });
    return invoices;
}

const getSubscriptions = async (stripeAccountId: string) => {
    const subs = await stripeClient.subscriptions.list({
        expand: [
            "data.items.data.price"
        ]
    },
        {
            stripeAccount: stripeAccountId
        });

    const productIds = [
        ...new Set(
            subs.data.flatMap(sub =>
                sub.items.data.map(item => item.price.product as string)
            )
        )
    ];

    const products = await Promise.all(
        productIds.map(id =>
            stripeClient.products.retrieve(
                id,
                undefined,
                {
                    stripeAccount: stripeAccountId
                }
            )
        )
    );

    const productNames = new Map(
        products.map(product => [
            product.id,
            product.name
        ])
    );

    for (let i = 0; i < subs.data.length; i++) {
        subs.data[i].description = productNames?.get(subs.data[i].items.data[0].price.product as string) as string;
    } // here i mutate the object cause i need description but stripe doesnt provide in subs endpoint ,
    //  just in case of future reviews !
    return subs;
}

const createStripeOrganization = async (stripe_account_id: string, org_id: number) => {
    try {
        const conn = await createConnection()
        const create = await createStripeOrg(conn, org_id, stripe_account_id);
        return { data: { status: "success", stripe_account_id: create?.data.stripe_account_id, org_id: create?.data.organization_id } }
    }
    catch (e) {
        console.error("[SERVICE_ERROR]", e)
        return { error: e }
    }
}

const SyncronizeData = async (stripeAccountId: string, org_id: number) => {
    try {
        const conn = await createConnection()
        const account = await stripeClient.accounts.retrieve(
            stripeAccountId
        );
        const customers = (await getCustomers(stripeAccountId)).data;
        const invoices = (await getInvoices(stripeAccountId)).data;
        const subscriptions = (await getSubscriptions(stripeAccountId)).data;
        const sync = await syncData(conn, customers, invoices, subscriptions, org_id);
        console.log(customers)
        console.log(invoices)
        console.log(subscriptions)
        if (sync?.status === "success") {
            return { status: sync.status }
        }
        else {
            return { status: "failed" }
        }
    }
    catch (e) {
        console.error("[SERVICE_ERROR]", e);
        return { error: "sync failed due to an error" }
    }

}

const getStripeService = async (org_id: number) => {
    try {
        const conn = await createConnection();
        const stripe = await getStripe(conn, org_id);
        return { stripe: stripe?.stripe, status: stripe?.status }
    }
    catch (e) {
        console.error("[SERVICE_ERROR]", e);
        return { error: e }
    }
}


export {
    stripeClient,
    getCustomers,
    getInvoices,
    getSubscriptions,
    SyncronizeData,
    createStripeOrganization,
    getStripeService
}