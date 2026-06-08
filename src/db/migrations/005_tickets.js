export async function up(connection) {
  await connection.query(`
    CREATE TABLE tickets (
    id int auto_increment primary key,
    title varchar(60),
    content text,
    organization_id int,
    user_id int,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    foreign key(organization_id) REFERENCES organizations(id) ON DELETE CASCADE ON UPDATE CASCADE,
    foreign key(user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
    )
  `);
}

export async function down(connection) {
  await connection.query(`DROP TABLE tickets`);
}