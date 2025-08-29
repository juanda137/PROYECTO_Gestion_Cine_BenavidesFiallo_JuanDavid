import { getDb } from '../db.js';
import { ObjectId } from 'mongodb';

const getFuncionesCollection = () => getDb().collection('funciones');
const getPeliculasCollection = () => getDb().collection('peliculas');

export class FuncionModel {
    static async create(funcionData) {
        const pelicula = await getPeliculasCollection().findOne({ _id: ObjectId.createFromHexString(funcionData.pelicula_id) });
        if (!pelicula) {
            throw new Error('La película seleccionada no existe.');
        }

        const fechaInicio = new Date(funcionData.fecha_hora);
        const duracionMinutos = pelicula.duracion;
        const fechaFin = new Date(fechaInicio.getTime() + duracionMinutos * 60000);

        const salaId = ObjectId.createFromHexString(funcionData.sala_id);
        const overlappingFunction = await getFuncionesCollection().findOne({
            sala_id: salaId,
            $or: [
                { fecha_hora_inicio: { $lt: fechaFin, $gte: fechaInicio } },
                { fecha_hora_fin: { $gt: fechaInicio, $lte: fechaFin } },
                { fecha_hora_inicio: { $lte: fechaInicio }, fecha_hora_fin: { $gte: fechaFin } }
            ]
        });

        if (overlappingFunction) {
            throw new Error('Conflicto de horario: ya existe una función en esa sala y a esa hora.');
        }

        const newFuncion = {
            cine_id: ObjectId.createFromHexString(funcionData.cine_id),
            sala_id: salaId,
            pelicula_id: ObjectId.createFromHexString(funcionData.pelicula_id),
            fecha_hora_inicio: fechaInicio,
            fecha_hora_fin: fechaFin
        };

        return await getFuncionesCollection().insertOne(newFuncion);
    }

    static async getAllDetailed() {
        const funciones = await getFuncionesCollection().aggregate([
            {
                $lookup: {
                    from: 'cines',
                    localField: 'cine_id',
                    foreignField: '_id',
                    as: 'cine'
                }
            },
            {
                $lookup: {
                    from: 'salas',
                    localField: 'sala_id',
                    foreignField: '_id',
                    as: 'sala'
                }
            },
            {
                $lookup: {
                    from: 'peliculas',
                    localField: 'pelicula_id',
                    foreignField: '_id',
                    as: 'pelicula'
                }
            },
            {
                $unwind: '$cine'
            },
            {
                $unwind: '$sala'
            },
            {
                $unwind: '$pelicula'
            },
            {
                $project: {
                    _id: 1,
                    fecha_hora_inicio: 1,
                    "cine.nombre": 1,
                    "sala.codigo": 1,
                    "pelicula.titulo": 1
                }
            }
        ]).toArray();
        return funciones;
    }

    static async delete(id) {
        return await getFuncionesCollection().deleteOne({ _id: ObjectId.createFromHexString(id) });
    }
}