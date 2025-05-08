const fs = require('fs');
const db = require('./config/db.config'); // Asegúrate de que este archivo esté configurado para tu conexión a la base de datos

const insertData = async () => {
    try {
        const data = JSON.parse(fs.readFileSync('data.json'));

        // Insertar roles
        for (const role of data.roles) {
            const [existingRole] = await db.query('SELECT * FROM roles WHERE name = ?', [role.name]);
            if (existingRole.length === 0) {
                await db.query('INSERT INTO roles (name, createdAt, updatedAt) VALUES (?, NOW(), NOW())', [role.name]);
                console.log(`Inserted role: ${role.name}`);
            }
        }

        // Vincular roles con usuarios
        for (const userRole of data.user_roles) {
            await db.query('INSERT IGNORE INTO user_roles (roleId, userId, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())', 
            [userRole.roleId, userRole.userId]);
            console.log(`Linked role ID ${userRole.roleId} with user ID ${userRole.userId}`);
        }
    } catch (error) {
        console.error('Error inserting data:', error);
    }
};

insertData();