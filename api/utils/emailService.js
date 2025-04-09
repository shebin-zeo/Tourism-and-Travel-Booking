import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import PDFDocument from 'pdfkit';
import getStream from 'get-stream';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address
    pass: process.env.GMAIL_APP_PASSWORD, // Your Gmail app password
  },
});

export const sendBookingConfirmation = async (to, booking) => {
  // Separate travellers into Adult (age > 5) and Child (age <= 5)
  const adultTravellers = booking.travellers.filter(
    (traveller) => Number(traveller.age) > 5
  );
  const childTravellers = booking.travellers.filter(
    (traveller) => Number(traveller.age) <= 5
  );

  const adultTravellersList =
    adultTravellers.length > 0
      ? adultTravellers
          .map(
            (traveller) =>
              `<li style="margin-bottom: 5px;"><span style="font-size: 16px; margin-right: 8px;">👤</span>${traveller.name}</li>`
          )
          .join("")
      : "<li>N/A</li>";

  const childTravellersList =
    childTravellers.length > 0
      ? childTravellers
          .map(
            (traveller) =>
              `<li style="margin-bottom: 5px;"><span style="font-size: 16px; margin-right: 8px;">🧒</span>${traveller.name}</li>`
          )
          .join("")
      : "<li>N/A</li>";

  const mailOptions = {
    from: process.env.EMAIL_FROM, // e.g., "WanderSphere <yourgmail@gmail.com>"
    to, // Recipient's email
    subject: "Booking Confirmation",
    text: `Hello,

Your booking (ID: ${booking._id}) for the package "${booking.package.title}" on ${new Date(
      booking.bookingDate
    ).toLocaleDateString()} has been successfully received.

Adult Travellers: ${adultTravellers.map((t) => t.name).join(", ")}
Child Travellers: ${childTravellers.map((t) => t.name).join(", ")}

For any queries, contact us at wandersphereindia@outlook.com or call +91 9567834271.

Thank you for booking with WanderSphere!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 0;">
        <!-- Header -->
        <div style="background-color: #4f46e5; padding: 20px; text-align: center; border-radius: 4px 4px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Booking Confirmation</h1>
        </div>
        <!-- Body -->
        <div style="padding: 20px; color: #333;">
          <p style="font-size: 16px;">Hello,</p>
          <p style="font-size: 16px;">
            Thank you for booking with <strong>WanderSphere</strong>! Your booking has been successfully received and is being processed.
            Below are your booking details:
          </p>
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
              <td style="padding: 8px; border: 1px solid #e0e0e0;">${new Date(
                booking.bookingDate
              ).toLocaleDateString()}</td>
            </tr>
          </table>
          
          <h3 style="font-size: 18px; font-weight: bold; margin-top: 20px;">Adult Travellers:</h3>
          <ul style="list-style: none; padding: 0;">
            ${adultTravellersList}
          </ul>
          
          <h3 style="font-size: 18px; font-weight: bold; margin-top: 20px;">Child Travellers (Age 5 and below):</h3>
          <ul style="list-style: none; padding: 0;">
            ${childTravellersList}
          </ul>
          
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
        <div style="background-color: #f7f7f7; padding: 15px; text-align: center; font-size: 14px; color: #777; border-radius: 0 0 4px 4px;">
          <p>&copy; ${new Date().getFullYear()} WanderSphere. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  // Send the email with proper error handling.
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending confirmation email:", error);
        return reject(error);
      }
      resolve(info);
    });
  });
};

//Sent email for guide appointment
export const sendGuideAppointmentEmail = async (guide) => {
  try {
    // Generate the PDF document in memory using PDFKit
    const doc = new PDFDocument({ margin: 50 });
    // Accumulate the PDF data in an array
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    
    // When the PDF is finalized, get the Buffer and send the email
    doc.on('end', async () => {
      const pdfData = Buffer.concat(buffers);

      const mailOptions = {
        from: process.env.EMAIL_FROM,  // e.g., "WanderSphere <yourgmail@gmail.com>"
        to: guide.email,
        subject: 'Congratulations on Your Appointment as Guide!',
        text: `Hello ${guide.username},

Congratulations! You have been appointed as a guide with WanderSphere. Please find attached your appointment letter.

If you have any questions, please contact our support team at support@wandersphere.com or call +1 (234) 567-890.

Best regards,
WanderSphere Team`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
            <h1 style="text-align: center; color: #4f46e5;">Congratulations, ${guide.username}!</h1>
            <p>We are excited to announce your appointment as a guide with <strong>WanderSphere</strong>.</p>
            <p>Please find your appointment letter attached in PDF format.</p>
            <p>If you have any questions, contact us at 
              <a href="mailto:support@wandersphere.com" style="color: #4f46e5; text-decoration: none;">support@wandersphere.com</a> 
              or call <a href="tel:+1234567890" style="color: #4f46e5; text-decoration: none;">+1 (234) 567-890</a>.
            </p>
            <p>Best regards,<br/>WanderSphere Team</p>
          </div>
        `,
        attachments: [
          {
            filename: "GuideAppointmentLetter.pdf",
            content: pdfData,
          },
        ],
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending appointment email:", error);
        } else {
          console.log("Appointment email sent:", info.response);
        }
      });
    });

    // Build the PDF content
    // Header
    doc
      .fillColor("#4f46e5")
      .fontSize(20)
      .text("Guide Appointment Letter", { align: "center" })
      .moveDown();

    // Body content
    doc
      .fontSize(12)
      .fillColor("#000")
      .text(`Hello ${guide.username},`)
      .moveDown()
      .text(
        "Congratulations! We are delighted to inform you that you have been appointed as a guide with WanderSphere. Your skills and passion for travel have impressed us, and we believe you will provide our customers with exceptional experiences.",
        { align: "justify" }
      )
      .moveDown()
      .text("Appointment Details:", { underline: true })
      .moveDown(0.5)
      .text("Position: Guide")
      .text(`Start Date: ${new Date().toLocaleDateString()}`)
      .text("Reporting Manager: Jane Smith ")
      .moveDown()
      .text(
        "If you have any questions, please feel free to reach out to our support team.",
        { align: "justify" }
      )
      .moveDown()
      .text("Best regards,")
      .text("WanderSphere Team");

    // Footer
    doc
      .moveDown(2)
      .fontSize(10)
      .fillColor("#777")
      .text(`© ${new Date().getFullYear()} WanderSphere. All rights reserved.`, { align: "center" });

    // Finalize PDF file
    doc.end();
  } catch (err) {
    console.error("Error generating guide appointment PDF:", err);
    throw err;
  }
};

