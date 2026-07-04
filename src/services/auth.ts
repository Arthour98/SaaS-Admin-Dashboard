
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
        let token = null;
        let validation_token = null;
        if (new_user) {
            token = await createJwtToken({ user_id: new_user.id, user_name: new_user.username });
            validation_token = await createValidationToken(conn, new_user.id)
            await sendVerificationEmail(new_user.email, new_user.user_name, validation_token.token);
            return { token, new_user };
        }
    }
    catch (e) {
        console.error(e);
    }
}


const verifyRegistration = async (user_id: number, token: string) => {
    try {
        const conn = await createConnection();
        const verified = await validateUser(conn, user_id, token);
        return { verified, login };

    }
    catch (e) {
        console.error(e);
    }
}

export default async function login() {

}