
export async function createStripeEvent(connection: any, payload: any) {
    const [rows] = await connection.query(`INSERT INTO stripe_events
    (
        stripe_account_id,
        stripe_event_id,
        type,
        object_id,
        payload,
        processed,
        error
    )VALUES(?,?,?,?,?,?,?)`, [
        payload.stripe_account_id,
        payload.stripe_event_id,
        payload.type,
        payload.object_id,
        payload.payload,
        payload.processed,
        payload.error,
    ])
}