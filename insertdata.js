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
  
      // Obtener el ID del rol "admin"
      const [adminRole] = await sequelize.query('SELECT id FROM "Roles" WHERE name = $1', {
        bind: ['admin'],
      });
  
      if (adminRole.length === 0) {
        console.error('❌ No se encontró el rol "admin". Asegúrate de que exista en la tabla Roles.');
        return;
      }
  
      const adminRoleId = adminRole[0].id;
  
      // Asignar el rol "admin" a todos los usuarios
      const [users] = await sequelize.query('SELECT id FROM "Users"');
      for (const user of users) {
        const [existing] = await sequelize.query(
          'SELECT * FROM "user_roles" WHERE "roleId" = $1 AND "userId" = $2',
          { bind: [adminRoleId, user.id] }
        );
  
        if (existing.length === 0) {
          await sequelize.query(
            'INSERT INTO "user_roles" ("roleId", "userId", "createdAt", "updatedAt") VALUES ($1, $2, NOW(), NOW())',
            { bind: [adminRoleId, user.id] }
          );
          console.log(`✅ Asignado rol "admin" al usuario con ID ${user.id}`);
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