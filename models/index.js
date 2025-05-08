import Sequelize from "sequelize";
import dbConfig from "../config/db.config.js";

// Importamos los modelos
import userModel from "./user.model.js";
import roleModel from "./role.model.js";

// Creamos una instancia de Sequelize con los parámetros de configuración
const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,           // Dirección del servidor de la base de datos
    dialect: dbConfig.dialect,     // Tipo de base de datos (por ejemplo, 'mysql', 'postgres')
    pool: dbConfig.pool,           // Configuración del pool de conexiones
    port: dbConfig.PORT            // Puerto en el que se conecta a la base de datos
  }
);

// Objeto para almacenar Sequelize y los modelos
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Inicialización de modelos
db.user = userModel(sequelize, Sequelize); // Cambiado a minúsculas
db.role = roleModel(sequelize, Sequelize); // Cambiado a minúsculas

// Definimos relación muchos a muchos entre Role y User
db.role.belongsToMany(db.user, {
  through: "user_roles",      // Tabla intermedia
  foreignKey: "roleId",       // Clave foránea hacia Role
  otherKey: "userId"          // Clave foránea hacia User
});

// Relación inversa muchos a muchos entre User y Role
db.user.belongsToMany(db.role, {
  through: "user_roles",      // Tabla intermedia
  foreignKey: "userId",       // Clave foránea hacia User
  otherKey: "roleId",         // Clave foránea hacia Role
  as: "roles"                 // Alias para acceder a los roles desde el usuario
});

// Constante con los roles posibles
db.ROLES = ["user", "admin", "moderator"];

// Exportamos el objeto db
export default db;