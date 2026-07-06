
import { signup } from "@/services/auth";
import { UserProps } from "@/db/queries/users";

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        const register = await signup(payload);
        return Response.json(register);
    }
    catch (e) {
        return Response.json(
            { error: "something went wrong" + e },
            { status: 500 }
        );
    }

}