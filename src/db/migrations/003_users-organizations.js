
export async function up(connection) {
    await connection.query(`CREATE TABLE users_organizations(
        id int primary key auto_increment,
        organization_id int ,
        user_id int,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        foreign key(organization_id) REFERENCES organizations(id) ON UPDATE CASCADE ON DELETE CASCADE,
        foreign key(user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
        )`)
}

export async function down(connection) {
    await connection.query(`DROP TABLE users-organizations`);
}