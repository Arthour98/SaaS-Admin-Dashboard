

export async function up(connection) {
    try {
        await connection.query(`CREATE table logs(
        id int primary key not null auto_increment,
        user_id int,
        organization_id int,
        type enum ('info','create','delete','update','warning'),
        action text,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  ,
        foreign key(user_id) references users(id) ON UPDATE CASCADE ON DELETE CASCADE ,
        foreign key(organization_id) references organizations(id) ON UPDATE CASCADE ON DELETE CASCADE
            )`)
    }
    catch (e) {
        console.error(e);
    }
}

export async function down(connection) {
    await connection.query(`DROP TABLE logs`);
}