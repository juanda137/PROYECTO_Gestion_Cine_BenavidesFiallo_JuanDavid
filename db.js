import { MongoClient } from 'mongodb';
import 'dotenv/config';

const mongoURI = process.env.MONGO_URI;
const client = new MongoClient(mongoURI);

let db;

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Conectado a la base de datos');
        db = client.db('CineAcme');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1);
    }
}

export const getDb = () => {
    if (!db) {
        throw new Error('La base de datos no está inicializada. Llama a connectToDatabase primero.');
    }
    return db;
};

connectToDatabase();