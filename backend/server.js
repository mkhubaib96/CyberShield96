require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./src/routes/authRoutes');
const childRoutes = require('./src/routes/childRoutes');
const { errorHandler } = require('./src/utils/errors');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure database directory exists
const dbDir = path.dirname(process.env.DATABASE_PATH || './src/database/users.db');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8080',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/children', childRoutes);

// SERVE FRONTEND STATIC FILES
// This allows the app to run on a single port (3000) without proxy issues
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));

    // Handle SPA routing - send all non-API requests to index.html
    app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });
} else {
    // Health Check / Fallback if built files missing
    app.get('/', (req, res) => {
        res.json({ message: 'KidGuard Auth Server running. Frontend build not found in ../dist' });
    });
}

// Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});
