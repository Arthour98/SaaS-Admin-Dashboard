
interface LogsProps {
    user_id: number,
    organization_id: number,
    action: string,
}
export async function user_joined(
    connection: any,
    {
        user_id,
        organization_id,
        action
    }: LogsProps) {
    try {
        const [rows] = await connection.query(`INSERT INTO logs(user_id,organization_id,type,action)
        VALUES(?,?,?,?)`, [user_id, organization_id, "info", action]);
        return rows;
    }
    catch (e) {
        console.error(e);
    }
}

