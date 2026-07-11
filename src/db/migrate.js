import { createConnection } from './connection.js';
import fs from "fs/promises";
import path from 'path';
import { fileURLToPath } from 'url';

const currFile = fileURLToPath(import.meta.url);
const currPath = path.dirname(currFile);

async function getMigrationsFiles() {
    console.log(currPath);
    let files = await fs.readdir(currPath + '/migrations');
    files.sort();
    return files;
}

export async function getBuiltMigrations(connection) {
    const [rows] = await connection.query(`SELECT * FROM migrations`);
    return rows.map(r => r) ?? [];
}

async function declareMigration(connection, name) {
    return await connection?.query(`Insert into migrations(name)values('${name}')`);
}

async function executeMigration(connection, name) {
    const migration_path = path.resolve(currPath, 'migrations', name);
    console.log(migration_path);

    const migration = await import(`file://${migration_path}`);

    if (migration) {
        await migration.up(connection);
    }

}


async function run_migration() {
    const conn = await createConnection();
    await conn.getConnection();
    await conn.query(`
    CREATE TABLE iF NOT EXISTS migrations(
        id int auto_increment primary key,
        name varchar(60),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
        `);

    let migrations_files = await getMigrationsFiles();
    let built_migrations = await getBuiltMigrations(conn);

    for (let migration of migrations_files) {
        if (built_migrations.includes(migration)) {
            console.log(`skip ${migration} migration`);
            continue;
        }
        try {
            await executeMigration(conn, migration);
            await declareMigration(conn, migration);
        }
        catch (e) {
            console.error(e);
        }
    }
    await conn.end();
}

run_migration(); // run migrations



