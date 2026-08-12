
import { verifyJwtToken, createJwtToken } from "@/lib/jwt";
import {
    createUser,
    createUserOauth,
    getUser,
    getUserByEmail,
    getUserByName,
    editUser,
    deleteUser,
    validateUser,
    createValidationToken
} from "@/db/queries/users";
import { createConnection } from '@/db/connection';
import { UserProps } from "@/db/queries/users";
import { validate_username, validate_email, validate_password } from "@/lib/validation";
import sendVerificationEmail from "@/lib/send-verification-email";
import sendPasswordChangeEmail from "@/lib/send-password-change-email";
import { cookies } from "next/headers";
import { hashPassword, matchPass } from "@/lib/hash";



export const signup = async (user: UserProps) => {
    if (!validate_username(user.user_name, 6)) {
        return { error: "Username must be 6 or more characters" }
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

        let token = await createJwtToken({ user_id: new_user.id, user_name: new_user.user_name });
        const cookie_store = await cookies();
        cookie_store.set("jwt-session",
            token,
            {
                httpOnly: true,
                maxAge: 86400,
                path: "/",
                sameSite: "lax",
            }
        );      // create the jwt token and set it to cookies so we can get the user later

        let validation_token = await createValidationToken(conn, new_user.id)
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
            return { token: verified?.token, status: verified.status };
        }
        else {
            return { token: verified?.token, status: verified.status, error: verified.error };
        }

    }
    catch (e) {
        console.error(e);
        return { error: "Something went wrong" };
    }
}

export async function updateUser(payload: {
    user_name?: string;
    current_password?: string;
    new_password?: string;
    confirm_new_password?: string;
}) {
    const cookie_store = await cookies();
    const cookie_token = cookie_store.get("jwt-session")?.value;
    if (!cookie_token) {
        return { error: "Unauthorized" };
    }

    const verified = await verifyJwtToken(cookie_token);
    if (!verified) {
        return { error: "Unauthorized" };
    }

    const user_id = verified.payload.user_id as number;
    const conn = await createConnection();
    const user = await getUser(conn, user_id);

    if (!user) {
        return { error: "User not found" };
    }

    const updates: { name?: string; password?: string } = {};

    if (payload.user_name && payload.user_name !== user.name) {
        if (!validate_username(payload.user_name, 6)) {
            return { error: "Username must be 6 or more characters" };
        }
        const existingUser = await getUserByName(conn, payload.user_name);
        if (existingUser && existingUser.id !== user_id) {
            return { error: "Username already taken" };
        }
        updates.name = payload.user_name;
    }

    if (payload.new_password || payload.current_password) {
        if (!payload.current_password) {
            return { error: "Current password is required" };
        }
        if (!payload.new_password) {
            return { error: "New password is required" };
        }
        if (payload.new_password !== payload.confirm_new_password) {
            return { error: "New passwords do not match" };
        }
        if (!validate_password(payload.new_password, 12)) {
            return { error: "Password must be 12 or more characters" };
        }

        const passwordMatches = await matchPass(payload.current_password, user.password);
        if (!passwordMatches) {
            return { error: "Current password is incorrect" };
        }

        updates.password = await hashPassword(payload.new_password);
    }

    if (!updates.name && !updates.password) {
        return { error: "No changes to save" };
    }

    const updated = await editUser(conn, user_id, updates);
    if (!updated) {
        return { error: "Unable to update account" };
    }

    if (updates.password) {
        try {
            await sendPasswordChangeEmail(user.email, user.name);
        }
        catch (e) {
            console.error("Password change email failed", e);
        }
    }

    return { success: true, message: "Account updated successfully" };
}

export async function deleteUserAccount(current_password?: string) {
    const cookie_store = await cookies();
    const cookie_token = cookie_store.get("jwt-session")?.value;
    if (!cookie_token) {
        return { error: "Unauthorized" };
    }

    const verified = await verifyJwtToken(cookie_token);
    if (!verified) {
        return { error: "Unauthorized" };
    }

    const user_id = verified.payload.user_id as number;
    const conn = await createConnection();
    const user = await getUser(conn, user_id);

    if (!user) {
        return { error: "User not found" };
    }

    if (!current_password) {
        return { error: "Current password is required" };
    }

    const passwordMatches = await matchPass(current_password, user.password);
    if (!passwordMatches) {
        return { error: "Current password is incorrect" };
    }

    const deleted = await deleteUser(conn, user_id);
    if (!deleted) {
        return { error: "Unable to delete account" };
    }

    return { success: true };
}

export default async function login(email: string, password: string) { //wont add UserProps there because we need different inputs 
    const conn = await createConnection();
    const user = await getUserByEmail(conn, email);

    const isMatchedPass = await matchPass(password, user.password)
    if (!isMatchedPass) {
        throw new Error("Wrong password");
    }
    let token = await createJwtToken({ user_id: user.id, user_name: user.user_name });
    const cookie_store = await cookies();
    cookie_store.set("jwt-session",
        token,
        {
            httpOnly: true,
            maxAge: 86400,
            path: "/",
            sameSite: "lax",
        }
    );

    return { user }

}

export async function logout() {
    const cookie_store = await cookies();
    cookie_store.delete("jwt-session");
}

export const User = async () => {
    const cookie_store = await cookies();
    const cookie_token = cookie_store.get("jwt-session")?.value;
    if (!cookie_token) {
        return null
    }

    try {
        const token = await verifyJwtToken(cookie_token);
        if (!token) {
            return null
        }
        const conn = await createConnection();
        const user_id = token?.payload.user_id as number;
        const user = await getUser(conn, user_id);
        if (user) {
            delete user.password; // dont expose password to the client :)
            return { user: user }
        }
    }
    catch (e) {
        console.error(e);
        return null;
    }
}

export async function createUserByOauth({ user_name, password, email, source }: UserProps) {
    try {
        const conn = await createConnection();
        const useremail = await getUserByEmail(conn, email);
        const existing_email = useremail !== null;
        if (!existing_email) {
            const new_user = await createUserOauth(conn, { user_name, password, email, source } as UserProps)
            if (new_user) {
                let validation_token = await createValidationToken(conn, new_user.id)
                if (validation_token?.token) {
                    await sendVerificationEmail(new_user.email, new_user.user_name, validation_token?.token);
                }
                let token = await createJwtToken({ user_id: new_user.id, user_name: new_user.user_name });
                const cookie_store = await cookies();
                cookie_store.set("jwt-session",
                    token,
                    {
                        httpOnly: true,
                        expires: 1,
                        maxAge: 64000,
                        path: "/",
                    })
            }
        }
        else {
            let token = await createJwtToken({ user_id: useremail.id, user_name: useremail.name });
            const cookie_store = await cookies();
            cookie_store.set("jwt-session",
                token,
                {
                    httpOnly: true,
                    expires: 1,
                    maxAge: 64000,
                    path: "/",
                })
        }



    }
    catch (e) {
        console.error(e);
        return null;
    }
}