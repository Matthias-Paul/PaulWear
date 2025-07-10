import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateToken = async (userId, role, res)=> {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  }

  const userToken = jwt.sign({ userId, role }, secret);

  res.cookie("token", userToken, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 365 * 100 // 100 years in milliseconds

  });            



  return userToken;   
};

export default generateToken;