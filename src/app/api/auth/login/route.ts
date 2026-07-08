import login from "@/services/auth";


export async function POST(request: Request) {
    try {
        const payload = await request.json();
        const register = await login(payload.email, payload.password);
        return Response.json(register);
    }
    catch (e) {
        return Response.json(
            { error: "something went wrong" + e },
            { status: 500 }
        );
    }

}