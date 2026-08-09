import { getCustomers, getInvoices, getSubscriptions } from "@/services/stripe";

describe("Stripe API", () => {
    it("should log Stripe data", async () => {
        const accountId = "acct_1U1msvGVTBu5q6O6";

        const customers = await getCustomers(accountId);
        const invoices = await getInvoices(accountId);
        const subscriptions = await getSubscriptions(accountId);

        console.log("CUSTOMERS");
        console.dir(customers.data, { depth: null });

        console.log("INVOICES");
        console.dir(invoices.data, { depth: null });

        console.log("SUBSCRIPTIONS");
        console.dir(subscriptions.data, { depth: null });

        expect(true).toBe(true);
    });
});