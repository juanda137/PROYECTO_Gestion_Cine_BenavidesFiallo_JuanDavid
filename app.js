import express from 'express';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

import './db.js';

import authRoutes from './routes/auth.routes.js';
import cineRoutes from './routes/cine.routes.js';
import salaRoutes from './routes/sala.routes.js';
import peliculaRoutes from './routes/pelicula.routes.js';

import { authenticateToken } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);

app.get('/dashboard', authenticateToken, (req, res) => {
    res.json({
        message: `Bienvenido al dashboard, usuario con ID: ${req.user.id}!`,
        userData: req.user
    });
});
app.use('/api/cines', authenticateToken, cineRoutes);
app.use('/api/cines/:cineId/salas', authenticateToken, salaRoutes);
app.use('/api/peliculas', authenticateToken, peliculaRoutes); 

const PORT = process.env.PORT || 3000;
const HOSTNAME = process.env.HOSTNAME || 'localhost';

app.listen(PORT, () => console.log(`Servidor corriendo en http://${HOSTNAME}:${PORT}`));