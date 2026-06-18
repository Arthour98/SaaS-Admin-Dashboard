export async function up(connection) {
  await connection.query(`
    CREATE TABLE ticket_messages(
      id int auto_increment primary key,
      message text,
      user_id int,
      ticket_id int,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      foreign key(user_id) REFERENCES users(id) ON  DELETE CASCADE ON UPDATE CASCADE,
      foreign key(ticket_id) REFERENCES tickets(id) ON DELETE CASCADE  ON UPDATE CASCADE
    )
  `);
}

export async function down(connection) {
  await connection.query(`DROP TABLE ticket_messages`);
}