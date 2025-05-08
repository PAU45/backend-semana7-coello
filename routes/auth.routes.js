// Importa Express para definir rutas
import express from "express";

// Importa las funciones del controlador de autenticación
import { signup, signin } from "../controllers/auth.controller.js";

// Importa los middlewares que verifican datos antes de registrar un usuario
import {
  checkDuplicateUsernameOrEmail, // Verifica si el username o email ya existen
  checkRolesExisted // Verifica si los roles enviados son válidos
} from "../middlewares/verifySignUp.js";

// Crea un router de Express para definir las rutas relacionadas con autenticación
const router = express.Router();

// Ruta para registrar un nuevo usuario (signup)
router.post("/signup", [checkDuplicateUsernameOrEmail, checkRolesExisted], signup);

// Ruta para iniciar sesión (signin)
router.post("/signin", signin);

// Exporta el router para poder usarlo en la configuración principal de rutas de la app
export default router;
