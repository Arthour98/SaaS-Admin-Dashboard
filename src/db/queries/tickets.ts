
export type TicketProps =
    {
        title: string,
        content: string
    }

export async function submitTicket(connection: any, organization_id: number, user_id: number, { title, content }: TicketProps) {
    try {
        const [rows] = await connection.query(`INSERT INTO tickets(organization_id,user_id,title,content)
            values(?,?,?,?)`, [organization_id, user_id, title, content]);
        return rows[0];
    }
    catch (e) {
        console.error(e);
    }
}

export async function getTickets(connection: any, organization_id: number) {
    try {
        const [rows] = await connection.query(`SELECT tickets.*,ticket_messages.COUNT(messages) as message_count
            FROM tickets
            LEFT JOIN ticket_messages
            ON tickets.id = ticket_messages.ticket_id
            where organization_id = ?`, [organization_id]);
        return rows;
    }
    catch (e) {
        console.error(e);
    }
}

export async function createTicketMessage(connection: any, user_id: number, ticket_id: number, message: string) {
    try {
        const [rows] = await connection.query(`INSERT INTO ticket_messages(ticket_id,user_id,message)
        values(?,?,?)`, [ticket_id, user_id, message]);
        return rows[0];
    }
    catch (e) {
        console.error(e);
    }
}

export async function getTicketMessages(connection: any, ticket_id: number) {
    try {
        const [rows] = await connection.query(`SELECT * FROM ticket_messages WHERE ticket_id = ?`, [ticket_id]);
        return rows
    }
    catch (e) {
        console.error(e);
    }
}