import { NextResponse } from "next/server";
import {
  SyncronizeData,
  createStripeOrganization,
  stripeClient
} from "@/services/stripe";
import { error } from "console";

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const org_id = searchParams.get("state");

  if (!code || !org_id) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/error`
    );
  }

  try {
    const stripeResponse = await stripeClient.oauth.token({
      grant_type: "authorization_code",
      code,
    });



    // Save this in your database
    const connectedAccountId = stripeResponse?.stripe_user_id;
    if (connectedAccountId) {
      const create_stripe = await createStripeOrganization(connectedAccountId, Number(org_id))
      // Now run your sync logic
      // await syncStripeData(connectedAccountId);
      await SyncronizeData(Number(org_id));

      return NextResponse.redirect(
        `${process.env.APP_URL}/dashboard/integrations?stripe=connected`
      );
    }
    else {
      throw new Error("missing stripe authetication");
    }
  }
  catch (e) {
    console.error("[ROUTE_ERROR]", e);
    return NextResponse.json({ error: e });
  }
}
