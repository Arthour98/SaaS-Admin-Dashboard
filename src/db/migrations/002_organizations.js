export async function up(connection) {
    await connection.query(`
    CREATE TABLE organizations (
      id int auto_increment primary key,
      name varchar(60),
      user_id int ,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      foreign key(user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
    )
  `);
}

export async function down(connection) {
    await connection.query(`DROP TABLE organizations`);
}