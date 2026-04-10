import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authMiddleware } from './middleware/authMiddleware.js';
import errorRoutes from './routes/errorRoutes.js';
import analyzeRoutes from './routes/analyzeRoutes.js';
import apiKeyRoutes from './routes/apiKeyRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health check — no auth needed
app.get('/', (req, res) => {
  res.send('Fixora API is running!');
});

// All /api routes are protected by the auth middleware
app.use('/api', authMiddleware);

app.use('/api', errorRoutes);
app.use('/api', analyzeRoutes);
app.use('/api', apiKeyRoutes);
app.use('/api', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
