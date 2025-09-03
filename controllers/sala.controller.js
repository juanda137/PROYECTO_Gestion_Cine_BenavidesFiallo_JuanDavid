import { SalaModel } from '../models/sala.model.js';
import { SalaDto } from '../dtos/sala.dto.js';

export const getSalasByCine = async (req, res) => {
    try {
        const { cineId } = req.params;
        const salas = await SalaModel.findByCineId(cineId);
        res.status(200).json(salas);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};

export const createSala = async (req, res) => {
    try {
        const { cineId } = req.params;
        const salaDto = new SalaDto(req.body);
        const salaData = { ...salaDto, cine_id: cineId };
        const newSala = await SalaModel.create(salaData);
        res.status(201).json({ message: 'Sala creada exitosamente', salaId: newSala.insertedId });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};

export const updateSala = async (req, res) => {
    try {
        const { id } = req.params;
        const salaData = new SalaDto(req.body);
        const result = await SalaModel.update(id, salaData);
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Sala no encontrada' });
        }
        res.status(200).json({ message: 'Sala actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};

export const deleteSala = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await SalaModel.delete(id);
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Sala no encontrada' });
        }
        res.status(200).json({ message: 'Sala eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};