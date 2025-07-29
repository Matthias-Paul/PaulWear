import express from "express";
import User from "../models/user.model.js";
import { validationResult, matchedData } from "express-validator";
import generateToken from "../utils/generateToken.js";
import transporter from "../utils/emailTransporter.js";
import ActivityLog from "../models/systemActivity.model.js";
import dotenv from "dotenv";
import bcryptjs from "bcryptjs";

dotenv.config();

export const registerUser = async (req, res, next) => {
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
    const { name, email, password } = matchedData(req);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use.",
      });
    }

    const user = new User({
      name,
      email,
      password,
    });

    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to StyleNest",
      html: `
                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9; padding: 40px 20px;">
                    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
                    <div style="background-color: #111827; padding: 30px; text-align: center;">
                        <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Welcome to StyleNest</h1>
                    </div>
                    <div style="padding: 30px 24px;">
                        <p style="font-size: 16px; color: #333333; margin: 0 0 16px;">Hey ${
                          user?.name || "there"
                        },</p>
                        <p style="font-size: 15px; color: #555555; line-height: 1.6; margin: 0 0 16px;">
                        We're excited to have you in the nest! Your account is all set, and you're now part of a growing community that loves quality, style, and simplicity.
                        </p>
                        <p style="font-size: 15px; color: #555555; line-height: 1.6; margin: 0 0 16px;">
                        Explore curated collections, fresh arrivals, and must-have picks — all at your fingertips.
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                        <a href="https://stylenest-ax2d.onrender.com/login" style="background-color: #111827; color: #ffffff; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-size: 15px; font-weight: 500;">
                            Start Shopping
                        </a>
                        </div>
                        <p style="font-size: 14px; color: #888888; margin-top: 40px;">Thanks for joining us,</p>
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
    await transporter.sendMail(mailOptions);

    const token = await generateToken(user._id, user.role, res);

    await ActivityLog.create({
      user: user._id,
      userRole: user.role || "customer",
      actionType: "user_register",
      description: `User registered with email ${user.email}`,
      status: "success",
    });

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      message: "Signup successful!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const loginUser = async (req, res, next) => {
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
    const { email, password } = matchedData(req);

    let user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials.",
      });
    }
    const token = await generateToken(user._id, user.role, res);

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      message: "Login Successful",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const googleAuth = async (req, res, next) => {
  const { name, email, googleUID } = req.body;

  try {
    const user = await User.findOne({ googleUID });
    if (user) {
      const token = await generateToken(user._id, user.role, res);

      return res.status(200).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        message: "Login Successful",
      });
    } else {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use.",
        });
      }

      const password =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const newUser = new User({
        name: name,
        email,
        password,
        googleUID,
      });

      await newUser.save();
      const token = await generateToken(newUser._id, newUser.role, res);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Welcome to StyleNest",
        html: `
                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9; padding: 40px 20px;">
                    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
                    <div style="background-color: #111827; padding: 30px; text-align: center;">
                        <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Welcome to StyleNest</h1>
                    </div>
                    <div style="padding: 30px 24px;">
                        <p style="font-size: 16px; color: #333333; margin: 0 0 16px;">Hey ${
                          newUser?.name || "there"
                        },</p>
                        <p style="font-size: 15px; color: #555555; line-height: 1.6; margin: 0 0 16px;">
                        We're excited to have you in the nest! Your account is all set, and you're now part of a growing community that loves quality, style, and simplicity.
                        </p>
                        <p style="font-size: 15px; color: #555555; line-height: 1.6; margin: 0 0 16px;">
                        Explore curated collections, fresh arrivals, and must-have picks — all at your fingertips.
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                        <a href="https://stylenest-ax2d.onrender.com" style="background-color: #111827; color: #ffffff; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-size: 15px; font-weight: 500;">
                            Start Shopping
                        </a>
                        </div>
                        <p style="font-size: 14px; color: #888888; margin-top: 40px;">Thanks for joining us,</p>
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
      await transporter.sendMail(mailOptions);

      await ActivityLog.create({
        user: newUser._id,
        userRole: newUser.role || "customer",
        actionType: "user_register",
        description: `User registered with email ${newUser.email}`,
        status: "success",
      });

      return res.status(201).json({
        success: true,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
        },
        message: "Login Successful",
      });
    }
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
    });

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "User log out successfully",
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
