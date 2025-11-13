import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import shiftsRoutes from './routes/shifts';
import registrationsRoutes from './routes/registrations';
import authRoutes from './routes/auth';
import requestLogger from './middleware/logger';
import logger from './utils/logger';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Ensure logs directory exists
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/api/shifts', shiftsRoutes);
app.use('/api/registrations', registrationsRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
}); 