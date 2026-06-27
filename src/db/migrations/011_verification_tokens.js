
export async function up(connection) {
    try {
        await connection.query(`CREATE TABLE verification_tokens(
        id int primary key auto_increment,
        token varchar(32),
        user_id int,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        exprires_at DATETIME,
        foreign key(user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
        )`);
    }
    catch (e) {
        console.error(e);
    }
}

export async function down(connection) {
    await connection.query(`DROP TABLE verification_tokens`);
}