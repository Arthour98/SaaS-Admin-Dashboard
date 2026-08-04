import { refreshOrganizationToken } from "@/services/dashboard";

export async function POST(request: Request) {
    const payload = await request.json();

    try {
        const token_id = payload?.token_id;
        const user_id = payload?.user_id;
        const permited = payload?.permited;
        const org_id = payload?.organization_id;
        const user_name = payload.user_name;
        const new_token = await refreshOrganizationToken(token_id,
            user_id,
            false,
            permited,
            user_name,
            org_id
        );

        if (new_token?.status == "success") {
            return Response.json({ data: { token: new_token, status: "success" } })
        }
        else {
            return Response.json({ data: { stauts: "failed", error: new_token?.error } })
        }
    }
    catch (e) {
        return Response.json({ data: { status: "failed", error: `[ERROR]:` + e } })
    }
}