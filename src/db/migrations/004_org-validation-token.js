
export async function up(connection) {
    await connection.query(`CREATE TABLE org_validation_token
        (
        id int primary key auto_increment,
        organization_id int,
        token varchar(32),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        foreign key(organization_id) REFERENCES organizations(id) ON DELETE CASCADE ON UPDATE CASCADE
        )`)
}

export async function down(connection) {
    await connection.query(`DROP TABLE org_validation_token`);
}