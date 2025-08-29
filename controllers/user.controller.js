import { UserModel } from '../models/user.model.js';
import { UserResponseDto } from '../dtos/user-response.dto.js';
import bcrypt from 'bcrypt';

export const createUser = async (req, res) => {
    try {
        const userData = req.body;

        const existingUserById = await UserModel.findByIdentificacion(userData.identificacion);
        if (existingUserById) {
            return res.status(409).json({ message: 'La identificación ya está registrada.' });
        }
        const existingUserByEmail = await UserModel.findByEmail(userData.email);
        if (existingUserByEmail) {
            return res.status(409).json({ message: 'El email ya está registrado.' });
        }

        userData.password = await bcrypt.hash(userData.password, 10);

        const newUser = await UserModel.create(userData);
        res.status(201).json({ message: 'Usuario creado exitosamente', userId: newUser.insertedId });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.getAll();
        const usersDto = users.map(user => new UserResponseDto(user));
        res.status(200).json(usersDto);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserModel.getById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};


export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userData = req.body;

        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        } else {
            delete userData.password;
        }

        const result = await UserModel.update(id, userData);
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json({ message: 'Usuario actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const userToDelete = await UserModel.getById(id);
        if (!userToDelete) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (userToDelete.email === 'prueba@acme.com') {
            return res.status(403).json({ message: 'No se puede eliminar al usuario de prueba.' });
        }

        const result = await UserModel.delete(id);
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};