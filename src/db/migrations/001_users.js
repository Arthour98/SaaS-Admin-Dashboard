export async function up(connection) {
    await connection.query(`
    CREATE TABLE users (
      id int auto_increment primary key,
      name varchar(60),
      organization_id int default null , 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function down(connection) {
    await connection.query(`DROP TABLE users`);
}