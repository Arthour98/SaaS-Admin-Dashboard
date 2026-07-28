
import Stripe from 'stripe';
export const runtime = "nodejs";
import { createConnection } from '@/db/connection';
import { createStripeOrg, getStripe, syncData } from '@/db/queries/stripe';

const SECRET_KEY = process.env.STRIPE_DEV_SECRET_KEY

if (!SECRET_KEY) {
    throw new Error("Missing STRIPE_DEV_SECRET_KEY");
}

const stripeClient = new Stripe(SECRET_KEY as string);


const getCustomers = async () => {
    const customers = await stripeClient.customers.list();
    return customers;
}

const getInvoices = async () => {
    const invoices = await stripeClient.invoiceItems.list();
    return invoices;
}

const getSubscriptions = async () => {
    const subs = await stripeClient.subscriptions.list({
        expand: [
            "data.items.data.price"
        ]
    });

    const productIds = [
        ...new Set(
            subs.data.flatMap(sub =>
                sub.items.data.map(item => item.price.product as string)
            )
        )
    ];

    const products = await Promise.all(
        productIds.map(id => stripeClient.products.retrieve(id))
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

const SyncronizeData = async (org_id: number) => {
    try {
        const conn = await createConnection()
        const customers = (await getCustomers()).data;
        const invoices = (await getInvoices()).data;
        const subscriptions = (await getSubscriptions()).data;
        const sync = await syncData(conn, customers, invoices, subscriptions, org_id);

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