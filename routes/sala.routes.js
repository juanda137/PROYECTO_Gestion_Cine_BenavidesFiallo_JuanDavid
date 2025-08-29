import { Router } from 'express';
import { getSalasByCine, createSala, updateSala, deleteSala } from '../controllers/sala.controller.js';

const router = Router({ mergeParams: true });

router.get('/', getSalasByCine);

router.post('/', createSala);

router.put('/:id', updateSala);

router.delete('/:id', deleteSala);

export default router;