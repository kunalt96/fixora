import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import errorRoutes from './routes/errorRoutes.js';
import analyzeRoutes from './routes/analyzeRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api', errorRoutes);
app.use('/api', analyzeRoutes);

app.get('/', (req, res) => {
  res.send('Fixora API is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
