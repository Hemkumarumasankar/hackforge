import dotenv from 'dotenv';
// Load environment variables FIRST, before other imports
dotenv.config();

import express from 'express';
import cors from 'cors';
import submitRouter from './routes/submit.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// Middleware
const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.FRONTEND_URL,
    'https://hackforgesubmissionportal-six.vercel.app'
].filter(Boolean) as string[];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Routes
app.use('/api', submitRouter);

// Root endpoint
app.get('/', (_req, res) => {
    res.json({
        name: 'Nexus Submission Portal API',
        version: '1.0.0',
        status: 'running'
    });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 NEXUS SUBMISSION BACKEND                              ║
║   ─────────────────────────────────────────────────────    ║
║   Server running on http://localhost:${PORT}                 ║
║   API Endpoint: http://localhost:${PORT}/api/upload          ║
║   ⏱️  Timeout set to 30 minutes for large uploads           ║
║                                                            ║
║   Configured Destinations:                                 ║
║   • Senesense Solutions → Mega Account 1                   ║
║   • Webbed → Mega Account 2                                ║
║   • Techknots → Mega Account 3                             ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

// Set timeout to 30 minutes (1.8 million milliseconds) to handle 2GB uploads
server.timeout = 30 * 60 * 1000;
server.keepAliveTimeout = 30 * 60 * 1000;
server.headersTimeout = 30 * 60 * 1000 + 1000;
