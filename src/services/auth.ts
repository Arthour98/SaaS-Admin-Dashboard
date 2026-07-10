
import { verifyJwtToken, createJwtToken } from "@/lib/jwt";
import {
    createUser,
    createUserByOauth,
    getUser,
    getUserByEmail,
    validateUser,
    createValidationToken
} from "@/db/queries/users";
import { createConnection } from '@/db/connection';
import { UserProps } from "@/db/queries/users";
import { JwtPayload } from "@/lib/jwt";
import { validate_username, validate_email, validate_password } from "@/lib/validation";
import sendVerificationEmail from "@/lib/send-verification-email";
import { cookies } from "next/headers";
import { hashPassword } from "@/lib/hash";
import { matchPass } from "@/lib/hash";



export const signup = async (user: UserProps) => {
    if (!validate_username(user.user_name, 10)) {
        return { error: "Username must be 10 or more characters" }
    }
    if (!validate_password(user.password, 12)) {
        return { error: "Password must be 12 or more characters" }
    }
    if (!validate_email(user.email)) {
        return { error: "Email is invalid" }
    }
    try {
        const conn = await createConnection();
        const new_user = await createUser(conn, user);

        if (!new_user || "error" in new_user) {
            return new_user;
        }
        console.log("DEBUG USER ID:", new_user.id);
        console.log("DEBUG USER ID:", new_user.user_name);

        let token = await createJwtToken({ user_id: new_user.id, user_name: new_user.user_name });
        const cookie_store = await cookies();
        cookie_store.set("jwt-session",
            token,
            {
                httpOnly: true,
                expires: 1,
                maxAge: 64000,
                path: "/",
            }
        );      // create the jwt token and set it to cookies so we can get the user later


        console.log("jwt_token:", token)

        let validation_token = await createValidationToken(conn, new_user.id)
        console.log("validation_token:", validation_token.token)
        if (validation_token?.token) {
            await sendVerificationEmail(new_user.email, new_user.user_name, validation_token?.token);
        }
        return { token, new_user };

    }
    catch (e) {
        console.error(e);
        return { error: "Signup failed" + e };
    }
}


export const verifyRegistration = async (user_id: number, token: string) => {
    try {
        const conn = await createConnection();
        const verified = await validateUser(conn, user_id, token);

        if (verified.token !== null) {
            return { token: verified?.token, status: verified.status }
        }
        else {
            return { token: verified?.token, status: verified.status, error: verified.error }
        }

    }
    catch (e) {
        console.error(e);
        return { error: "Something went wrong" }
    }
}

export default async function login(email: string, password: string) { //wont add UserProps there because we need different inputs 
    const conn = await createConnection();
    const user = await getUserByEmail(conn, email);

    const isMatchedPass = matchPass(password, user.password)
    if (!isMatchedPass) {
        throw new Error("Wrong password");
    }
    let token = await createJwtToken({ user_id: user.id, user_name: user.user_name });
    const cookie_store = await cookies();
    cookie_store.set("jwt-session",
        token,
        {
            httpOnly: true,
            expires: 1,
            maxAge: 64000,
            path: "/",
        }
    );

    return { user }

}

export const User = async () => {
    const cookie_store = await cookies();
    const cookie_token = cookie_store.get("jwt-session")?.value;
    if (!cookie_token) {
        throw new Error("Unauthorized");
    }
    const token = await verifyJwtToken(cookie_token);

    if (!token) {
        throw new Error("Unauthorized");
    }

    try {
        const conn = await createConnection();
        const user_id = token?.payload.user_id as number;
        const user = await getUser(conn, user_id);
        if (user) {
            delete user.password;
            console.log(user);
            return { user: user }
        }
    }
    catch (e) {
        console.error(e);
    }
}