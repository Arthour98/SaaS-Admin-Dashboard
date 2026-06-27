import { createConnection } from './connection.js';
import fs from "fs/promises";
import path from 'path';
import { fileURLToPath } from 'url';


const currFile = fileURLToPath(import.meta.url);
const currPath = path.dirname(currFile);

export async function getBuiltMigrations(connection) {
    const [rows] = await connection.query(`SELECT * FROM migrations`);
    return rows.map(r => r) ?? [];
}

async function executeRollBack(connection, name) {
    const migration_path = path.resolve(currPath, 'migrations', name);
    console.log(migration_path);

    const migration = await import(`file://${migration_path}`);
    console.log("DOWN TYPE:", typeof migration.down);
    if (migration) {
        await migration.down(connection);
    }
}

async function deleteMigrations(connection, ids) {
    try {
        connection.query(`DELETE from migrations where id in(${ids.join(',')})`)
    }
    catch (e) {
        console.error(e);
    }
}

async function rollback_migrations() {
    const conn = await createConnection();
    await conn.connect();

    let migrations = await getBuiltMigrations(conn);
    migrations.reverse(); //reverse the migrations so they will executed without problems due to foreign key in parent 
    console.log(migrations);
    let migrations_ids = [];
    await conn.query(`SET FOREIGN_KEY_CHECKS = 0`); // since reverse didnt helped i will disable the constraints so parent tables can be deleted 
    for (let migration of migrations) {
        try {
            await executeRollBack(conn, migration.name);
            migrations_ids.push(migration.id);
        }
        catch (e) {
            console.error(e);
            await conn.query(`DROP TABLE migrations`);
        }
    }
    await deleteMigrations(conn, migrations_ids);
    await conn.end();
}

rollback_migrations()  // run rollback