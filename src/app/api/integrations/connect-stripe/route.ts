import { NextResponse } from "next/server";

export async function GET(req: Request) {

    const clientId = process.env.STRIPE_CLIENT_ID;

    const { searchParams } = new URL(req.url);
    const org_id = searchParams.get("org");
    const redirectUri =
        `${process.env.APP_URL}/api/integrations/sync/stripe`;

    const stripeUrl =
        `https://connect.stripe.com/oauth/authorize` +
        `?response_type=code` +
        `&client_id=${clientId}` +
        `&scope=read_write` +
        `&state=${org_id}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}`;

    return NextResponse.redirect(stripeUrl);
}