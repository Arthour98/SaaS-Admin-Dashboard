import { hashPassword } from '@/lib/hash.js';
import createOrgToken from "@/lib/org_token";

export interface UserProps {
    id: number,
    user_name: string,
    email: string,
    password: string,
    source: string
}

export  async function getUser(connection: any, id: number) {
    try {
        const [rows] = await connection.query(`SELECT * from users where id = ?`, [id])
        return rows;
    }
    catch (e) {
        console.error(e);
    }

}

export async function getUserByName(connection: any, user_name: string) {
    try {
        const query = `SELECT * from users where name = ?`;
        const [rows] = await connection.query(query, [user_name]);

        return rows[0];
    }
    catch (e) {
        console.error(e);
    }
}
export  async function getUserByEmail(connection: any, email: string) {
    try {
        const query = `SELECT * from users where email = ?`;
        const [rows] = await connection.query(query, [email]);

        return rows[0];
    }
    catch (e) {
        console.error(e);
    }
}



export async function createUser(connection: any, { user_name, password, email, source }: UserProps) {
    const username = await getUserByName(connection, user_name);
    const useremail = await getUserByEmail(connection, email);
    const existing_name = username?.length > 0;
    const existing_email = useremail?.length > 0;


    if (!existing_name && !existing_email) {
        try {
            const [rows] = await connection.query(`INSERT into users(name,email,password)
             values(?,?,?,?)`, [user_name, email, hashPassword(password), source]);
            return rows;
        }
        catch (e) {
            console.error(e);
        }
    }
    else if (existing_name) {
        return { error: "username" }
    }
    else if (existing_email) {
        return { error: "useremail" }
    }
}

export async function createUserByOauth(connection: any, { user_name, password, email, source }: UserProps) {
    const username = await getUserByName(connection, user_name);
    const useremail = await getUserByEmail(connection, email);
    const existing_name = username?.length > 0;
    const existing_email = useremail?.length > 0;


    if (!existing_name && !existing_email) {
        try {
            await connection.query(`INSERT into users(name,email,source)
             values(?,?,?)`, [user_name, email, source]);
        }
        catch (e) {
            console.error(e);
        }
    }
    else if (existing_name) {
        return { error: "username" }
    }
    else if (existing_email) {
        return { error: "useremail" }
    }
}

export async function createValidationToken(connection: any, user_id: number) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);
    const [rows] = await connection.query('INSERT INTO verification_tokens(user_id,token,expires_at) VALUES(?,?)'
        , [user_id, createOrgToken(), expiresAt] //we will use createOrgToken since its doing what we want there , no problem
    );
    return rows;
}

export async function validateUser(connection: any, user_id: number, token: string) {
    try {
        const [token_verification] = await connection.query(`SELECT * FROM verification_tokens WHERE user_id = ?`, [user_id]);
        if (token_verification[0]?.token === token) {
            const [verifiedUser] = await connection.query(`UPDATE users WHERE user_id = ? AND verified_at = NULL
                set verified_at CURRENT_TIMESTAMP`);
            return verifiedUser;
        }
    }
    catch (e) {
        console.error(e);
    }
}

