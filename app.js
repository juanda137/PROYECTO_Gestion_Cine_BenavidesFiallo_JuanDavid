import express from 'express';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerValidationRules, validate } from './middleware/validator.js';
import { authenticateToken } from './middleware/auth.js';
import { RegisterDto } from './dtos/register.dto.js';
import { UserResponseDto } from './dtos/user-response.dto.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const mongoURI = process.env.MONGO_URI;
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

app.post('/register', registerValidationRules(), validate, async (req, res) => {
    try {
        const registerData = new RegisterDto(req.body);
        const database = client.db('CineAcme');
        const users = database.collection('users');
        const existingUser = await users.findOne({ identificacion: registerData.identificacion });
        if (existingUser) {
            return res.status(400).send('El número de identificación ya está registrado. <a href="/pages/register.html">Volver</a>');
        }
        const hashedPassword = await bcrypt.hash(registerData.password, 10);
        const userToSave = { ...registerData, password: hashedPassword };
        await users.insertOne(userToSave);
        res.redirect('/pages/login.html');
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'El email y la contraseña son requeridos.' });
        }
        const database = client.db('CineAcme');
        const users = database.collection('users');
        const user = await users.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }
        const userDto = new UserResponseDto(user);
        const payload = { ...userDto };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.redirect('/pages/dashboard.html');
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

app.get('/dashboard', authenticateToken, (req, res) => {
    res.json({
        message: `Bienvenido al dashboard, usuario con ID: ${req.user.id}!`,
        userData: req.user
    });
});

app.listen({
    port: process.env.PORT,
    hostname: process.env.HOSTNAME
}, () => console.log(`Servidor corriendo en ${process.env.HOSTNAME}:${process.env.PORT}`));