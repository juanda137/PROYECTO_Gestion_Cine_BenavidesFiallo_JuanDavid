import { Router } from 'express';
import { getAllFunciones, createFuncion, deleteFuncion } from '../controllers/funcion.controller.js';

const router = Router();

router.get('/', getAllFunciones);
router.post('/', createFuncion);
router.delete('/:id', deleteFuncion);

export default router;