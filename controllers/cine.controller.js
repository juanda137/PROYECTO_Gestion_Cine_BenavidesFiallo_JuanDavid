import { CineModel } from '../models/cine.model.js';

export const getAllCines = async (req, res) => {
    try {
        const cines = await CineModel.getAll();
        res.status(200).json(cines);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};

export const createCine = async (req, res) => {
    try {
        const newCine = await CineModel.create(req.body);
        res.status(201).json({ message: 'Cine creado exitosamente', cineId: newCine.insertedId });
    } catch (error) {
        if (error.message.includes('código del cine ya existe')) {
            return res.status(409).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};

export const updateCine = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await CineModel.update(id, req.body);
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Cine no encontrado' });
        }
        res.status(200).json({ message: 'Cine actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};

export const deleteCine = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await CineModel.delete(id);
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Cine no encontrado' });
        }
        res.status(200).json({ message: 'Cine eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};