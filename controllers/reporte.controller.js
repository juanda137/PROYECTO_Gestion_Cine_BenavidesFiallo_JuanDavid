import { ReporteModel } from '../models/reporte.model.js';

export const getFuncionesDisponibles = async (req, res) => {
    try {
        const { cineId, peliculaId } = req.query;

        if (!cineId || !peliculaId) {
            return res.status(400).json({ message: 'Se requiere el ID del cine y de la película.' });
        }

        const funciones = await ReporteModel.findFuncionesDisponibles(cineId, peliculaId);
        
        if (funciones.length === 0) {
            return res.status(404).json({ message: 'No se encontraron funciones disponibles para esta selección.' });
        }
        
        res.status(200).json(funciones);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

export const getPeliculasPorCineYFecha = async (req, res) => {
    try {
        const { cineId, fecha } = req.query;
        if (!cineId || !fecha) {
            return res.status(400).json({ message: 'Se requiere el ID del cine y una fecha.' });
        }

        const peliculas = await ReporteModel.findPeliculasPorCineYFecha(cineId, fecha);
        res.status(200).json(peliculas);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

export const getReporteProyecciones = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;
        if (!fechaInicio || !fechaFin) {
            return res.status(400).json({ message: 'Se requiere una fecha de inicio y una fecha de fin.' });
        }

        const reporte = await ReporteModel.getReportePeliculasProyectadas(fechaInicio, fechaFin);
        res.status(200).json(reporte);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};