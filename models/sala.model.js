// models/sala.model.js
import { getDb } from '../db.js';
import { ObjectId } from 'mongodb';

const getSalasCollection = () => {
    return getDb().collection('salas');
};

export class SalaModel {
    static async create(sala) {
        sala.cine_id = ObjectId.createFromHexString(sala.cine_id);
        return await getSalasCollection().insertOne(sala);
    }

    static async findByCineId(cineId) {
        return await getSalasCollection().find({ cine_id: ObjectId.createFromHexString(cineId) }).toArray();
    }

    static async getById(id) {
        return await getSalasCollection().findOne({ _id: ObjectId.createFromHexString(id) });
    }

    static async update(id, data) {
        return await getSalasCollection().updateOne(
            { _id: ObjectId.createFromHexString(id) },
            { $set: data }
        );
    }

    static async delete(id) {
        return await getSalasCollection().deleteOne({ _id: ObjectId.createFromHexString(id) });
    }
}