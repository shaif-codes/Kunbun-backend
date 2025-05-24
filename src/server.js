import express from 'express';
import http from 'http';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import router from './routes/index.js';
import { config } from './config/index.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// TODO: Import routes and socket handlers
// import apiRoutes from './routes/index.js';
// app.use('/api', apiRoutes);
// import sockets from './sockets/index.js';
// sockets(io);


// Routes
app.use('/api', router);

// MongoDB Connection
mongoose.connect(config.mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = config.port || 7700;
server.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
