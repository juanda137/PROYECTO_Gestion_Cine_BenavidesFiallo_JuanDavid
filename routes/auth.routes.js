import { Router } from 'express';
import { login, register } from '../controllers/auth.controller.js';
import { registerValidationRules, validate } from '../middleware/validator.js';

const router = Router();

// Ruta para el registro
router.post('/register', registerValidationRules(), validate, register);

// Ruta para el login
router.post('/login', login);

export default router;