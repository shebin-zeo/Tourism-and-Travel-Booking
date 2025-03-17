import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import Subscription from '../models/subscription.model.js';
dotenv.config();

// Branding configuration – adjust these values as needed.
const BRANDING = {
  logoUrl: process.env.LOGO_URL || "https://res.cloudinary.com/drqoa7h5u/image/upload/v1741946237/brett-patzke-pYeO_rIZ1EM-unsplash_mgvq53.jpg",
  primaryColor: "#2A5C82",
  secondaryColor: "#FFA500",
  defaultBanner: process.env.DEFAULT_BANNER_URL || "https://res.cloudinary.com/drqoa7h5u/image/upload/v1741946237/mantas-hesthaven-_g1WdcKcV3w-unsplash_l4pm2g.jpg",
  contact: {
    email: "wandersphereindia@outlook.com",
    phone: "+91 95678 34271",
    address: "123 Wander Way, Travel City, San Francisco"
  }
};

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// HTML email template
const emailTemplate = (content, bannerUrl) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>Newsletter</title>
  <style>
    body { margin: 0; padding: 0; font-family: Arial, sans-serif; background: #f5f5f5; }
    .container { max-width: 650px; margin: auto; background: #ffffff; border: 1px solid #ddd; }
    .header { background: ${BRANDING.primaryColor}; padding: 20px; display: flex; align-items: center; justify-content: space-between; }
    .header img { max-width: 150px; }
    .header .text { text-align: right; color: #ffffff; }
    .header .text h1 { margin: 0; font-size: 24px; }
    .header .text p { margin: 5px 0 0 0; font-size: 12px; }
    .banner { width: 100%; height: 250px; object-fit: cover; }
    .content { padding: 30px; font-size: 16px; line-height: 1.6; color: #333; }
    .cta-button { display: inline-block; background: ${BRANDING.secondaryColor}; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
    .footer a { color: #666; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${BRANDING.logoUrl}" alt="WanderSphere Logo">
      <div class="text">
        <h1>Exclusive Deals</h1>
        <p>${BRANDING.contact.address}</p>
      </div>
    </div>
    <img src="${bannerUrl}" class="banner" alt="Newsletter Banner">
    <div class="content">
      ${content}
      <div style="text-align: center;">
        <a href="https://wandersphere-c9wn.onrender.com/" class="cta-button">Explore Deals Now</a>
      </div>
    </div>
    <div class="footer">
      <p>Contact us: ${BRANDING.contact.email} | ${BRANDING.contact.phone}</p>
      <p>&copy; ${new Date().getFullYear()} WanderSphere. All rights reserved.</p>
      <p><a href="#">Unsubscribe</a> | <a href="#">View in browser</a></p>
    </div>
  </div>
</body>
</html>
`;

// Controller to send HTML email newsletter (no PDF attachment)
export const sendNewsletterEmails = async (req, res, next) => {
  try {
    const { subject, content, bannerImage } = req.body;
    if (!subject || !content) {
      return res.status(400).json({ message: "Subject and content are required." });
    }
    const bannerUrl = bannerImage || BRANDING.defaultBanner;
    const subscribers = await Subscription.find({}).lean();

    for (const sub of subscribers) {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: sub.email,
        subject,
        html: emailTemplate(content, bannerUrl),
        headers: {
          'X-Priority': '1',
          'Precedence': 'bulk'
        }
      };

      await transporter.sendMail(mailOptions);
    }

    return res.status(200).json({ success: true, message: "Newsletter distributed successfully" });
  } catch (error) {
    next(error);
  }
};
// Only email if pdf need to be attached extra configuration with pdfKit