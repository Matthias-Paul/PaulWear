import { validationResult, matchedData } from "express-validator";
import User from "../models/user.model.js";
import transporter from "../utils/emailTransporter.js";
import Vendor from "../models/vendors.model.js";



export const getUsers = async(req, res)=>{

    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access.",
            });
        } 

       const allUsers = await User.find({
         _id: { $ne: req.user._id }
       }).select("-password -__v").sort({ createdAt: -1}).skip(skip).limit(limit);; 

       const totalUsers = await User.countDocuments({ _id: { $ne: req.user._id }});
        console.log(totalUsers)
        const hasNextPage = page * limit < totalUsers


        return res.status(200).json({
            success: true,
            allUsers,
            hasNextPage
        });
        


    } catch (error) {
        console.error("get users error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}


export const addUser = async(req, res)=>{
    const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // If there are validation errors, return the first error message
            return res.status(400).json({
                statusCode: 400,
                success: false,  
                message: errors.array()[0].msg 
            }); 
        }

    try {

        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access.",
            });
        } 

        const { name, email, password, role } = matchedData(req)

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
            role: role || "customer"
        })

        await user.save()

            
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your StyleNest Account Has Been Created",
            html: `
                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9; padding: 40px 20px;">
                <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
                    <div style="background-color: #111827; padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Welcome to StyleNest</h1>
                    </div>
                    <div style="padding: 30px 24px;">
                    <p style="font-size: 16px; color: #333333; margin-bottom: 16px;">Hello ${user?.name || "there"},</p>
                    <p style="font-size: 15px; color: #555555; line-height: 1.6; margin-bottom: 16px;">
                        We're excited to let you know that an administrator has created an account for you on <strong>StyleNest</strong>.
                    </p>
                    <p style="font-size: 15px; color: #555555; line-height: 1.6; margin-bottom: 16px;">
                        Your assigned role is: <strong>${user?.role || "user"}</strong>. This role determines the features and access levels available to you on the platform.
                    </p>
                    <p style="font-size: 15px; color: #555555; line-height: 1.6; margin-bottom: 16px;">
                        To get started, simply log in using the email address this message was sent to. If this is your first time, please reset your password via the login page.
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://stylenest-ax2d.onrender.com/login" style="background-color: #111827; color: #ffffff; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-size: 15px; font-weight: 500;">
                        Access Your Account
                        </a>
                    </div>
                    <p style="font-size: 14px; color: #888888; margin-top: 40px;">We look forward to having you onboard,</p>
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
                res.status(201).json({
                success: true,
                user:{
                    name:user.name,
                    email:user.email,
                    role:user.role,  
                    createdAt:user.createdAt,    
                    updatedAt:user.updatedAt  
                },
                message: "User created successfully!",
            });

    } catch (error) {
        console.error( error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}


export const deleteUser= async(req, res)=>{

    const {id} = req.params

    try {
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access.",
            });
        } 

        if(!id){
            return res.status(400).json({
                success: false,
                message: "Id  is required",
            });
        }

        const deletedUser = await User.findByIdAndDelete(id);
            if (!deletedUser) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }


            return res.status(200).json({
                success: true,
                message: "User deleted successfully",
            });

    } catch (error) {
        console.error( error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}



export const validateVendor = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["approved", "rejected"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'approved' or 'rejected'.",
      });
    }

    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found!",
      });
    }

    if (!vendor.email) {
      return res.status(400).json({
        success: false,
        message: "Vendor email not found, cannot send notification.",
      });
    }

    if (status === "approved") {
      vendor.status = "approved";
      vendor.isVerified = true;
      await vendor.save();

       const user = await User.findById(vendor.user);
        if (user) {
            user.role = "vendor";
            await user.save();
        }
      const acceptVendorMailOptions = {
        from: process.env.EMAIL_USER,
        to: vendor.email,
        subject: "Congratulations! Your Vendor Application Has Been Approved",
        html: `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9; padding: 40px 20px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
        <div style="background-color: #111827; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Vendor Application Approved!</h1>
        </div>
        <div style="padding: 30px 24px;">
          <p style="font-size: 16px; color: #333333; margin-bottom: 16px;">Hello ${vendor?.storeName || "there"},</p>
          <p style="font-size: 15px; color: #555555; line-height: 1.6; margin-bottom: 16px;">
            Great news! Your application to become a vendor on <strong>StyleNest</strong> has been approved. Kindly log out from your browser and login again to activate your profile.
          </p>
          <p style="font-size: 15px; color: #555555; line-height: 1.6; margin-bottom: 16px;">
            You can now set up your store, list your products, and start selling to a wide audience across campuses and beyond.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://stylenest-ax2d.onrender.com/vendor" style="background-color: #111827; color: #ffffff; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-size: 15px; font-weight: 500;">
              Go to Vendor Dashboard
            </a>
          </div>
          <p style="font-size: 14px; color: #888888; margin-top: 40px;">Welcome to the StyleNest vendor community!</p>
          <p style="font-size: 14px; color: #888888;"><strong>— The StyleNest Team</strong></p>
        </div>
        <div style="background-color: #f1f1f1; text-align: center; padding: 16px; font-size: 12px; color: #999999;">
          &copy; ${new Date().getFullYear()} StyleNest. All rights reserved.
        </div>
      </div>
    </div>
  `,
      };

      await transporter.sendMail(acceptVendorMailOptions);

    } else if (status === "rejected") {
      const rejectVendorMailOptions = {
        from: process.env.EMAIL_USER,
        to: vendor.email,
        subject: "Update on Your Vendor Application",
            html: `
                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9; padding: 40px 20px;">
                <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
                    <div style="background-color: #111827; padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Vendor Application Update</h1>
                    </div>
                    <div style="padding: 30px 24px;">
                    <p style="font-size: 16px; color: #333333; margin-bottom: 16px;">Hello there,</p>
                    <p style="font-size: 15px; color: #555555; line-height: 1.6; margin-bottom: 16px;">
                        Thank you for applying to become a vendor on <strong>StyleNest</strong>. After careful review, we regret to inform you that your application has not been approved at this time.
                    </p>
                    <p style="font-size: 15px; color: #555555; line-height: 1.6; margin-bottom: 16px;">
                        This could be due to incomplete information, verification issues, or not meeting certain requirements. We encourage you to review your application details and try again in the future.
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://stylenest-ax2d.onrender.com" style="background-color: #111827; color: #ffffff; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-size: 15px; font-weight: 500;">
                        Contact Support
                        </a>
                    </div>
                    <p style="font-size: 14px; color: #888888; margin-top: 40px;">We appreciate your interest in StyleNest and hope to hear from you again.</p>
                    <p style="font-size: 14px; color: #888888;"><strong>— The StyleNest Team</strong></p>
                    </div>
                    <div style="background-color: #f1f1f1; text-align: center; padding: 16px; font-size: 12px; color: #999999;">
                    &copy; ${new Date().getFullYear()} StyleNest. All rights reserved.
                    </div>
                </div>
                </div>
            `,
      };

      await transporter.sendMail(rejectVendorMailOptions);

      await vendor.deleteOne(); // or await vendor.remove();
    }

    return res.status(200).json({
      success: true,
      message: "Vendor status updated successfully.",
    });

  } catch (error) {
    console.error("Error validating vendor:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const  getAllStore =async(req, res)=>{

  try {

       const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    const stores = await Vendor.find({}).populate("user", "name email").sort({ createdAt: -1}).skip(skip).limit(limit);;

    if (!stores || stores.length === 0) {
      return res.status(200).json({
        success: false,
        stores: [],
        message: "No store found!",
      });
    }

        const totalStore = await Vendor.countDocuments({});
        console.log(totalStore)
        const hasNextPage = page * limit < totalStore

    return res.status(200).json({
      success: true,
      stores,
      hasNextPage
    });

  } catch (error) {
    
  }
}