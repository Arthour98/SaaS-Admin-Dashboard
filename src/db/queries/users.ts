import { hashPassword } from '@/lib/hash.js';

export interface User {
    id: number,
    user_name: string,
    email: string,
    password: string,
}

export async function getUser(connection: any, id: number) {
    try {
        const [rows] = await connection.query(`SELECT * from users where id = ?`, [id])
        return rows;
    }
    catch (e) {
        console.error(e);
    }

}

async function getUserByName(connection: any, user_name: string) {
    try {
        const query = `SELECT * from users where user_name = ?`;
        const [rows] = await connection.query(query, [user_name]);

        return rows[0];
    }
    catch (e) {
        console.error(e);
    }
}



export async function createUser(connection: any, { user_name, password, email }: User) {
    const user = await getUserByName(connection, user_name);
    const existing_user = user?.length > 0;


    if (!existing_user) {
        try {
            await connection.query(`INSERT into users(user_name,email,password)
             values(?,?,?)`, [user_name, email, hashPassword(password)])
        }
        catch (e) {
            console.error(e);
        }
    }
    else {
        return;
    }

}

