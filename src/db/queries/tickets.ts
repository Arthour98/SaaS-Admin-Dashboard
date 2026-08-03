
export type TicketProps =
    {
        title: string,
        content: string
    }

export async function submitTicket(connection: any, organization_id: number, user_id: number, { title, content }: TicketProps) {
    try {
        const [rows] = await connection.query(`INSERT INTO tickets(organization_id,user_id,title,content)
            values(?,?,?,?)`, [organization_id, user_id, title, content]);
        return { status: "success" }
    }
    catch (e) {
        console.error(e);
        return null;
    }
}

export async function getTickets(connection: any, organization_id: number) {
    try {
        const [rows] = await connection.query(`SELECT tickets.*,COUNT(ticket_messages.message) as message_count,users.name as user_name
            FROM tickets
            LEFT JOIN ticket_messages
            ON tickets.id = ticket_messages.ticket_id
            LEFT JOIN users
            ON tickets.user_id = users.id
            where organization_id = ?
            GROUP BY id`, [organization_id]);
        return rows;
    }
    catch (e) {
        console.error(e);
        return null;
    }
}
export async function getTicket(
    connection: any,
    organization_id: number,
    user_id: number,
    ticket_id: number
) {
    try {
        const [rows] = await connection.query(`SELECT tickets.*,COUNT(ticket_messages.message) as message_count,users.name as user_name
            FROM tickets
            LEFT JOIN ticket_messages
            ON tickets.id = ticket_messages.ticket_id
            LEFT JOIN users
            ON tickets.user_id = users.id
            where tickets.id=?
            GROUP BY id`, [ticket_id]);
        return rows[0];
    }
    catch (e) {
        console.error(e);
        return null;
    }
}

export async function createTicketMessage(connection: any, user_id: number, ticket_id: number, message: string) {
    try {
        const [rows] = await connection.query(`INSERT INTO ticket_messages(ticket_id,user_id,message)
        values(?,?,?)`, [ticket_id, user_id, message]);
        return { status: "success" }
    }
    catch (e) {
        console.error(e);
        return null;
    }
}

export async function getTicketMessages(connection: any, ticket_id: number) {
    try {
        const [rows] = await connection.query(`SELECT ticket_messages.*,users.name as user_name
            FROM ticket_messages
            LEFT JOIN users
            ON ticket_messages.user_id = users.id
            WHERE ticket_id=?`, [ticket_id]);
        return { status: "success", messages: rows }
    }
    catch (e) {
        console.error(e);
        return null;
    }
}