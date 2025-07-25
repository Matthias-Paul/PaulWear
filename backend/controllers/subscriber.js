import { validationResult, matchedData } from "express-validator";
import Subscriber from "../models/subscriber.model.js";
import transporter from "../utils/emailTransporter.js";

export const addSubscriber = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: errors.array()[0].msg,
    });
  }

  try {
    const { email } = matchedData(req);
    const normalizedEmail = email.toLowerCase().trim();

    const existingEmail = await Subscriber.findOne({ email: normalizedEmail });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email is already subscribed",
      });
    }

    const subscriber = new Subscriber({ email: normalizedEmail });
    await subscriber.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: normalizedEmail,
      subject: "You're Now Subscribed to StyleNest!",
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; padding: 40px 20px;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
            <div style="background-color: #111827; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Welcome to StyleNest</h1>
            </div>
            <div style="padding: 30px 24px;">
              <p style="font-size: 16px; color: #333333; margin-bottom: 16px;">Hi there,</p>
              <p style="font-size: 15px; color: #555555; line-height: 1.6; margin-bottom: 16px;">
                Thank you for subscribing to the StyleNest newsletter!
              </p>
              <p style="font-size: 15px; color: #555555; line-height: 1.6; margin-bottom: 16px;">
                You'll now be the first to know about our latest collections, exclusive offers, fashion tips, and exciting updates straight to your inbox.
              </p>
              <p style="font-size: 15px; color: #555555; line-height: 1.6;">
                We're thrilled to have you on board!
              </p>
              <p style="font-size: 14px; color: #888888; margin-top: 40px;">Warm regards,</p>
              <p style="font-size: 14px; color: #888888;"><strong>— The StyleNest Team</strong></p>
            </div>
            <div style="background-color: #f1f1f1; text-align: center; padding: 16px; font-size: 12px; color: #999999;">
              &copy; ${new Date().getFullYear()} StyleNest. All rights reserved.
            </div>
          </div>
        </div>
      `,
    };

    // Send email
    try {
      await transporter.sendMail(mailOptions);
    } catch (emailErr) {
      console.error("Email send failed:", emailErr.message);
    }

    return res.status(201).json({
      success: true,
      message: "Successfully subscribed to the newsletter!",
      subscriber,
    });
  } catch (error) {
    console.error("Subscription error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
