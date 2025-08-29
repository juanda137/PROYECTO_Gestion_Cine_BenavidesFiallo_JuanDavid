// controllers/funcion.controller.js
import { FuncionModel } from '../models/funcion.model.js';

export const getAllFunciones = async (req, res) => {
    try {
        const funciones = await FuncionModel.getAllDetailed();
        res.status(200).json(funciones);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

export const createFuncion = async (req, res) => {
    try {
        const newFuncion = await FuncionModel.create(req.body);
        res.status(201).json({ message: 'Función creada exitosamente', funcionId: newFuncion.insertedId });
    } catch (error) {
        if (error.message.includes('Conflicto de horario')) {
            return res.status(409).json({ message: error.message }); // 409 Conflict
        }
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

export const deleteFuncion = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await FuncionModel.delete(id);
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Función no encontrada' });
        }
        res.status(200).json({ message: 'Función eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};