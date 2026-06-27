export async function up(connection) {
  await connection.query(`
    CREATE TABLE users (
      id int auto_increment primary key,
      name varchar(60),
      email varchar(30),
      password varchar(20), 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      verified_at TIMESTAMP DEFAULT NULL
    )
  `);
}

export async function down(connection) {
  await connection.query(`DROP TABLE users`);
}