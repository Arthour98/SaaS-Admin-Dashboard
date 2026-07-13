import { hashPassword } from "@/lib/hash";
import createOrgToken from "@/lib/org_token";

export interface UserProps {
    id: number,
    user_name: string,
    email: string,
    password: string,
    source: string
}

export async function getUser(connection: any, id: number) {
    try {
        const [rows] = await connection.query(`SELECT * from users where id = ?`, [id])
        return rows.length > 0 ? rows[0] : null;
    }
    catch (e) {
        console.error(e);
    }

}

export async function getUserByName(connection: any, user_name: string) {
    try {
        const query = `SELECT * from users where name = ?`;
        const [rows] = await connection.query(query, [user_name]);

        return rows.length > 0 ? rows[0] : null;
    }
    catch (e) {
        console.error(e);
    }
}
export async function getUserByEmail(connection: any, email: string) {
    try {
        const query = `SELECT * from users where email = ?`;
        const [rows] = await connection.query(query, [email]);

        return rows.length > 0 ? rows[0] : null;
    }
    catch (e) {
        console.error(e);
    }
}



export async function createUser(
    connection: any,
    { user_name, password, email, source }: UserProps
) {
    const username = await getUserByName(connection, user_name);
    const useremail = await getUserByEmail(connection, email);

    const existing_name = username !== null;
    const existing_email = useremail !== null;

    const hashedPassword = await hashPassword(password)

    if (existing_name) {
        return { error: "username" };
    }

    if (existing_email) {
        return { error: "useremail" };
    }

    try {
        const [result] = await connection.query(
            `INSERT INTO users(name,email,password,source)
             VALUES(?,?,?,?)`,
            [user_name, email, hashedPassword, source]
        );

        return {
            id: result.insertId,
            user_name,
            email,
            source
        };

    } catch (e) {
        console.error(e);
        return { error: "db_error" };
    }
}

export async function createUserByOauth(connection: any, { user_name, password, email, source }: UserProps) {
    const username = await getUserByName(connection, user_name);
    const useremail = await getUserByEmail(connection, email);
    const existing_name = username !== null;
    const existing_email = useremail !== null;


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
    const token = createOrgToken();
    expiresAt.setDate(expiresAt.getDate() + 1);
    try {
        const [rows] = await connection.query('INSERT INTO verification_tokens(user_id,token,expires_at) VALUES(?,?,?)'
            , [user_id, token, expiresAt]  //we will use createOrgToken since its doing what we want there , no problem
        );

        return {
            user_id,
            token,
            expiresAt
        };
    }
    catch (e) {
        console.error("error:QIFSA ROPPP" + e)
        return { error: e }
    }
}

export async function validateUser(connection: any, user_id: number, token: string) {
    try {
        const [token_verification] = await connection.query(`SELECT * FROM verification_tokens WHERE token= ? AND
            expires_at > NOW()`, [token]);
        if (token_verification[0]?.token === token) {
            const [verifiedUser] = await connection.query(`
            UPDATE users
            SET verified_at = CURRENT_TIMESTAMP
            WHERE id = ? AND verified_at IS NULL`,
                [user_id]);
            return { token: token, status: "success" };
        }
        else {
            return { token: null, status: "fail", error: "Token mismatch" }
        }
    }
    catch (e) {
        console.error(e);
        return { token: null, status: "fail", error: e };
    }
}

