export async function up(connection) {
  await connection.query(`
    CREATE DATABASE IF NOT EXISTS dashboard;`);
  await connection.query(`
    USE dashboard;
    )
  `);
}

export async function down(connection) {
  await connection.query(`DROP DATABASE dashboard`);
}