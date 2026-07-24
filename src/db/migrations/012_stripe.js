export async function up(connection) {
  await connection.query(`
    CREATE TABLE stripe(
      organization_id int primary key,
      stripe_account_id VARCHAR(80),
      foreign key(organization_id) references organizations(id)
       ON UPDATE CASCADE
       ON DELETE CASCADE
    )
  `);
}

export async function down(connection) {
  await connection.query(`DROP TABLE stripe`);
}