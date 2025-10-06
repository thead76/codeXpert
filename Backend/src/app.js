import express from 'express';
import cors from 'cors';
import passport from 'passport';
import './config/passport.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import aiRoutes from './routes/ai.routes.js';
import teamRoutes from './routes/team.routes.js';
import notificationRoutes from './routes/notification.routes.js'; // Make sure this is imported
import taskRoutes from './routes/task.routes.js';


const app = express();

// Middleware
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/teams', teamRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/notifications', notificationRoutes); 
app.use('/api/v1/tasks', taskRoutes);

export default app;