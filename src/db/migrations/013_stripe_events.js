export async function up(connection) {
    await connection.query(`
CREATE TABLE stripe_events (
    id int primary key auto_increment,
    stripe_account_id VARCHAR(80) NOT NULL,
    stripe_event_id VARCHAR(80) NOT NULL UNIQUE,
    type VARCHAR(60) NOT NULL,
    object_id VARCHAR(80),
    payload JSON NOT NULL,
    processed BOOLEAN NOT NULL DEFAULT FALSE,
    error TEXT DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL
);`);
}

export async function down(connection) {
    await connection.query(`DROP TABLE stripe_events`);
}