import { Sequelize } from 'sequelize';
import fs from 'fs';
import dbConfig from './config/db.config.js';

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: dbConfig.PORT,
  pool: dbConfig.pool,
  logging: false,
});

const insertData = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos');

    const data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));

    // Insertar roles
    for (const role of data.roles) {
      const [existingRole] = await sequelize.query('SELECT * FROM "Roles" WHERE name = $1', {
        bind: [role.name],
      });

      if (existingRole.length === 0) {
        await sequelize.query(
          'INSERT INTO "Roles" (name, "createdAt", "updatedAt") VALUES ($1, NOW(), NOW())',
          { bind: [role.name] }
        );
        console.log(`✅ Inserted role: ${role.name}`);
      }
    }

    // Vincular roles con usuarios
    for (const userRole of data.user_roles) {
      const [existing] = await sequelize.query(
        'SELECT * FROM "user_roles" WHERE "roleId" = $1 AND "userId" = $2',
        { bind: [userRole.roleId, userRole.userId] }
      );

      if (existing.length === 0) {
        await sequelize.query(
          'INSERT INTO "user_roles" ("roleId", "userId", "createdAt", "updatedAt") VALUES ($1, $2, NOW(), NOW())',
          { bind: [userRole.roleId, userRole.userId] }
        );
        console.log(`✅ Linked role ID ${userRole.roleId} with user ID ${userRole.userId}`);
      }
    }
  } catch (error) {
    console.error('❌ Error inserting data:', error);
  } finally {
    await sequelize.close();
    console.log('🔒 Conexión cerrada');
  }
};

insertData();
