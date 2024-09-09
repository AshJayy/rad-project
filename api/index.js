import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import questionRoutes from './routes/question.route.js'
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js';
import examRoutes from './routes/exam.route.js';
import subRoutes from './routes/sub.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();

mongoose.connect(process.env.MONGO)
   .then(() => {
      console.log('MongoDB is connected');
   }).catch((err) => {
      console.log(err);
   });

   const __dirname = path.resolve();

const app = express();


app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
   console.log('Server is running on port 3000!!');
});

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/question', questionRoutes);
app.use('/api/exam', examRoutes);
app.use('/api/sub', subRoutes);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

//middleware 
app.use((err, req, res, next) => {
   const statusCode = err.statusCode || 500;
   const message = err.message || 'Internal Server Error';
   res.status(statusCode).json({
      success: false,
      statusCode,
      message,
   });
});