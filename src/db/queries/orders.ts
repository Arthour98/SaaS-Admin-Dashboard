
export async function getOrders(connection: any, organization_id: number) {
    try {
        const [rows] = await connection.query(`SELECT * FROM orders WHERE organization_id = ? `, [organization_id]);
        return rows;
    }
    catch (e) {
        console.error(e);
    }
}

export async function getCustomersOrders(connection: any, organization_id: number, customer_id: number) {
    try {
        const [rows] = await connection.query(`SELECT * FROM orders WHERE organization_id = ? 
        AND customer_id = ?  `, [organization_id, customer_id]);
        return rows;
    }
    catch (e) {
        console.error(e);
    }
}

