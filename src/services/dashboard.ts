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
    getOrgId,
    kickUser
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
    deleteOrder,
    updateOrder
} from "@/db/queries/orders";
import {
    RolesProps,
    assignRole,
    getRole,
} from "@/db/queries/roles";
import {
    submitTicket,
    getTickets,
    createTicketMessage,
    getTicketMessages,
    getTicket
} from "@/db/queries/tickets";

import { createConnection } from "@/db/connection"
import { User } from "./auth"
import {
    add_log,
    getLogs,
    LogsProps
} from "@/db/queries/logs";

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

export const getOrganizationLogs = async (organization_id: number) => {
    try {
        const conn = await createConnection();
        const logsResult = await getLogs(conn, organization_id);
        if (logsResult) {
            return { logs: logsResult.logs }
        }
        return { logs: [] }
    }
    catch (e) {
        console.error(e);
        return { logs: [] };
    }
}

export const getOrganizationId = async (user_id: number) => {
    try {
        const conn = await createConnection();
        const org_id = (await getOrgId(conn, user_id)).organization_id;
        return { org_id: org_id }
    }
    catch (e) {
        console.error(e);
        return null;
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

export const joinOrg = async (
    id: number,
    user_id: number,
    token_id: number,
    token: string,
    user_name: string
) => {
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
            if (join.status == "success") {
                // await refreshOrgToken(conn, token_id);
                if (join?.status == "success") {
                    const log_obj: LogsProps =
                    {
                        user_id: user_id,
                        organization_id: id,
                        action: `${user_name} joined the organization`,
                        type: 'info'
                    }
                    await add_log(conn, log_obj)
                    return { status: "success" }
                }
            }
            else {
                return { status: "failed" }
            }
        }
        else {
            console.log("<3")
        }
    }
    catch (e) {
        console.error(e);
        return null;
    }
}

