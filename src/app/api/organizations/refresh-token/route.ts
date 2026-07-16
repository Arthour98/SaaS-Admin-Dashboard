import { refreshOrganizationToken } from "@/services/dashboard";

export async function POST(request: Request) {
    const payload = await request.json();

    try {
        const token_id = payload?.token_id;
        const user_id = payload?.user_id;
        const new_token = await refreshOrganizationToken(token_id, user_id, false);

        if (new_token?.status == "success") {
            return Response.json({ data: new_token })
        }
        else {
            return Response.json({ data: { error: new_token?.error } })
        }
    }
    catch (e) {
        return Response.json({ data: { error: `[ERROR]:` + e } })
    }
}