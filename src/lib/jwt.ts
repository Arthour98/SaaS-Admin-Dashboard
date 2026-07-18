import { jwtVerify, SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function verifyJwtToken(token: string) {
    if (!token) {
        return false;
    }
    try {
        return await jwtVerify(token, secret);
    }
    catch (e) {
        console.error(e);
        return false;
    }

}
export interface JwtPayload {
    user_id: number,
    user_name: string
}
export async function createJwtToken(payload: JwtPayload) {

    const creds =
    {
        user_id: payload.user_id,
        user_name: payload.user_name
    }

    const jwt = new SignJWT(creds)
    const token = await jwt
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("10h")
        .sign(secret);
    return token;
}

