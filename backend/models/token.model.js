import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["emailVerification", "resetPassword"],
      required: true,
    }
  },
  { timestamps: true }
);

const Token = mongoose.model("Token", tokenSchema);

export default Token;
