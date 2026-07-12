import createOrgToken from "@/lib/org_token";
import { createConnection } from "../connection";

export interface OrganizationInitProps {
    name: string,
    user_id: number
}  //interface for the organization thats is about to be created

export interface OrganizationProps {
    id: number,
    user_id: number,
    token: string
} //interface for already existing organizations

export async function getOrganization(connection: any, user_id: number) {
    try {
        const [rows] = await connection.query(`SELECT 
        organizations.*,
        COUNT(users_organizations.user_id) AS count
        FROM organizations
        JOIN users_organizations
        ON organizations.id = users_organizations.organization_id
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
        const [rows] = await connection.query(`SELECT users.id, users.name ,users_organizations.organization_id
            FROM users 
            RIGHT JOIN users_organizations
            ON users.id = users_organizations.user_id
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

export async function getOrganizations(connection: any) {
    try {
        const [orgs] = await connection.query(`SELECT * from organizations`);
        return { organizations: orgs };
    }
    catch (e) {
        console.error(e);
    }
}


export async function joinOrganization(connection: any, creds: OrganizationProps) {
    try {
        await connection.query(`INSERT into users_organizations(organization_id,user_id)
            values(?,?)`, [creds.id, creds.user_id])

        return { success: true }
    }
    catch (e) {
        console.error(e);
        return { success: false }
    }
}

export async function getOrgToken(connection: any, organization_id: number) {
    try {
        const [rows] = await connection.query(`SELECT * from org_validation_token WHERE organization_id = ?`,
            [organization_id]
        );
        return rows[0];
    }
    catch (e) {
        console.error(e);
    }

}

export async function refreshOrgToken(connection: any, token_id: number) {
    try {
        await connection.query(`UPDATE org_validation_token SET token = ? WHERE id= ?`, [createOrgToken(), token_id]);
    }
    catch (e) {
        console.error(e);
    }
}

