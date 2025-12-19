console.log('Starting server initialization...');
import dotenv from 'dotenv';
// Load environment variables FIRST, before other imports
dotenv.config();

import express from 'express';
import cors from 'cors';
import submitRouter from './routes/submit.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - Dynamic CORS for all Vercel deployments
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);

        // Allow all vercel.app subdomains
        if (origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }

        // Allow localhost for development
        if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
            return callback(null, true);
        }

        // Allow if matches FRONTEND_URL env var
        if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
            return callback(null, true);
        }

        console.log(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true
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
const server = app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 NEXUS SUBMISSION BACKEND                              ║
║   ─────────────────────────────────────────────────────    ║
║   Server running on http://0.0.0.0:${PORT}                   ║
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
// server.timeout = 30 * 60 * 1000;
// server.keepAliveTimeout = 30 * 60 * 1000;
// server.headersTimeout = 30 * 60 * 1000 + 1000;

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Process terminated');
    });
});
