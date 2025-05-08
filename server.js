// Importa Express para crear la aplicación web
import express from "express";

// Importa CORS para permitir solicitudes desde otros dominios (por ejemplo, desde el frontend)
import cors from "cors";

// Importa los modelos y configuración de Sequelize (ORM para la base de datos)
import db from "./models/index.js";

// Importa las rutas de autenticación (signup, signin)
import authRoutes from "./routes/auth.routes.js";

// Importa las rutas protegidas por roles de usuario
import userRoutes from "./routes/user.routes.js";

// Importa child_process para ejecutar scripts externos
import { exec } from "child_process";

// Crea una instancia de la aplicación Express
const app = express();

// Configura las opciones de CORS para permitir acceso desde múltiples orígenes
const corsOptions = {
  origin: [
    "http://localhost:8080", // Para pruebas locales
    "http://localhost:3001", // Para pruebas locales
    "https://frontend-semana7-coello.vercel.app" // Dominio del frontend desplegado
  ],
  methods: ["GET", "POST", "PUT", "DELETE"], // Métodos HTTP permitidos
  credentials: true, // Permitir envío de cookies o encabezados de autenticación
};

// Aplica el middleware de CORS a la aplicación
app.use(cors(corsOptions));

// Middleware para analizar solicitudes con cuerpo en formato JSON
app.use(express.json());

// Middleware para analizar solicitudes con cuerpo en formato URL-encoded (formularios)
app.use(express.urlencoded({ extended: true }));

// Ruta simple para probar que el servidor está funcionando
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Node.js JWT Authentication API." });
});

// Define la ruta base para autenticación: /api/auth/signup y /api/auth/signin
app.use("/api/auth", authRoutes);

// Define la ruta base para pruebas de acceso según el rol del usuario: /api/test/*
app.use("/api/test", userRoutes);

// Define el puerto en el que se ejecutará el servidor. Usa 3000 por defecto si no hay una variable de entorno
const PORT = process.env.PORT || 3000;

// Sincroniza los modelos con la base de datos (sin borrar datos si force es false)
// Luego inicia el servidor y escucha en el puerto definido
db.sequelize.sync({ force: false }).then(() => {
  console.log("Database synchronized");

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);

    // Ejecuta el script de inserción de datos
    exec("node insertdata.js", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error al ejecutar insertdata.js: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      console.log(`stdout: ${stdout}`);
    });
  });
});
