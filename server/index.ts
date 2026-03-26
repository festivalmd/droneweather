import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import checkFlightRouter from './routes/checkFlight';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080'],
  methods: ['GET', 'POST'],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/check-flight', checkFlightRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🛩️  Aero Backend запущен на http://localhost:${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/check-flight`);
});