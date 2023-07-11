import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import postRoutes from './routes/posts.js';
import authRoutes from './routes/auth.js';

const app = express();
dotenv.config();

const connect = () => {
	mongoose
		.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
		.then(() => {
			console.log('Connected to DB');
		})
		.catch((err) => {
			throw err;
		});
};

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);
app.get('/', (req, res) => res.send('Hello to Notes API'));

app.use((err, req, res, next) => {
	const status = err.status || 500;
	const message = err.message || 'Something went wrong!';
	return res.status(status).json({
		success: false,
		status,
		message,
	});
});

app.listen(process.env.PORT || 5000, () => {
	connect();
	console.log('Connected to Server');
});
