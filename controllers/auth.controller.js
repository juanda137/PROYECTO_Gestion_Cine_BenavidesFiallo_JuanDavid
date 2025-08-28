import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model.js';
import { RegisterDto } from '../dtos/register.dto.js';
import { UserResponseDto } from '../dtos/user-response.dto.js';

export const register = async (req, res) => {
    try {
        const registerData = new RegisterDto(req.body);

        const existingUser = await UserModel.findByIdentificacion(registerData.identificacion);
        if (existingUser) {
            return res.status(400).send('El número de identificación ya está registrado. <a href="/pages/register.html">Volver</a>');
        }

        const hashedPassword = await bcrypt.hash(registerData.password, 10);
        const userToSave = { ...registerData, password: hashedPassword };

        await UserModel.create(userToSave);
        res.redirect('/pages/login.html');

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'El email y la contraseña son requeridos.' });
        }

        const user = await UserModel.findByEmail(email);
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

        res.json({ message: 'Login exitoso', token });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};