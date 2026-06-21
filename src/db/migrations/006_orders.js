export async function up(connection) {
  await connection.query(`
    CREATE TABLE orders (
      id int auto_increment primary key,
      name varchar(80),
      price decimal(10,2) ,
      customer_id int,
      organization_id int
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      foreign key(customer_id) REFERENCES customers(id) ON DELETE CASCADE ON UPDATE CASCADE,
      foreign key(organization_id) REFERENCES organization(id) ON DELETE CASCADE ON UPDATE CASCADE
    )
  `);
}

export async function down(connection) {
  await connection.query(`DROP TABLE orders`);
}