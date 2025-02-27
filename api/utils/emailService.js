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
  // Build a list of traveller names with a person icon (using Unicode 👤)
  const travellersList = booking.travellers && booking.travellers.length > 0
    ? booking.travellers
        .map(
          traveller =>
            `<li style="margin-bottom: 5px;"><span style="font-size: 16px; margin-right: 8px;">👤</span>${traveller.name}</li>`
        )
        .join('')
    : '<li>N/A</li>';

  const mailOptions = {
    from: process.env.EMAIL_FROM, // e.g., "WanderSphere <yourgmail@gmail.com>"
    to, // Recipient's email
    subject: 'Booking Confirmation',
    text: `Hello,

Your booking (ID: ${booking._id}) for the package "${booking.package.title}" on ${new Date(
      booking.bookingDate
    ).toLocaleDateString()} has been successfully received.

Travellers: ${booking.travellers.map(t => t.name).join(', ')}

If you have any questions, please contact our support team at wandersphereindia@outlook.com or call +91 9567834271.

Thank you for booking with WanderSphere!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 0;">
        <!-- Header -->
        <div style="background-color: #4f46e5; padding: 20px; text-align: center; border-radius: 4px 4px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Booking Confirmation</h1>
        </div>
        <!-- Body -->
        <div style="padding: 20px; color: #333333;">
          <p style="font-size: 16px;">Hello,</p>
          <p style="font-size: 16px;">Thank you for booking with <strong>WanderSphere</strong>! Your booking has been successfully received and is being processed. Below are your booking details:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 8px; border: 1px solid #e0e0e0;"><strong>Booking ID</strong></td>
              <td style="padding: 8px; border: 1px solid #e0e0e0;">${booking._id}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #e0e0e0;"><strong>Package</strong></td>
              <td style="padding: 8px; border: 1px solid #e0e0e0;">${booking.package.title}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #e0e0e0;"><strong>Booking Date</strong></td>
              <td style="padding: 8px; border: 1px solid #e0e0e0;">${new Date(booking.bookingDate).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #e0e0e0;"><strong>Number of Travellers</strong></td>
              <td style="padding: 8px; border: 1px solid #e0e0e0;">${booking.travellers.length}</td>
            </tr>
          </table>
          <h3 style="font-size: 18px; font-weight: bold; margin-top: 20px;">Traveller Names:</h3>
          <ul style="list-style: none; padding: 0;">
            ${travellersList}
          </ul>
          <!-- Contact Support Section -->
          <h3 style="font-size: 18px; font-weight: bold; margin-top: 20px;">Need Assistance?</h3>
          <div style="margin-top: 10px; padding: 10px; background-color: #f0f0f0; border-radius: 4px;">
            <p style="margin: 0; font-size: 16px;">
              <strong>Email:</strong> <a href="mailto:wandersphereindia@outlook.com" style="color: #4f46e5; text-decoration: none;">wandersphereindia@outlook.com</a>
            </p>
            <p style="margin: 0; font-size: 16px;">
              <strong>Phone:</strong> <a href="tel:+919567834271" style="color: #4f46e5; text-decoration: none;">+91 9567834271</a>
            </p>
          </div>
          <p style="font-size: 16px; margin-top: 20px;">Thank you for booking with <strong>WanderSphere</strong>!</p>
        </div>
        <!-- Footer -->
        <div style="background-color: #f7f7f7; padding: 15px; text-align: center; font-size: 14px; color: #777777; border-radius: 0 0 4px 4px;">
          <p>&copy; ${new Date().getFullYear()} WanderSphere. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};


export const sendGuideAppointmentEmail = async (guide) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM, // e.g., "WanderSphere <wandersphereindia@outlook.com>"
    to: guide.email,
    subject: 'Congratulations on Your Appointment as Guide!',
    text: `Hello ${guide.username},

Congratulations! You have been appointed as a guide with WanderSphere. We are excited to have you on board.

If you have any questions, please contact our support team at support@wandersphere.com or call +1 (234) 567-890.

Best regards,
WanderSphere Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 0;">
        <!-- Header -->
        <div style="background-color: #4f46e5; padding: 20px; text-align: center; border-radius: 4px 4px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Congratulations!</h1>
        </div>
        <!-- Body -->
        <div style="padding: 20px; color: #333333;">
          <p style="font-size: 16px;">Hello ${guide.username},</p>
          <p style="font-size: 16px;">We are pleased to announce that you have been appointed as a guide with <strong>WanderSphere</strong>. Your skills and passion for travel will provide our customers with exceptional experiences.</p>
          <p style="font-size: 16px;">If you have any questions or need further assistance, please feel free to reach out:</p>
          <div style="margin-top: 10px; padding: 10px; background-color: #f0f0f0; border-radius: 4px;">
            <p style="margin: 0; font-size: 16px;">
              <strong>Email:</strong> <a href="mailto:support@wandersphere.com" style="color: #4f46e5; text-decoration: none;">support@wandersphere.com</a>
            </p>
            <p style="margin: 0; font-size: 16px;">
              <strong>Phone:</strong> <a href="tel:+1234567890" style="color: #4f46e5; text-decoration: none;">+1 (234) 567-890</a>
            </p>
          </div>
          <p style="font-size: 16px; margin-top: 20px;">Welcome aboard and congratulations once again!</p>
        </div>
        <!-- Footer -->
        <div style="background-color: #f7f7f7; padding: 15px; text-align: center; font-size: 14px; color: #777777; border-radius: 0 0 4px 4px;">
          <p>&copy; ${new Date().getFullYear()} WanderSphere. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};