import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';

// Sabhi route files ko import karein
import codeAnalyzerRoutes from './routes/ai.routes.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import teamRoutes from './routes/team.routes.js';

import './config/passport.js'; // Passport configuration ko import karna

const app = express();

// Middleware
app.use(express.json({ limit: '16mb' })); // Image upload ke liye limit badhayein
app.use(cors());

// Express session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Health check route
app.get('/', (req, res) => {
  res.send('CodeXpert API is alive and kicking!');
});

// Sabhi routes ko mount karein
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/analyze', codeAnalyzerRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/teams', teamRoutes);

export default app;

