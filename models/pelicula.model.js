import { getDb } from '../db.js';
import { ObjectId } from 'mongodb';

const getPeliculasCollection = () => {
    return getDb().collection('peliculas');
};

export class PeliculaModel {
    static async create(pelicula) {
        const existingPelicula = await this.findByCodigo(pelicula.codigo);
        if (existingPelicula) {
            throw new Error('El código de la película ya existe.');
        }
        pelicula.duracion = parseInt(pelicula.duracion, 10);
        pelicula.fecha_estreno = new Date(pelicula.fecha_estreno);
        return await getPeliculasCollection().insertOne(pelicula);
    }

    static async getAll(options = {}) {
        const { sort = {}, limit = 0 } = options;
        return await getPeliculasCollection().find().sort(sort).limit(limit).toArray();
    }

    static async getById(id) {
        return await getPeliculasCollection().findOne({ _id: ObjectId.createFromHexString(id) });
    }
    
    static async findByCodigo(codigo) {
        return await getPeliculasCollection().findOne({ codigo });
    }

    static async update(id, data) {
        if (data.duracion) data.duracion = parseInt(data.duracion, 10);
        if (data.fecha_estreno) data.fecha_estreno = new Date(data.fecha_estreno);
        
        return await getPeliculasCollection().updateOne(
            { _id: ObjectId.createFromHexString(id) },
            { $set: data }
        );
    }

    static async delete(id) {
        return await getPeliculasCollection().deleteOne({ _id: ObjectId.createFromHexString(id) });
    }
}