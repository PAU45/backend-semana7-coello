export default {
  HOST: "dpg-d0e8ov8dl3ps73bfrs40-a", // Host proporcionado por Render
  USER: "root", // Usuario proporcionado
  PASSWORD: "cJR3CbedVaqOAywDFDfdOkq5OxeRce9K", // Contraseña proporcionada
  DB: "db_umhz", // Nombre de la base de datos
  dialect: "postgres", // Dialecto para PostgreSQL
  PORT: 5432, // Puerto proporcionado
  pool: {
    max: 5, // Número máximo de conexiones en el pool
    min: 0, // Número mínimo de conexiones en el pool
    acquire: 30000, // Tiempo máximo en ms para intentar conectar antes de lanzar un error
    idle: 10000 // Tiempo máximo en ms que una conexión puede estar inactiva antes de ser liberada
  }
};