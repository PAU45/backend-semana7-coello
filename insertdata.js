import fs from 'fs';
import { createConnection } from 'mysql2/promise'; // Asegúrate de tener mysql2 instalado

const db = await createConnection({
    host: "dpg-d0e8ov8dl3ps73bfrs40-a",
    user: "root",
    database: "db_umhz",
    password:  "cJR3CbedVaqOAywDFDfdOkq5OxeRce9K"
});

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
    } finally {
        await db.end(); // Cerrar la conexión
    }
};

insertData();