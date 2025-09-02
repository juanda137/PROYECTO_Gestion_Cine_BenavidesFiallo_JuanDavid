import { getDb } from '../db.js';
import { ObjectId } from 'mongodb';

const getCinesCollection = () => {
    return getDb().collection('cines');
};

export class CineModel {
    static async create(cine) {
        const existingCine = await this.findByCodigo(cine.codigo);
        if (existingCine) {
            throw new Error('El código del cine ya existe.');
        }
        return await getCinesCollection().insertOne(cine);
    }

    static async getAll() {
        return await getCinesCollection().find().toArray();
    }

    static async getById(id) {
        return await getCinesCollection().findOne({ _id: ObjectId.createFromHexString(id) });
    }
    
    static async findByCodigo(codigo) {
        return await getCinesCollection().findOne({ codigo });
    }

    static async update(id, data) {
        return await getCinesCollection().updateOne(
            { _id: ObjectId.createFromHexStrings(id) },
            { $set: data }
        );
    }

    static async delete(id) {
        return await getCinesCollection().deleteOne({ _id: ObjectId.createFromHexString(id) });
    }
}