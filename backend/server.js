require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth',        require('./src/routes/auth'));
app.use('/api/events',      require('./src/routes/events'));
app.use('/api/teams',       require('./src/routes/teams'));
app.use('/api/abstracts',   require('./src/routes/abstracts'));
app.use('/api/scores',      require('./src/routes/scores'));
app.use('/api/leaderboard', require('./src/routes/leaderboard'));
app.use('/api/admin',       require('./src/routes/admin'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`EventHub API running on http://localhost:${PORT}`));
