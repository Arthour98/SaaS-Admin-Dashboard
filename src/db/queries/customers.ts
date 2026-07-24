
export async function getCustomers(connection: any, organization_id: number) {
    try {
        const [rows] = await connection.query(`SELECT * FROM customers where organization_id = ?`, [organization_id]);
        return rows;
    }
    catch (e) {
        console.error(e);
    }
}

export const addCustomer = async (connection: any, organization_id: number, name: string, phone_number?: string) => {
    try {
        if (!phone_number) {
            const [rows] = await connection.query(`INSERT INTO customers(origin,name,organization_id)
            VALUES(?,?,?)`, ["manual", name, organization_id])
            return { status: "success" }
        }
        else {
            const [rows] = await connection.query(`INSERT INTO customers(origin,name,phone_number,organization_id)
            VALUES(?,?,?,?)`, ["manual", name, phone_number, organization_id])
            return { status: "success" }
        }
    }
    catch (e) {
        console.error("[ERROR_DB]", e);
        return null;
    }
}


