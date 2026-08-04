
export interface RolesProps {
    user_id: number,
    organization_id: number,
    role: string,
    permissions: string;
    user_name?: string,
    member_name?: string
}
export async function getRole(connection: any, user_id: number) {
    try {
        const [rows] = await connection.query(`SELECT * FROM roles
        where user_id = ?`, [user_id]);
        return { data: rows[0] }
    }
    catch (e) {
        console.error(e);
    }
}

export async function createRole(connection: any, { user_id, organization_id, role, permissions }: RolesProps) {
    try {
        const [rows] = await connection.query(`INSERT INTO roles(user_id,organization_id,role,permissions)
            VALUES(?,?,?,?)`, [user_id, organization_id, role, permissions]);
        return rows;
    }
    catch (e) {
        console.error(e);
    }
}

export async function assignRole(connection: any, { user_id, organization_id, role, permissions }: RolesProps) {
    try {
        const [rows] = await connection.query(`UPDATE roles
        SET position = ?,
         permissions = ?
        WHERE organization_id = ? 
        AND  user_id = ?`, [role, permissions, organization_id, user_id]);
        return { status: "success" }
    }
    catch (e) {
        console.error(e);
        return null;
    }
}