import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes';

dotenv.config();

const app: Express = express();
const PORT: string | number = process.env.PORT || 5000;

const MONOGO_URI = process.env.MONGO_URI as string;

mongoose.connect(MONOGO_URI);

const db = mongoose.connection;

db.on('error', () => console.error('Mongo DB connection error'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', authRoutes);

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
