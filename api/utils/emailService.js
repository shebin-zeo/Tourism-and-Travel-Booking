import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address
    pass: process.env.GMAIL_APP_PASSWORD, // Your Gmail app password
  },
});

export const sendBookingConfirmation = async (to, booking) => {
  // Customize your email content as needed.
  const mailOptions = {
    from: process.env.EMAIL_FROM, // e.g., "Your Company <yourgmail@gmail.com>"
    to, // Recipient's email
    subject: 'Booking Confirmation',
    text: `Hello,

Your booking (ID: ${booking._id}) for the package "${booking.package.title}" on ${new Date(booking.bookingDate).toLocaleDateString()} has been successfully received.

Thank you for booking with us!`,
    html: `<p>Hello,</p>
           <p>Your booking (ID: <strong>${booking._id}</strong>) for the package "<strong>${booking.package.title}</strong>" on <strong>${new Date(booking.bookingDate).toLocaleDateString()}</strong> has been successfully received.</p>
           <p>Thank you for booking with us!</p>`,
  };

  return transporter.sendMail(mailOptions);
};
