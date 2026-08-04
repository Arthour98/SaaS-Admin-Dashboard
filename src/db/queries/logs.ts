
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

