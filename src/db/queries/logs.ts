
export interface LogsProps {
    user_id: number,
    organization_id: number,
    action: string,
    type: LogType
}
type LogType = 'info' | 'create' | 'delete' | 'update' | 'warning'

export async function add_log(
    connection: any,
    {
        user_id,
        organization_id,
        action,
        type,
    }: LogsProps) {
    try {
        const [rows] = await connection.query(`INSERT INTO logs(user_id,organization_id,type,action)
        VALUES(?,?,?,?)`, [user_id, organization_id, type, action]);
        return rows;
    }
    catch (e) {
        console.error(e);
    }
}

export async function getLogs(connection: any, organization_id: number) {
    try {
        const [rows] = await connection.query(`SELECT logs.id, logs.user_id, users.name AS user_name, logs.action, logs.type, logs.created_at
            FROM logs
            LEFT JOIN users
            ON logs.user_id = users.id
            WHERE logs.organization_id = ?
            ORDER BY logs.created_at DESC`, [organization_id]);

        return { logs: rows }
    }
    catch (e) {
        console.error(e);
    }
}

