import express from 'express';
import cors from 'cors'; // <-- 1. YEH LINE ADD KAREIN
import codeAnalyzerRoutes from './routes/ai.routes.js';

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// --- CORE FIX ---
// Allow requests from any origin. This tells your server to accept requests
// from your React app or any other frontend.
app.use(cors()); // <-- 2. YEH LINE ADD KAREIN

// Main route for a basic health check
app.get('/', (req, res) => {
    res.send('CodeXpert API is alive and kicking!');
});

// Mount the analyzer routes under the /api/v1/analyze prefix
app.use('/api/v1/analyze', codeAnalyzerRoutes);

export default app;
