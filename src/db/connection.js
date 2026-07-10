// import mysql from "mysql2/promise";
// import dotenv from "dotenv";

// dotenv.config({ path: ".env.local" });  // got to set a different one in production
// const host = process.env.DB_HOST;
// const username = process.env.DB_USERNAME;
// const db_name = process.env.DB_NAME;
// const password = process.env.DB_PASSWORD;

// export async function createConnection() {
//   let conn = await  mysql.createConnection({
//     host: host,
//     user: username,
//     password: password,
//     multipleStatements: true,
//   });

//   await conn.query(` CREATE DATABASE IF NOT EXISTS dashboard`);
//   await conn.query(`USE dashboard`);
//   return conn;
// }

import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const host = process.env.DB_HOST;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const db_name = process.env.DB_NAME || "dashboard";

const globalForMysql = globalThis;

export const pool =
  globalForMysql.mysqlPool ??
  mysql.createPool({
    host,
    user: username,
    password,
    database: db_name,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true,
  });

if (process.env.NODE_ENV !== "production") {
  globalForMysql.mysqlPool = pool;
}

export async function createConnection() {
  return pool;
}

