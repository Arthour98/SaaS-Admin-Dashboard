
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

export async function getCustomerOrdersWithCustomerInfo(connection: any, organization_id: number) {
    try {
        const [rows] = await connection.query(`
            SELECT 
                o.id,
                o.name AS product_name,
                o.price,
                o.status,
                o.origin,
                o.type,
                o.created_at,
                o.organization_id,
                c.name AS customer_name
            FROM orders o
            LEFT JOIN customers c ON c.id = o.customer_id
            WHERE o.organization_id = ?
            ORDER BY o.created_at DESC
        `, [organization_id]);
        return rows;
    }
    catch (e) {
        console.error(e);
    }
}

export const addOrder = async (connection: any, organization_id: number, order: any) => {
    try {
        const [rows] = await connection.query(`
            INSERT INTO orders(name, price, status, origin, type, organization_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [order.name, order.price, order.status || "pending", order.origin || "manual", order.type || "product", organization_id]);
        return { status: "success" };
    } catch (e) {
        console.error("[ERROR_DB]", e);
        return null;
    }
};

export const addOrders = async (connection: any, organization_id: number, orders: any[]) => {
    try {
        const ordersArr = orders.map((order) => [
            order.customer_id,
            order.name,
            order.price,
            order.status || "pending",
            order.origin || "manual",
            order.type || "product",
            organization_id,
        ]);
        await connection.query(`
            INSERT INTO orders(customer_id,name, price, status, origin, type, organization_id)
            VALUES ?
        `, [ordersArr]);
        return { status: "success" };
    } catch (e) {
        console.error("[ERROR_DB]", e);
        return null;
    }
};

export const deleteOrder = async (connection: any, order_id: number) => {
    try {
        await connection.query(`DELETE FROM orders where id=?`, [order_id]);
        return { status: "success" }
    }
    catch (e) {
        console.error("[ERROR_DB]", e);
        return null;
    }
}

