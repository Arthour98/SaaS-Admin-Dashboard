export async function up(connection) {
    await connection.query(`
    CREATE TABLE customers (
      id int auto_increment primary key,
      name varchar(60),
      phone_number varchar(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function down(connection) {
    await connection.query(`DROP TABLE customers`);
}