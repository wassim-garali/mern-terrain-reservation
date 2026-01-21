require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const terrainRoutes = require('./routes/terrainRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const aiRoutes = require('./routes/ai.js') ;
const app = express();
app.use(express.json());

connectDB();

app.use(cors({
    origin: 'http://localhost:5173', // URL de votre front React (sans slash final)
    credentials: true // si vous utilisez les cookies ou authentification
}));

app.use('/api/auth', authRoutes);
app.use('/api/terrains', terrainRoutes);
app.use('/api/reservations', reservationRoutes);
app.use("/api/ai", aiRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`)
);
