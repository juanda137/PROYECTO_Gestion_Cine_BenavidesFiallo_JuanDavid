import { getDb } from '../db.js';
import { ObjectId } from 'mongodb';

const getBoletasCollection = () => {
    return getDb().collection('boletas');
};

const getFuncionesCollection = () => {
    return getDb().collection('funciones');
}

export class BoletaModel {
    static async create(boleta) {
        const funcion = await getFuncionesCollection().findOne({ _id: ObjectId.createFromHexString(boleta.funcion_id) });
        if (!funcion) {
            throw new Error('La función especificada no existe.');
        }

        const sala = await getDb().collection('salas').findOne({ _id: funcion.sala_id });
        if (!sala) {
            throw new Error('La sala especificada no existe.');
        }

        const aggregationResult = await getBoletasCollection().aggregate([
            { $match: { funcion_id: ObjectId.createFromHexString(boleta.funcion_id) } },
            { $group: { _id: '$funcion_id', totalAsientosVendidos: { $sum: "$cantidad_asientos" } } }
        ]).toArray();

        const asientosVendidos = aggregationResult.length > 0 ? aggregationResult[0].totalAsientosVendidos : 0;
        
        if (asientosVendidos + boleta.cantidad_asientos > sala.numero_sillas) {
            const asientosDisponibles = sala.numero_sillas - asientosVendidos;
            throw new Error(`No hay suficientes asientos disponibles. Solo quedan ${asientosDisponibles} asientos.`);
        }
        
        boleta.funcion_id = ObjectId.createFromHexString(boleta.funcion_id);
        boleta.user_id = ObjectId.createFromHexString(boleta.user_id);


        return await getBoletasCollection().insertOne(boleta);
    }

    static async findByFuncionId(funcionId) {
        return await getBoletasCollection().find({ funcion_id: ObjectId.createFromHexString(funcionId) }).toArray();
    }

    static async salesReportByDate(boleta, funcionId) {
        const inicioDelDia = new Date(`${fecha}T00:00:00.000Z`);
        
        const finDelDia = new Date(inicioDelDia);
        finDelDia.setUTCDate(finDelDia.getUTCDate() + 1);
        finDelDia.setUTCMilliseconds(finDelDia.getUTCMilliseconds() - 1);

        const boletas = await getFuncionesCollection()
        console.log(boletas)
    }
}