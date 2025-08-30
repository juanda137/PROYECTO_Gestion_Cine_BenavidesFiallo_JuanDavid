import { Router } from 'express';
import { getAllPeliculas, getPeliculaById, createPelicula, updatePelicula, deletePelicula, getRecentPeliculas } from '../controllers/pelicula.controller.js';

const router = Router();

router.get('/recent', getRecentPeliculas);
router.get('/', getAllPeliculas);
router.get('/:id', getPeliculaById);
router.post('/', createPelicula);
router.put('/:id', updatePelicula);
router.delete('/:id', deletePelicula);

export default router;