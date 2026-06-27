export async function up(connection) {
  await connection.query(`
    CREATE TABLE customers (
      id int auto_increment primary key,
      name varchar(60),
      phone_number varchar(20),
      organization_id int,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      foreign key(organization_id) REFERENCES organizations(id) ON DELETE CASCADE ON UPDATE CASCADE
    )
  `);
}

export async function down(connection) {
  await connection.query(`DROP TABLE customers`);
}