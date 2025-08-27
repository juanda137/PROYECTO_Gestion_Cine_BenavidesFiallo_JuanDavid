import express from 'express';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const app = express();

app.use(express.json());

const mongoURI = process.env.MONGO_URI
const client = new MongoClient(mongoURI);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Conectado a la base de datos');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
}

connectToDatabase();

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'El nombre de usuario y la contraseña son obligatorios' });
        }

        const database = client.db('CineAcme');
        const users = database.collection('users');

        const existingUser = await users.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'El nombre de usuario ya existe' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await users.insertOne({
            username,
            password: hashedPassword
        });

        res.status(201).json({ message: 'Usuario registrado exitosamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

app.listen({
    port: process.env.PORT,
    hostname: process.env.HOSTNAME
}, () => console.log(`Servidor corriendo en ${process.env.HOSTNAME}:${process.env.PORT}`));