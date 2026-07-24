export async function up(connection) {
  await connection.query(`
    CREATE TABLE orders (
      id int auto_increment primary key,
      name varchar(80),
      price decimal(10,2) ,
      customer_id int DEFAULT NULL,
      customer_stripe_id varchar(80),
      type ENUM('subscription','product'),
      status ENUM('pending','succeded','canceled'),
      origin ENUM("manual","stripe"),
      stripe_product_id varchar(80) DEFAULT NULL,
      organization_id int,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      foreign key(customer_id) REFERENCES customers(id) ON DELETE CASCADE ON UPDATE CASCADE,
      foreign key(customer_stripe_id) REFERENCES customers(stripe_customer_id) ON DELETE CASCADE ON UPDATE CASCADE,
      foreign key(organization_id) REFERENCES organizations(id) ON DELETE CASCADE ON UPDATE CASCADE
    )
  `);
}

export async function down(connection) {
  await connection.query(`DROP TABLE orders`);
}