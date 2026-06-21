
export async function getCustomers(connection: any, organization_id: number) {
    try {
        const [rows] = await connection.query(`SELECT * FROM customers where organization_id = ?`, [organization_id]);
        return rows;
    }
    catch (e) {
        console.error(e);
    }
}


