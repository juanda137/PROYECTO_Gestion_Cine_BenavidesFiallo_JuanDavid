import { Router } from 'express';
import { getFuncionesDisponibles, getPeliculasPorCineYFecha, getReporteProyecciones } from '../controllers/reporte.controller.js';

const router = Router();

router.get('/funciones-disponibles', getFuncionesDisponibles);
router.get('/peliculas-por-fecha', getPeliculasPorCineYFecha);
router.get('/proyecciones-por-rango', getReporteProyecciones);

export default router;