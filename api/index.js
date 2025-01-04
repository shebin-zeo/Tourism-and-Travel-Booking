import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js'; // Import the userRouter from the routes/user.route.js file for api calls.
import authRouter from './routes/auth.route.js'; // Import the authRouter from the routes/auth.route.js file for api calls.
dotenv.config();
mongoose
    .connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB !!!!');
    })
    .catch(err => {
    console.log('Error: ', err.message);
    });

const app = express();
app.use(express.json()); // The express.json() middleware is used to parse JSON bodies of requests. The middleware is used to parse the body of the incoming request and then populate the req.body property with the parsed data.

app.listen(3000, () => {
  console.log('Server is running on port 3000 !!!');
});



app.use('/api/user', userRouter); // Use the userRouter for all routes that start with /api/user.
app.use('/api/auth', authRouter); // Use the authRouter for all routes that start with /api/auth.