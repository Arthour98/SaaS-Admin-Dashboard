import { getOrganization, getOrganizationMembers } from "@/db/queries/organizations"
import { getOrganizations } from "@/db/queries/organizations"
import { getOrgToken } from "@/db/queries/organizations"
import { createConnection } from "@/db/connection"
import { User } from "./auth"

export const getAllOrganizations = async () => {

    const conn = await createConnection();
    const organizations = await getOrganizations(conn);

    if (organizations) {
        return { organizations: organizations }
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
                return { organization, members }
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