//send email for admin cancell booking
export const sendBookingCancellation  = async (to, booking) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM, // e.g., "WanderSphere <yourgmail@gmail.com>"
    to, // Recipient's email
    subject: "Booking Cancellation Notice",
    text: `Hello,

Your booking (ID: ${booking._id}) for the package "${booking.package.title}" has been cancelled by our admin.
We apologize for the inconvenience caused. Your refund will be processed shortly.

Thank you for choosing WanderSphere.
`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 0;">
        <!-- Header -->
        <div style="background-color: #f44336; padding: 20px; text-align: center; border-radius: 4px 4px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Booking Cancellation Notice</h1>
        </div>
        <!-- Body -->
        <div style="padding: 20px; color: #333;">
          <p style="font-size: 16px;">Hello,</p>
          <p style="font-size: 16px;">
            We regret to inform you that your booking (ID: ${booking._id}) for the package "${booking.package.title}" has been cancelled by our admin.
            We apologize for any inconvenience caused. Your refund will be initiated shortly.
          </p>
          <p style="font-size: 16px;">Thank you for choosing WanderSphere.</p>
        </div>
        <!-- Footer -->
        <div style="background-color: #f7f7f7; padding: 15px; text-align: center; font-size: 14px; color: #777; border-radius: 0 0 4px 4px;">
          <p>&copy; ${new Date().getFullYear()} WanderSphere. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending cancellation email:", error);
        return reject(error);
      }
      resolve(info);
    });
  });
};