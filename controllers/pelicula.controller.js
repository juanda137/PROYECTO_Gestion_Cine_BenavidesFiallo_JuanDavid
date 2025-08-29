import { PeliculaModel } from '../models/pelicula.model.js';

export const getAllPeliculas = async (req, res) => {
    try {
        const peliculas = await PeliculaModel.getAll();
        res.status(200).json(peliculas);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

export const getPeliculaById = async (req, res) => {
    try {
        const { id } = req.params;
        const pelicula = await PeliculaModel.getById(id);
        if (!pelicula) return res.status(404).json({ message: 'Película no encontrada' });
        res.status(200).json(pelicula);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

export const createPelicula = async (req, res) => {
    try {
        const newPelicula = await PeliculaModel.create(req.body);
        res.status(201).json({ message: 'Película creada exitosamente', peliculaId: newPelicula.insertedId });
    } catch (error) {
        if (error.message.includes('código de la película ya existe')) {
            return res.status(409).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

export const updatePelicula = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await PeliculaModel.update(id, req.body);
        if (result.matchedCount === 0) return res.status(404).json({ message: 'Película no encontrada' });
        res.status(200).json({ message: 'Película actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

export const deletePelicula = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await PeliculaModel.delete(id);
        if (result.deletedCount === 0) return res.status(404).json({ message: 'Película no encontrada' });
        res.status(200).json({ message: 'Película eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};