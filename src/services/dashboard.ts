import {
    getOrganization,
    getOrganizationMembers,
    getOrganizations,
    getOrgToken,
    createOrganization,
    joinOrganization,
    refreshOrgToken,
    OrganizationInitProps,
    OrganizationProps,
    leaveOrg,
    deleteOrg,
    editOrg,
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
        const org_token = await getOrgToken(conn, organization.id)
        if (organization) {
            const members = await getOrganizationMembers(conn, organization.id);
            if (organization) {
                return { organization: organization, members: members?.members, token: org_token }
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

        const org_token = org?.token;

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

export const refreshOrganizationToken = async (token_id: number, user_id: number) => {
    try {
        const conn = await createConnection();
        const organization = await getOrganization(conn, user_id);

        const isOwner = organization.owner_id === user_id;

        if (isOwner) {
            const org_token = await refreshOrgToken(conn, token_id);
            return { status: "success", token: org_token?.token, token_id: org_token?.token_id }
        }
        else {
            return { status: "failed", error: "You dont have the rights to refresh the token" }
        }

    }
    catch (e) {
        console.error(e)
        return null;
    }
}

export const editOrganization = async (org_id: number, user_id: number, name: string) => {
    try {
        const conn = await createConnection();
        const organization = await getOrganization(conn, user_id);

        const isOwner = organization.owner_id === user_id;

        if (isOwner) {
            const edit = await editOrg(conn, org_id, name);
            return { status: "success", data: edit }
        }
        else {
            return { status: "failed", error: "You are not authorized to edit the organization" }
        }
    }
    catch (e) {
        console.error(e);
        return null;
    }
}

export const deleteOrganization = async (org_id: number, user_id: number) => {
    try {
        const conn = await createConnection();
        const organization = await getOrganization(conn, user_id);

        const isOwner = organization.owner_id === user_id;

        if (isOwner) {
            const deletedOrg = await deleteOrg(conn, org_id);
            return { status: "success" }
        }
        else {
            return { status: "failed", error: "You are not authorized to delete the organization" }
        }
    }
    catch (e) {
        console.error(e);
        return null;
    }
}

export const leaveOrganization = async (org_id: number, user_id: number) => {
    try {
        const conn = await createConnection();
        const leftOrg = await leaveOrg(conn, org_id, user_id);
        return { status: "success" }
    }
    catch (e) {
        console.error(e);
        return null;
    }
}

