import { Router } from 'express';
import { createBoleta, getBoletasByFuncion } from '../controllers/boleta.controller.js';

const router = Router();

router.post('/', createBoleta);
router.get('/:funcionId', getBoletasByFuncion)

export default router;