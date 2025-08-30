import express from 'express';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectToDatabase } from './db.js';

import authRoutes from './routes/auth.routes.js';
import cineRoutes from './routes/cine.routes.js';
import salaRoutes from './routes/sala.routes.js';
import peliculaRoutes from './routes/pelicula.routes.js';
import funcionRoutes from './routes/funcion.routes.js';
import userRoutes from './routes/user.routes.js';

import reporteRoutes from './routes/reporte.routes.js';

import { authenticateToken } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/cines', authenticateToken, cineRoutes);
app.use('/api/cines/:cineId/salas', authenticateToken, salaRoutes);
app.use('/api/peliculas', authenticateToken, peliculaRoutes);
app.use('/api/funciones', authenticateToken, funcionRoutes);
app.use('/api/users', authenticateToken, userRoutes);

app.use('/api/reportes', authenticateToken, reporteRoutes);

async function startServer() {
    await connectToDatabase();

    const PORT = process.env.PORT || 3000;
    const HOSTNAME = process.env.HOSTNAME || 'localhost';

    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://${HOSTNAME}:${PORT}`);
    });
}

startServer();