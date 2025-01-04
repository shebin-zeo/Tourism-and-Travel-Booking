import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js'; // Import the userRouter from the routes/user.route.js file for api calls.
dotenv.config();
mongoose
    .connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB !!!!');
    })
    .catch(err => {
    console.log('Error: ', err.message);
    });

const app = express();
app.listen(3000, () => {
  console.log('Server is running on port 3000 !!!');
});



app.use('/api/user', userRouter); // Use the userRouter for all routes that start with /api/user.