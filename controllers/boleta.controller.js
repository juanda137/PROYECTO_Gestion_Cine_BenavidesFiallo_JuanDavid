import { BoletaModel } from '../models/boleta.model.js';
import { BoletaDto } from '../dtos/boleta.dto.js';

export const createBoleta = async (req, res) => {
    try {
        const boletaData = new BoletaDto(req.body);
        
        const newBoleta = await BoletaModel.create({...boletaData, user_id: req.user.id});

        res.status(201).json({ message: 'Boleta comprada exitosamente', boletaId: newBoleta.insertedId });
    } catch (error) {
        if (error.message.includes('asientos disponibles')) {
            return res.status(409).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

export const getBoletasByFuncion = async (req, res) => {
    try {
        const { funcionId } = req.params;
        const boletas = await BoletaModel.findByFuncionId(funcionId);
        res.status(200).json(boletas);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
}