require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/error');
const { testConnection } = require('./config/db');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/auth');
const groupRoutes = require('./routes/groups');
const memberRoutes = require('./routes/members');
const transactionRoutes = require('./routes/transactions');
const reportRoutes = require('./routes/reports');

app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reports', reportRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Re-Mmogo API is running!' });
});

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found.` });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Re-Mmogo API running on http://localhost:${PORT}`);
  await testConnection();
});

module.exports = app;