import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { EventEmitter } from "events";
EventEmitter.defaultMaxListeners = 20;
import userRouter from './routes/user.route.js'; // Import the userRouter from the routes/user.route.js file for api calls.
import authRouter from './routes/auth.route.js'; // Import the authRouter from the routes/auth.route.js file for api calls.
import cookieParser from 'cookie-parser';
import createAdmin from './utils/createAdmin.js';
import listingRouter from './routes/listing.routes.js';
import bookingRoutes from './routes/booking.route.js';
import blogRoutes from './routes/blog.routes.js';
import guideRoutes from './routes/guide.routes.js';
import complaintRoutes from './routes/complaint.route.js';
import paymentReportsRoutes from "./routes/paymentReports.route.js"; // New Payment Reports router
import destinationRoutes from './routes/destination.routes.js'; //New for destionation
import chatRoutes from './routes/chat.routes.js';
import invoiceRouter from "./routes/refund.routes.js"; // New invoice route
import subscriptionRoutes from './routes/subscription.routes.js';
import newsletterRoutes from './routes/newsletter.routes.js';
import path from 'path';

dotenv.config();
mongoose
    .connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB !!!!');
    })
    .catch(err => {
    console.log('Error: ', err.message);
    });
    const __dirname = path.resolve();

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
//For Admin get assign guide route
app.use('/api/guide', guideRoutes);
//For complaints routes
app.use('/api/complaints', complaintRoutes);
//User side guide complaints routes
app.use('/api/guides', guideRoutes);

// Mount booking routes under /api/bookings
app.use("/api/bookings", bookingRoutes);
// Mount the Payment Reports route separately at /api/PaymentReport
app.use("/api/PaymentReport", paymentReportsRoutes);

app.use('/api/chat', chatRoutes);
//For destination routes
app.use('/api/destinations', destinationRoutes);
//For refund routes
app.use("/api/refund", invoiceRouter);
//For subscription routes
// Mount the subscription route under /api
app.use('/api/subscribe', subscriptionRoutes);
//For newsletter routes
app.use('/api/newsletter', newsletterRoutes);   
app.use(express.static(path.join(__dirname, '/client/dist')));
 
 app.get('*', (req, res) => {
   res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
 })


app.use((err,req,res,next)=>{
    const statusCode=err.statusCode||500;
    const message=err.message||'Internal Server Error';
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message});
});