import createOrgToken from "@/lib/org_token";
import { createConnection } from "../connection";

export interface OrganizationInitProps {
    name: string,
    user_id: number
}  //interface for the organization thats is about to be created

export interface OrganizationProps {
    id: number,
    user_id: number,
    token: string,
    token_id?: number
} //interface for already existing organizations

export async function getOrganization(connection: any, user_id: number) {
    try {
        const [rows] = await connection.query(`SELECT 
        organizations.*,
        roles.position,roles.permissions
        FROM organizations
        JOIN users_organizations
        ON organizations.id = users_organizations.organization_id
        LEFT JOIN roles
        ON users_organizations.user_id = roles.user_id
        WHERE users_organizations.user_id = ?
        GROUP BY organizations.id;`, [user_id, user_id]);
        if (!rows || rows.length === 0) {
            return null;
        }

        const org = rows[0];
        return org;
    }
    catch (e) {
        console.error(e);
    }
}

export async function getOrganizationMembers(connection: any, organization_id: number) {
    try {
        const [rows] = await connection.query(`SELECT users.id, users.name ,users_organizations.organization_id,
            users_organizations.created_at as joined_at,
            roles.position
            FROM users 
            RIGHT JOIN users_organizations
            ON users.id = users_organizations.user_id
            LEFT JOIN roles 
            ON roles.user_id = users.id
            WHERE users_organizations.organization_id = ?`, [organization_id]);
        if (!rows || rows.length === 0) {
            return null;
        }


        return { members: rows }
    }
    catch (e) {
        console.error(e);
    }

}

export async function createOrganization(conn: any, creds: OrganizationInitProps) {
    const connection = await conn.getConnection();
    try {
        await connection.beginTransaction();
        const [org] = await connection.query(`INSERT into organizations(name,owner_id)
            values(?,?)`, [creds.name, creds.user_id]);
        const orgId = org?.insertId;
        await connection.query(`INSERT INTO users_organizations(organization_id,user_id)
            values(?,?)`, [orgId, creds.user_id]);
        await connection.query(`INSERT INTO org_validation_token(organization_id,token)
            values(?,?)`, [orgId, createOrgToken()]);
        await connection.query(`INSERT INTO roles(user_id,organization_id,position)
            VALUES(?,?,?)`, [creds.user_id, orgId, "admin"]);
        await connection.commit();

        return { success: true };
    }
    catch (e) {
        await connection.rollback();
        console.error(e);
        return { error: e };
    }
    finally {
        connection.release();
    }
}

export async function editOrg(connection: any, org_id: number, name: string) {
    try {
        const [rows] = await connection.query(`UPDATE organizations 
        SET name = ? WHERE id = ?  `, [name, org_id]);
        return { organization: rows[0] }
    }
    catch (e) {
        console.error(e);
        return null;
    }
}

export async function deleteOrg(conn: any, org_id: number) {
    const connection = await conn.getConnection();
    try {
        await connection.beginTransaction();
        await connection.query(`DELETE from organizations WHERE id = ?  `, [org_id]);
        await connection.query('DELETE from roles WHERE organization_id = ?', [org_id]);
        await connection.commit();
        return { status: "success" }
    }
    catch (e) {
        console.error(e);
        await connection.rollback();
        return null;
    }
    finally {
        await connection.release();
    }
}

export async function leaveOrg(conn: any, org_id: number, user_id: number) {
    const connection = await conn.getConnection();
    try {
        await connection.beginTransaction();
        await connection.query(`DELETE from users_organizations WHERE user_id = ? AND
        organization_id = ?`, [user_id, org_id]);
        await connection.query(`DELETE from roles where user_id = ?`, [user_id]);
        await connection.commit();
        return { status: "success" }
    }
    catch (e) {
        console.error(e);
        await connection.rollback();
        return null;
    }
    finally {
        await connection.release();
    }
}


export async function getOrganizations(connection: any) {
    try {
        const [orgs] = await connection.query(`SELECT organizations.*,org_validation_token.id as token_id
            FROM organizations
            LEFT JOIN org_validation_token
            on organizations.id = org_validation_token.organization_id`);
        return { organizations: orgs };
    }
    catch (e) {
        console.error(e);
    }
}


export async function joinOrganization(conn: any, creds: OrganizationProps) {
    const connection = await conn.getConnection();
    try {
        const new_token = createOrgToken();
        await connection.beginTransaction();
        await connection.query(`INSERT into users_organizations(organization_id,user_id)
            values(?,?)`, [creds.id, creds.user_id]);
        await connection.query(`INSERT into roles(user_id,organization_id,position)
            values(?,?,?)`, [creds.user_id, creds.id, "team_member"]);
        await connection.query(`UPDATE org_validation_token SET token = ? WHERE id= ?`, [new_token, creds?.token_id]);
        await connection.commit();
        return { success: true }
    }
    catch (e) {
        console.error(e);
        await connection.rollback();
        return { success: false }
    }
    finally {
        await connection.release();
    }
}

export async function getOrgToken(connection: any, organization_id: number) {
    try {
        const [rows] = await connection.query(`SELECT * from org_validation_token WHERE organization_id = ?`,
            [organization_id]
        );
        return { token: rows[0]?.token, token_id: rows[0]?.id }
    }
    catch (e) {
        console.error(e);
    }

}

export async function refreshOrgToken(connection: any, token_id: number) {
    try {
        const new_token = createOrgToken()
        await connection.query(`UPDATE org_validation_token SET token = ? WHERE id= ?`, [new_token, token_id]);
        return { token: new_token, token_id: token_id }
    }
    catch (e) {
        console.error(e);
        return null;
    }
}

