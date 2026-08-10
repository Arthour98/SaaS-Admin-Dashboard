import { NextResponse } from "next/server";
import {
  SyncronizeData,
  createStripeOrganization,
  stripeClient
} from "@/services/stripe";
import Stripe from 'stripe';

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

    const connectedAccountId = stripeResponse?.stripe_user_id;
    const accessToken = stripeResponse.access_token;
    const connectedClient = new Stripe(accessToken as string);
    if (connectedAccountId) {
      await createStripeOrganization(connectedAccountId, Number(org_id));
      await SyncronizeData(connectedAccountId, Number(org_id));

      const successHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Stripe Sync Completed</title>
  </head>
  <body>
    <script>
      const redirectUrl = '${process.env.APP_URL}/dashboard/integrations?stripe=connected';
      if (window.opener) {
        try {
          window.opener.location.href = redirectUrl;
        } catch (error) {
          console.warn('Unable to redirect opener:', error);
        }
        window.close();
      } else {
        window.location.href = redirectUrl;
      }
    </script>
    <p>Sync completed. You may close this window.</p>
  </body>
</html>`;

      return new Response(successHtml, {
        headers: { "Content-Type": "text/html" },
      });
    }
    else {
      throw new Error("missing stripe authetication");
    }
  }
  catch (e) {
    console.error("[ROUTE_ERROR]", e);
    const errorHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Stripe Sync Error</title>
  </head>
  <body>
    <p>An error occurred during Stripe sync.</p>
    <pre>${String(e)}</pre>
  </body>
</html>`;
    return new Response(errorHtml, {
      headers: { "Content-Type": "text/html" },
    });
  }
}
