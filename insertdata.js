import db from "./models/index.js";

const changeRoles = async () => {
  try {
    // Conectar a la base de datos
    await db.sequelize.authenticate();
    console.log("✅ Conectado a la base de datos");

    // Obtener los roles "user", "admin" y "moderator"
    const userRole = await db.role.findOne({ where: { name: "user" } });
    const adminRole = await db.role.findOne({ where: { name: "admin" } });
    const moderatorRole = await db.role.findOne({ where: { name: "moderator" } });

    if (!userRole || !adminRole || !moderatorRole) {
      console.error("❌ No se encontraron todos los roles ('user', 'admin', 'moderator'). Asegúrate de que existan.");
      return;
    }

    const roles = [userRole, adminRole, moderatorRole]; // Lista de roles disponibles

    // Cambiar el rol de todos los usuarios existentes
    const users = await db.user.findAll();
    for (const user of users) {
      // Seleccionar un rol aleatorio
      const randomRole = roles[Math.floor(Math.random() * roles.length)];

      // Verificar si el usuario ya tiene el rol asignado
      const hasRole = await user.hasRole(randomRole);
      if (!hasRole) {
        await user.addRole(randomRole);
        console.log(`✅ Rol '${randomRole.name}' asignado al usuario: ${user.username}`);
      }
    }

    console.log("🎉 Roles asignados aleatoriamente a todos los usuarios.");
  } catch (error) {
    console.error("❌ Error al cambiar roles:", error);
  } finally {
    // Cerrar la conexión a la base de datos
    await db.sequelize.close();
    console.log("🔒 Conexión cerrada");
  }
};

changeRoles();