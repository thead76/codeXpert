import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import codeAnalyzerRoutes from './routes/ai.routes.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js'; // <-- IMPORT
import teamRoutes from './routes/team.routes.js'; // <-- IMPORT
import './config/passport.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('CodeXpert API is alive and kicking!');
});

// Mount the routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/analyze', codeAnalyzerRoutes);
app.use('/api/v1/users', userRoutes); // <-- ADD THIS LINE
app.use('/api/v1/teams', teamRoutes); // <-- ADD THIS LINE

export default app;