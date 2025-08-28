import { getDb } from '../db.js';
import { ObjectId } from 'mongodb';

const getUsersCollection = () => {
    return getDb().collection('users');
};

export class UserModel {
    static async create(user) {
        return await getUsersCollection().insertOne(user);
    }

    static async findByIdentificacion(identificacion) {
        return await getUsersCollection().findOne({ identificacion });
    }
    
    static async findByEmail(email) {
        return await getUsersCollection().findOne({ email });
    }

    static async getAll() {
        return await getUsersCollection().find().toArray();
    }

    static async getById(id) {
        return await getUsersCollection().findOne({ _id: ObjectId.createFromHexString(id) });
    }

    static async update(id, data) {
        return await getUsersCollection().updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: data });
    }

    static async delete(id) {
        return await getUsersCollection().deleteOne({ _id: ObjectId.createFromHexString(id) });
    }
}