
import { signup } from "@/services/auth";
import { UserProps } from "@/db/queries/users";
import { verifyJwtToken } from "@/lib/jwt";

export async function POST(request: Request) {
    const payload = await request.json();
    const register = await signup(payload);
    let token = null;
    let user = null;
    if (register) {
        token = register.token;
        user = register.new_user;

        return Response.json(
            {
                user,
                token
            }
        )
    }
}