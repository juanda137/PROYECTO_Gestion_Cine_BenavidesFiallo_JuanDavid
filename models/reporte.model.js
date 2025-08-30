import { getDb } from '../db.js';
import { ObjectId } from 'mongodb';

const getFuncionesCollection = () => getDb().collection('funciones');

export class ReporteModel {
    static async findFuncionesDisponibles(cineId, peliculaId) {
        const ahora = new Date();

        const funciones = await getFuncionesCollection().find({
            cine_id: ObjectId.createFromHexString(cineId),
            pelicula_id: ObjectId.createFromHexString(peliculaId),
            fecha_hora_inicio: { $gte: ahora }
        }).sort({ fecha_hora_inicio: 1 }).toArray();

        return funciones;
    }

    static async findPeliculasPorCineYFecha(cineId, fecha) {
        const inicioDelDia = new Date(`${fecha}T00:00:00.000Z`);
        
        const finDelDia = new Date(inicioDelDia);
        finDelDia.setUTCDate(finDelDia.getUTCDate() + 1);
        finDelDia.setUTCMilliseconds(finDelDia.getUTCMilliseconds() - 1);

        const peliculas = await getFuncionesCollection().aggregate([
            {
                $match: {
                    cine_id: ObjectId.createFromHexString(cineId),
                    fecha_hora_inicio: {
                        $gte: inicioDelDia,
                        $lte: finDelDia
                    }
                }
            },
            {
                $group: {
                    _id: '$pelicula_id'
                }
            },
            {
                $lookup: {
                    from: 'peliculas',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'peliculaInfo'
                }
            },
            {
                $replaceRoot: {
                    newRoot: { $arrayElemAt: ['$peliculaInfo', 0] }
                }
            }
        ]).toArray();

        return peliculas;
    }

    static async getReportePeliculasProyectadas(fechaInicioStr, fechaFinStr) {
        const fechaInicio = new Date(fechaInicioStr);
        fechaInicio.setHours(0, 0, 0, 0);
        const fechaFin = new Date(fechaFinStr);
        fechaFin.setHours(23, 59, 59, 999);

        const reporte = await getFuncionesCollection().aggregate([
            { $match: { fecha_hora_inicio: { $gte: fechaInicio, $lte: fechaFin } } },
            
            { $project: {
                dia: { $dateToString: { format: "%Y-%m-%d", date: "$fecha_hora_inicio" } },
                cine_id: 1, pelicula_id: 1, sala_id: 1
            }},
            
            { $group: {
                _id: { dia: "$dia", cine_id: "$cine_id", pelicula_id: "$pelicula_id" },
                salasUnicas: { $addToSet: "$sala_id" }
            }},
            
            { $lookup: { from: 'cines', localField: '_id.cine_id', foreignField: '_id', as: 'cineInfo' }},
            
            { $lookup: { from: 'peliculas', localField: '_id.pelicula_id', foreignField: '_id', as: 'peliculaInfo' }},
            
            { $project: {
                _id: 0,
                dia: "$_id.dia",
                cine: { $arrayElemAt: ["$cineInfo.nombre", 0] },
                pelicula: { $arrayElemAt: ["$peliculaInfo.titulo", 0] },
                numero_salas: { $size: "$salasUnicas" }
            }},
            
            { $group: {
                _id: "$dia",
                proyecciones: { $push: { cine: "$cine", pelicula: "$pelicula", numero_salas: "$numero_salas" } }
            }},
            
            { $project: { _id: 0, fecha: "$_id", proyecciones: 1 }},
            { $sort: { fecha: 1 } }
        ]).toArray();

        return reporte;
    }
}