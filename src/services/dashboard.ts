import {
    getOrganization,
    getOrganizationMembers,
    getOrganizations,
    getOrgToken,
    createOrganization,
    joinOrganization,
    refreshOrgToken,
    OrganizationInitProps,
    OrganizationProps
} from "@/db/queries/organizations"


import { createConnection } from "@/db/connection"
import { User } from "./auth"

export const getAllOrganizations = async () => {

    const conn = await createConnection();
    const organizations = await getOrganizations(conn);

    if (organizations) {
        return { organizations: organizations.organizations }
    }
    else {
        return { organizations: [] }
    }

}

export const getUserOrganization = async () => {

    try {
        const conn = await createConnection();
        const user = await User();
        const user_id = user?.user.id as number;

        const organization = await getOrganization(conn, user_id);
        if (organization) {
            const members = await getOrganizationMembers(conn, organization.id);
            if (organization) {
                return {organization:organization, members:members?.members }
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }
    catch (e) {
        console.error(e);
    }

}

export const createOrg = async (name: string, user_id: number) => {
    try {
        const conn = await createConnection();
        const organizationsObj = await getOrganizations(conn)
        const organizations = organizationsObj?.organizations;
        const existing = Array.isArray(organizations) ? organizations.find((org: any) => org?.name == name) : false;
        if (existing) {
            return { error: "Organization with the same name is already existing" }
        }
        else {
            const creds: OrganizationInitProps =
            {
                user_id: user_id,
                name: name
            }
            const new_org = await createOrganization(conn, creds);
            if (new_org.success) {
                return { status: "success" }
            }
            else {
                return { status: "failed" }
            }

        }
    }
    catch (e) {
        console.error(e);
        return null;
    }
}

export const joinOrg = async (id: number, user_id: number, token: string) => {
    try {
        const conn = await createConnection();
        const org = await getOrgToken(conn, id);

        const org_token = org.token;

        if (token = org_token) {
            const creds: OrganizationProps =
            {
                id: id,
                user_id: user_id,
                token: token
            }
            const join = await joinOrganization(conn, creds);
            if (join.success) {
                return { status: "success" }
            }
            else {
                return { status: "failed" }
            }
        }
    }
    catch (e) {
        console.error(e);
        return null;
    }
}