export const refreshOrganizationToken = async (
    token_id: number,
    user_id: number,
    skipPermission: boolean,
    permited: boolean,
    user_name: string,
    org_id: number
) => {
    try {
        const conn = await createConnection();
        const organization = await getOrganization(conn, user_id);
        const perms = await getRole(conn, user_id)
        const isOwner = organization.owner_id === user_id;
        const permissions = perms?.data.permissions
        const permited = permissions.includes("refresh_org_token")

        if (isOwner || skipPermission || permited) {
            const org_token = await refreshOrgToken(conn, token_id);
            if (org_token?.status == "success") {
                const log_obj: LogsProps =
                {
                    user_id: user_id,
                    organization_id: org_id,
                    action: `${user_name} refreshed the  organization token`,
                    type: 'info'
                }
                await add_log(conn, log_obj)
                return { status: "success", token: org_token?.token, token_id: org_token?.token_id }
            }
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
        const perms = await getRole(conn, user_id);

        const isOwner = organization.owner_id === user_id;
        const permissions = perms?.data.permissions
        const permited = permissions.includes('edit_organization');

        if (isOwner || permited) {
            const edit = await editOrg(conn, org_id, name);
            if (edit?.status == "success") {
                const log_obj: LogsProps =
                {
                    user_id: user_id,
                    organization_id: org_id,
                    action: `Admin renamed the organization`,
                    type: 'update'
                }
                await add_log(conn, log_obj)
                return { status: "success", data: edit }
            }
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

export const leaveOrganization = async (
    org_id: number,
    user_id: number,
    user_name: string
) => {
    try {
        const conn = await createConnection();
        const leave = await leaveOrg(conn, org_id, user_id);
        if (leave?.status == "success") {
            const log_obj: LogsProps =
            {
                user_id: user_id,
                organization_id: org_id,
                action: `${user_name} left the organization`,
                type: 'info'
            }
            await add_log(conn, log_obj)
            return { status: "success" }
        }
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

export const addNewCustomer = async (
    org_id: number,
    name: string,
    user_id: number,
    user_name: string,
    phone_number?: string,
) => {
    if (!name) {
        return { status: "failed", message: "Name is required" }
    }
    try {
        const conn = await createConnection();
        const perms = await getRole(conn, user_id);
        const permissions = perms?.data.permissions
        const permited = permissions.includes("add_customer");
        if (permited) {
            const newCustomer = phone_number ?
                await addCustomer(conn, org_id, name, phone_number)
                :
                await addCustomer(conn, org_id, name)
            if (newCustomer?.status == "success") {
                const log_obj: LogsProps =
                {
                    user_id: user_id,
                    organization_id: org_id,
                    action: `${user_name} added new customer [${name}]`,
                    type: 'create'
                }
                await add_log(conn, log_obj)
                return { status: "success" }
            }
        }
        else {
            return { status: "failed", message: "Unauthorized" }
        }

    }
    catch (e) {
        console.error('[SERVICE_ERROR', e)
        return null;
    }
}
export const addNewCustomers = async (
    org_id: number,
    customers: any[],
    user_id: number,
    user_name: string
) => {
    const filteredCustomers = customers.filter(cus =>
        cus.customer_name !== ""
    )
    try {
        const conn = await createConnection();
        const perms = await getRole(conn, user_id);
        const permissions = perms?.data.permissions;
        const permited = permissions.includes("add_customer");
        if (permited) {
            const newCustomer = await addCustomers(conn, org_id, filteredCustomers)
            if (newCustomer?.status == "success") {
                const log_obj: LogsProps =
                {
                    user_id: user_id,
                    organization_id: org_id,
                    action: `${user_name} added new customers [${filteredCustomers.map(cus => cus.customer_name).join(",")}]`,
                    type: 'create'
                }
                await add_log(conn, log_obj)
                return { status: "success" }
            }
        }
        else {
            return { status: 'failed', message: "Unauthorized" }
        }
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

export const addNewOrder = async (
    org_id: number,
    orders: any[],
    user_id: number,
    user_name: string
) => {

    try {
        const conn = await createConnection();
        const perms = await getRole(conn, user_id);
        const permissions = perms?.data.permissions;
        const permited = permissions.includes("add_order");
        if (permited) {
            const customers = (await getCustomers(conn, org_id));
            const filteredOrders = orders.filter((order) =>
                order.name !== "" && customers.find((cus: any) => cus.id == order.customer_id));
            const created = await addOrders(conn, org_id, filteredOrders);
            if (created?.status == "success") {
                const log_obj: LogsProps =
                {
                    user_id: user_id,
                    organization_id: org_id,
                    action: `${user_name} added new orders [${filteredOrders.map(o => o.name).join(",")}]`,
                    type: 'create'
                }
                await add_log(conn, log_obj)
                return { status: created?.status ?? "success" };
            }
        }
        else {
            return { status: "failed", message: "Unauthorized" }
        }
    } catch (e) {
        console.error("[SERVICE_ERROR]", e);
        return null;
    }
};

export const DeleteOrder = async (
    order_id: number,
    user_id: number,
    user_name: string,
    order_name: string,
    organization_id: number
) => {
    try {
        const conn = await createConnection();
        const perms = await getRole(conn, user_id);
        const permissions = perms?.data.permissions
        const permited = permissions.includes("delete_order");
        if (permited) {
            const deleted = await deleteOrder(conn, order_id);
            if (deleted?.status == "success") {
                const log_obj: LogsProps =
                {
                    user_id: user_id,
                    organization_id: organization_id,
                    action: `${user_name} deleted order [${order_name}]`,
                    type: 'delete'
                }
                await add_log(conn, log_obj)
                return { status: deleted?.status }
            }
        }
        else {
            return { status: "failed", message: "Unauthorized" }
        }
    }
    catch (e) {
        console.error('[ERROR_SERVICE]', e)
        return null;
    }
}

export const DeleteCustomer = async (
    user_id: number,
    user_name: string,
    organization_id: number,
    customer_id: number,
    customer_name: number) => {
    try {
        const conn = await createConnection();
        const perms = await getRole(conn, user_id);
        const permissions = perms?.data.permissions;
        const permited = permissions.includes("delete_customer");
        if (permited) {
            const deleted = await deleteCustomer(conn, customer_id);
            if (deleted?.status == "success") {
                const log_obj: LogsProps =
                {
                    user_id: user_id,
                    organization_id: organization_id,
                    action: `${user_name} deleted customer [${customer_name}]`,
                    type: 'delete'
                }
                await add_log(conn, log_obj)
                return { status: deleted?.status }
            }
        }
        else {
            return { status: "failed", message: "Unauthorized" }
        }
    }
    catch (e) {
        console.error("[ERROR_SERVICE]", e)
        return null;
    }
}

export const assignRoleWithPermissions = async ({
    handler_id,
    user_id,
    organization_id,
    role,
    permissions,
    user_name,
    member_name }: RolesProps) => {
    try {
        const conn = await createConnection();
        const perms = await getRole(conn, handler_id as number);
        const _permissions = perms?.data.permissions
        const permited = _permissions.includes("assign_permissions");
        if (permited) {
            JSON.stringify(permissions);
            const assign = await assignRole(conn, { handler_id, user_id, organization_id, role, permissions });
            if (assign?.status == "success") {
                const log_obj: LogsProps =
                {
                    user_id: handler_id as number,
                    organization_id: organization_id,
                    action: `${user_name} changed permissions for [${member_name}]`,
                    type: 'create'
                }
                await add_log(conn, log_obj)
                return { status: assign?.status }
            }
        }
        else {
            return { status: "failed", message: "Unauthorized" }
        }

    }
    catch (e) {
        console.error("[SERVICE_ERROR]", e);
        return null;
    }
}

export const getOrgTickets = async (user_id: number, org_id: number) => {
    if (!user_id || !org_id) {
        return { status: "failed" }
    }
    try {
        const conn = await createConnection();
        const tickets = await getTickets(conn, org_id);
        return { tickets: tickets }
    }
    catch (e) {
        console.error("[SERVICE_ERROR]", e);
        return null;
    }
}

export const getOrgTicket = async (user_id: number, org_id: number, ticket_id: number) => {
    try {
        const conn = await createConnection();
        const ticket = await getTicket(conn, org_id, user_id, ticket_id);
        return { ticket: ticket }
    }
    catch (e) {
        console.error("[SERVICE_ERROR]", e);
        return null;
    }
}

export const createOrgTicket = async (org_id: number, user_id: number, user_name: string, title: string, content: string,) => {
    if (!org_id || !user_id || title === "" || content === "") {
        return { status: "failed" }
    }
    try {
        const conn = await createConnection();
        const perms = await getRole(conn, user_id);
        const permissions = perms?.data.permissions;
        const permited = permissions.includes("create_ticket");

        if (permited) {
            const create = await submitTicket(conn, org_id, user_id, { title, content });
            if (create?.status == "success") {
                const log_obj: LogsProps =
                {
                    user_id: user_id,
                    organization_id: org_id,
                    action: `${user_name} created a ticket [${title}]`,
                    type: 'create'
                }
                await add_log(conn, log_obj)
                return { status: "success" }
            }
        }
        else {
            return { status: "failed", message: "Unauthorized" }
        }
    }
    catch (e) {
        console.error("[SERVICE_ERROR]", e);
        return null;
    }
}

export const submitOrgTicketMessage = async (user_id: number, ticket_id: number, message: string) => {
    if (!user_id || !ticket_id || message == "") {
        return { status: "failed" }
    }
    try {
        const conn = await createConnection();
        const create_message = await createTicketMessage(conn, user_id, ticket_id, message);
        if (create_message?.status == "success") {
            const new_messages = await getTicketMessages(conn, ticket_id);
            return { status: "success", messages: new_messages?.messages }
        }
        else {
            return { status: "failed" }
        }
    }
    catch (e) {
        console.error("[SERVICE_ERROR]", e);
        return null;
    }
}

export const getOrgTicketMessages = async (user_id: number, ticket_id: number) => {
    if (!user_id || !ticket_id) {
        return { status: 'failed' }
    }
    try {
        const conn = await createConnection();
        const messages = await getTicketMessages(conn, ticket_id);
        return { status: "success", messages: messages?.messages }
    }
    catch (e) {
        console.error("[SERVICE_ERROR]", e);
        return null;
    }
}

export const getRoleAndPermissions = async (user_id: number) => {
    try {
        const conn = await createConnection();
        const perms = await getRole(conn, user_id);
        return { status: "success", role: perms?.data.position, permissions: perms?.data.permissions }
    }
    catch (e) {
        console.error("[SERVICE_ERROR]", e);
        return null;
    }
}

export const kickOrganizationMember = async (
    delete_user_id: number,
    delete_user_name: string,
    user_id: number,
    user_name: string,
    org_id: number
) => {
    try {
        const conn = await createConnection();
        const perms = await getRole(conn, user_id);
        const permissions = perms?.data.permissions;
        const permited = permissions.includes('delete_users');
        if (permited) {
            const deleted = await kickUser(
                conn,
                delete_user_id,
                org_id
            );
            if (deleted?.status === "success") {
                const log_obj: LogsProps =
                {
                    user_id: user_id,
                    organization_id: org_id,
                    action: `${user_name} deleted member [${delete_user_name}]`,
                    type: 'delete'
                }
                await add_log(conn, log_obj)
                return { status: "success" }
            }
        }
        else {
            return { status: "failed", message: "Unauthorized" }
        }
    }
    catch (e) {
        console.error(e);
        return null;
    }
}

export const updateOrderStatus = async (
    order_id: number,
    user_id: number,
    user_name: string,
    org_id: number,
    status: string,
    product_name: string
) => {
    try {
        const conn = await createConnection();
        const perms = await getRole(conn, user_id);
        const permissions = perms?.data.permissions;
        const permited = permissions.includes("add_order");
        if (permited) {
            const update = await updateOrder(conn, order_id, status);
            if (update?.status == "success") {
                const log_obj: LogsProps =
                {
                    user_id: user_id,
                    organization_id: org_id,
                    action: `${user_name} changed the status of product [${product_name}]`,
                    type: 'update'
                }
                await add_log(conn, log_obj)
                return { status: "success" }
            }
        }
        else {
            return { status: "failed", message: "Unauthorized" }
        }
    }
    catch (e) {
        console.error("[SERVICE_ERROR]", e)
        return null;
    }
}





