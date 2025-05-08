// Importa Express para crear rutas
import express from "express";

// Importa los controladores que manejan las respuestas según el rol del usuario
import {
  allAccess,        // Respuesta para ruta pública
  userBoard,        // Respuesta para usuarios autenticados
  adminBoard,       // Respuesta para administradores
  moderatorBoard    // Respuesta para moderadores
} from "../controllers/user.controller.js";

// Importa middlewares de autenticación y autorización
import {
  verifyToken,         // Verifica que el usuario esté autenticado (token válido)
  isAdmin,             // Verifica que el usuario tenga rol de admin
  isModerator,         // Verifica que el usuario tenga rol de moderador
  isModeratorOrAdmin   // Verifica que tenga uno de los dos roles
} from "../middlewares/authJWT.js";

// Crea una instancia de router para definir las rutas protegidas
const router = express.Router();

// Ruta pública: no requiere autenticación
router.get("/all", allAccess);

// Ruta solo para usuarios autenticados (requiere token JWT válido)
router.get("/user", [verifyToken], userBoard);

// Ruta solo para moderadores (requiere token + rol moderador)
router.get("/mod", [verifyToken, isModerator], moderatorBoard);

// Ruta solo para administradores (requiere token + rol admin)
router.get("/admin", [verifyToken, isAdmin], adminBoard);

import { getAllUsers } from "../controllers/auth.controller.js";

// Ruta para obtener todos los usuarios (requiere token JWT válido)
router.get("/users", getAllUsers);

// Exporta el router para que pueda ser usado en app.js o server.js
export default router;