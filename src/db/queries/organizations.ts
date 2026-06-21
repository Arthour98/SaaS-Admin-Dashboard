import createOrgToken from "@/lib/org_token";

export interface OrganizationInitProps {
    name: string,
    user_id: number
}  //interface for the organization thats is about to be created

export interface OrganizationProps {
    id: number,
    user_id: number,
} //interface for already existing organizations

export async function getOrganization(connection: any, user_id: number) {
    try {
        const [rows] = await connection.query(`SELECT * from users_organizations where user_id=?`, [user_id]);
        return rows;
    }
    catch (e) {
        console.error(e);
    }
}

export async function getOrganizationMembers(connection: any, organization_id: number) {
    try {
        const [rows] = await connection.query(`SELECT  users.name ,users_organizations.organization_id,organization_name 
            FROM users 
            RIGHT JOIN users_organizations
            ON users.id = users_organization.user_id
            WHERE users_organization.organization_id = ?`, [organization_id]);
        return rows;
    }
    catch (e) {
        console.error(e);
    }

}

export async function createOrganization(connection: any, creds: OrganizationInitProps) {
    try {

        await connection.beginTransaction();
        const [org] = await connection.query(`INSERT into organizations(name,user_id)
            values(?,?)`, [creds.name, creds.user_id]);
        const orgId = await org?.instertId;
        await connection.query(`INSERT INTO users_organizations(organization_id,user_id)
            values(?,?)`, [orgId, creds.user_id]);
        await connection.query(`INSERT INTO org_validation_token(organization_id,token)
            values(?,?)`, [orgId, createOrgToken()]);
        await connection.commit();
    }
    catch (e) {
        await connection.rollback();
        console.error(e);
    }
}

export async function getOrganizations(connection: any) {
    try {
        const orgs = await connection.query(`SELECT * from organizations`);
        return orgs;
    }
    catch (e) {
        console.error(e);
    }
}


export async function joinOrganization(connection: any, creds: OrganizationProps) {
    try {
        await connection.query(`INSERT into users_organizations(organization_id,user_id)
            values(?,?)`, [creds.id, creds.user_id])
    }
    catch (e) {
        console.error(e);
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

