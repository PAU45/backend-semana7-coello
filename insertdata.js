import db from "./models/index.js";

const changeRoles = async () => {
  try {
    // Conectar a la base de datos
    await db.sequelize.authenticate();
    console.log("✅ Conectado a la base de datos");

    // Obtener el rol "admin"
    const adminRole = await db.role.findOne({ where: { name: "admin" } });
    if (!adminRole) {
      console.error("❌ No se encontró el rol 'admin'. Asegúrate de que exista.");
      return;
    }

    // Cambiar el rol de todos los usuarios existentes
    const users = await db.user.findAll();
    for (const user of users) {
      const hasAdminRole = await user.hasRole(adminRole);
      if (!hasAdminRole) {
        await user.addRole(adminRole);
        console.log(`✅ Rol 'admin' asignado al usuario: ${user.username}`);
      }
    }

    console.log("🎉 Todos los usuarios ahora tienen el rol 'admin'.");
  } catch (error) {
    console.error("❌ Error al cambiar roles:", error);
  } finally {
    // Cerrar la conexión a la base de datos
    await db.sequelize.close();
    console.log("🔒 Conexión cerrada");
  }
};

changeRoles();