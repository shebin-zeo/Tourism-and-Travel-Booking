import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js'; // Import the userRouter from the routes/user.route.js file for api calls.
import authRouter from './routes/auth.route.js'; // Import the authRouter from the routes/auth.route.js file for api calls.
import cookieParser from 'cookie-parser';
import createAdmin from './utils/createAdmin.js';
import listingRouter from './routes/listing.routes.js';
import bookingRoutes from './routes/booking.route.js';
import blogRoutes from './routes/blog.routes.js';
import guideRoutes from './routes/guide.routes.js';

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

app.use(cookieParser()); // The cookieParser() middleware is used to parse cookies attached to the client request object. The middleware parses the cookies and populates the req.cookies property with the parsed cookies.

app.listen(3000, () => {
  console.log('Server is running on port 3000 !!!');
  createAdmin();
});



app.use('/api/user', userRouter); // Use the userRouter for all routes that start with /api/user.
app.use('/api/auth', authRouter); // Use the authRouter for all routes that start with /api/auth.
app.use('/api/listing', listingRouter); //Package listing routes
// Mount the booking routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/guide', guideRoutes);


app.use((err,req,res,next)=>{
    const statusCode=err.statusCode||500;
    const message=err.message||'Internal Server Error';
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message});
});