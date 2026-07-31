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
import {
    addCustomer,
    getCustomers,
    addCustomers,
    deleteCustomer
} from "@/db/queries/customers";

import {
    getOrders,
    getCustomerOrdersWithCustomerInfo,
    addOrders,
    deleteOrder
} from "@/db/queries/orders";
import {
    RolesProps,
    assignRole,
} from "@/db/queries/roles";

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
        const org_token = await getOrgToken(conn, organization?.id)
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

export const joinOrg = async (id: number, user_id: number, token_id: number, token: string) => {
    try {
        const conn = await createConnection();
        const org = await getOrgToken(conn, id);

        const org_token = org?.token;

        if (token === org_token) {
            const creds: OrganizationProps =
            {
                id: id,
                user_id: user_id,
                token: token,
                token_id: token_id
            }
            const join = await joinOrganization(conn, creds);
            if (join.success) {
                // await refreshOrgToken(conn, token_id);
                return { status: "success" }
            }
            else {
                return { status: "failed" }
            }
        }
        else {
            console.log("IDIII NAXYH")
        }
    }
    catch (e) {
        console.error(e);
        return null;
    }
}

export const refreshOrganizationToken = async (token_id: number, user_id: number, skipPermission: boolean) => {
    try {
        const conn = await createConnection();
        const organization = await getOrganization(conn, user_id);

        const isOwner = organization.owner_id === user_id;

        if (isOwner || skipPermission) {
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
        await leaveOrg(conn, org_id, user_id);
        return { status: "success" }
    }
    catch (e) {
        console.error(e);
        return null;
    }
}

export const fetchCustomers = async () => {
    try {
        const conn = await createConnection();
        const user = await User();
        const user_id = user?.user.id as number;
        const organization = await getOrganization(conn, user_id);
        const org_id = organization?.id
        const customers = await getCustomers(conn, org_id);

        return { customers: customers }
    }
    catch (e) {
        console.error("[SERVICE_ERROR]", e);
        return null;
    }
}

export const addNewCustomer = async (org_id: number, name: string, phone_number?: string) => {
    if (!name) {
        return { status: "failed", message: "Name is required" }
    }
    try {
        const conn = await createConnection();
        const newCustomer = phone_number ?
            await addCustomer(conn, org_id, name, phone_number)
            :
            await addCustomer(conn, org_id, name)
        return { status: "success" }
    }
    catch (e) {
        console.error('[SERVICE_ERROR', e)
        return null;
    }
}
export const addNewCustomers = async (org_id: number, customers: any[]) => {
    const filteredCustomers = customers.filter(cus =>
        cus.customer_name !== ""

    )
    try {
        const conn = await createConnection();
        const newCustomer = await addCustomers(conn, org_id, filteredCustomers)
        return { status: "success" }
    }
    catch (e) {
        console.error('[SERVICE_ERROR', e)
        return null;
    }
}

export const fetchOrders = async () => {
    try {
        const conn = await createConnection();
        const user = await User();
        const user_id = user?.user.id as number;
        const organization = await getOrganization(conn, user_id);
        const org_id = organization.id
        const orders = await getOrders(conn, org_id);
        return { orders: orders }
    }
    catch (e) {
        console.error("[SERVICE_ERROR]", e)
        return null;
    }
}

export const fetchCustomerOrders = async () => {
    try {
        const conn = await createConnection();
        const user = await User();
        const user_id = user?.user.id as number;
        const organization = await getOrganization(conn, user_id);
        const org_id = organization.id;
        const customerOrders = await getCustomerOrdersWithCustomerInfo(conn, org_id);
        return { customerOrders: customerOrders }
    }
    catch (e) {
        console.error("[SERVICE_ERROR]", e)
        return null;
    }
}

export const addNewOrder = async (org_id: number, orders: any[]) => {

    try {
        const conn = await createConnection();
        const customers = (await getCustomers(conn, org_id));

        const filteredOrders = orders.filter((order) =>
            order.name !== "" && customers.find((cus: any) => cus.id == order.customer_id));

        const created = await addOrders(conn, org_id, filteredOrders);
        return { status: created?.status ?? "success" };
    } catch (e) {
        console.error("[SERVICE_ERROR]", e);
        return null;
    }
};

export const DeleteOrder = async (order_id: number) => {
    try {
        const conn = await createConnection();
        const deleted = await deleteOrder(conn, order_id);
        return { status: deleted?.status }
    }
    catch (e) {
        console.error('[ERROR_SERVICE]', e)
        return null;
    }
}

export const DeleteCustomer = async (customer_id: number) => {
    try {
        const conn = await createConnection();
        const deleted = await deleteCustomer(conn, customer_id);
        return { status: deleted?.status }
    }
    catch (e) {
        console.error("[ERROR_SERVICE]", e)
        return null;
    }
}

export const assingRoleWithPermissions = async ({ user_id, organization_id, role, permissions }: RolesProps) => {
    try {
        const conn = await createConnection();
        JSON.stringify(permissions);
        const assign = await assignRole(conn, { user_id, organization_id, role, permissions });
        return { status: assign?.status }

    }
    catch (e) {
        console.error("[SERVICE_ERROR]", e);
        return null;
    }
}


