import { MongoClient } from 'mongodb';
import 'dotenv/config';
import bcrypt from 'bcrypt';

const mongoURI = process.env.MONGO_URI;
const client = new MongoClient(mongoURI);

let db;

async function seedDatabase() {
    try {
        const usersCollection = db.collection('users');
        
        const existingUser = await usersCollection.findOne({ email: 'prueba@acme.com' });

        if (!existingUser) {
            console.log('Usuario de prueba no encontrado, creándolo...');
            
            const hashedPassword = await bcrypt.hash('123456', 10);

            const testUser = {
                identificacion: '0000',
                nombre: 'usuarioPrueba',
                telefono: '0000000000',
                email: 'prueba@acme.com',
                cargo: 'administrador',
                password: hashedPassword
            };

            await usersCollection.insertOne(testUser);
            console.log('Usuario de prueba creado exitosamente.');
        } else {
            console.log('El usuario de prueba ya existe.');
        }
    } catch (error) {
        console.error('Error al intentar crear el usuario de prueba:', error);
    }
}

export async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Conectado a la base de datos');
        db = client.db('CineAcme');

        await seedDatabase();
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1);
    }
}

export const getDb = () => {
    if (!db) {
        throw new Error('La base de datos no está inicializada.');
    }
    return db;
};