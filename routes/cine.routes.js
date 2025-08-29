import { Router } from 'express';
import { getAllCines, createCine, updateCine, deleteCine, getCineById } from '../controllers/cine.controller.js';

const router = Router();

router.get('/', getAllCines);

router.post('/', createCine);

router.put('/:id', updateCine);

router.delete('/:id', deleteCine);

router.get('/:id', getCineById);

export default router;