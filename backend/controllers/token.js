import express from "express";
import Token from "../models/token.model.js";
import User from "../models/user.model.js";
import { validationResult, matchedData } from "express-validator";
import transporter from "../utils/emailTransporter.js";
import dotenv from "dotenv";
import bcryptjs from "bcryptjs";
import OTPGenerator from "otp-generator";
import ActivityLog from "../models/systemActivity.model.js";

dotenv.config();

export const requestToken = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // If there are validation errors, return the first error message
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: errors.array()[0].msg,
    });
  }

  try {
    const { email } = matchedData(req);

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }

    if (existingUser.googleUID) {
      return res.status(400).json({
        success: false,
        message: "This is a Google account, please log in through Google.",
      });
    }

    const OTP = OTPGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log(OTP);

    const hashedToken = await bcryptjs.hash(OTP, 10);

    let token = await Token.findOne({ user: existingUser._id });

    if (token) {
      (token.token = hashedToken), (token.type = "resetPassword");

      await token.save();
    } else {
      token = await Token.create({
        user: existingUser._id,
        token: hashedToken,
        type: "resetPassword",
      });
    }

    await ActivityLog.create({
      user: existingUser._id,
      userRole: existingUser.role,
      actionType: "reset_password_token_requested",
      description: `Password reset token requested for email: ${email}`,
      status: "success",
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Secure OTP Verification",
      html: `


                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
                    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);">
                    
                    <div style="background-color: #1f2937; padding: 24px; text-align: center;">
                        <h2 style="color: #ffffff; font-size: 22px; margin: 0;">🔐 Password Reset Request</h2>
                    </div>

                    <div style="padding: 30px;">
                        <p style="font-size: 16px; color: #333333; margin-bottom: 16px;">
                        Hello ${existingUser?.name || "there"},
                        </p>
                        <p style="font-size: 15px; color: #4b5563; line-height: 1.6;">
                        You recently requested to reset your password for your StyleNest account. Use the following One-Time Password (OTP) to reset it:        
                        </p>

                        <div style="text-align: center; margin: 30px 0;">
                        <span style="display: inline-block; font-size: 28px; letter-spacing: 10px; color: #111827; font-weight: bold;">
                            ${OTP}
                        </span>
                        </div>

                        <p style="font-size: 15px; color: #4b5563; line-height: 1.6;">
                        <strong>This OTP is valid for 10 minutes.</strong> Do not share this code with anyone.
                        </p>
                        <p style="font-size: 15px; color: #4b5563; line-height: 1.6;" >If you didn't request this, you can safely ignore this email.</p>

                        <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
                        Thank you,<br/>
                        <strong>StyleNest Support Team</strong>
                        </p>
                    </div>

                    <div style="background-color: #f9fafb; text-align: center; padding: 16px; font-size: 12px; color: #9ca3af;">
                        &copy; ${new Date().getFullYear()} StyleNest. All rights reserved.
                    </div>
                    </div>
                </div>
                `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      statusCode: 201,
      success: true,
      message: "OTP sent successfully to your email.",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const verifyAndResetPassword = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: errors.array()[0].msg,
    });
  }

  try {
    const { email, token, password } = matchedData(req);

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }

    const tokenRecord = await Token.findOne({
      user: existingUser._id,
      type: "resetPassword",
    });

    if (!tokenRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    const isMatch = await bcryptjs.compare(String(token), tokenRecord.token);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    const expirationTime = new Date(
      tokenRecord.updatedAt.getTime() + 10 * 60 * 1000
    );
    if (new Date() > expirationTime) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Token has expired.",
      });
    }

    existingUser.password = password;
    await existingUser.save();

    // Delete token
    await Token.deleteOne({ _id: tokenRecord._id });

    await ActivityLog.create({
      user: existingUser._id,
      userRole: existingUser.role,
      actionType: "reset_password_successful",
      description: `User successfully reset password.`,
      status: "success", 
    });

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
};
