import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db';
import { errorHandler } from './middlewares/errorMiddleware';

// Routes
import userRoutes from './routes/userRoutes';
import routineRoutes from './routes/routineRoutes';
import stretchRoutes from './routes/stretchRoutes';
import workoutLogRoutes from './routes/workoutLogRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import socialRoutes from './routes/socialRoutes';
import challengeRoutes from './routes/challengeRoutes';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middlewares
// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Set security headers
app.use(helmet());

// Compression
app.use(compression());

// CORS
app.use(cors({
    origin: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.FRONTEND_URL,
    credentials: true
}));

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/routines', routineRoutes);
app.use('/api/v1/stretches', stretchRoutes);
app.use('/api/v1/workouts', workoutLogRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/social', socialRoutes);
app.use('/api/v1/challenges', challengeRoutes);

// Health check
app.get('/health', (_, res) => {
    res.status(200).json({ status: 'ok' })
    return;
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});

export default server;
