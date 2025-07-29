import { validationResult, matchedData } from "express-validator";
import User from "../models/user.model.js";
import transporter from "../utils/emailTransporter.js";
import Vendor from "../models/vendors.model.js";
import DeletedOrder from "../models/deletedOrders.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import VendorAccount from "../models/vendorAccount.model.js";
import VendorPayout from "../models/vendorPayout.model.js";
import ActivityLog from "../models/systemActivity.model.js";
import moment from "moment";
import Transaction from "../models/transaction.model.js";
import { triggerPayout } from "../utils/triggerPaystackPayout.js";

export const getUsers = async (req, res) => {
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
      _id: { $ne: req.user._id },
    })
      .select("-password -__v")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments({
      _id: { $ne: req.user._id },
    });
    console.log(totalUsers);
    const hasNextPage = page * limit < totalUsers;

    return res.status(200).json({
      success: true,
      allUsers,
      hasNextPage,
    });
  } catch (error) {
    console.error("get users error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const addUser = async (req, res) => {
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
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    const { name, email, password, role } = matchedData(req);

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
      role: role || "customer",
    });

    await user.save();

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
                    <p style="font-size: 16px; color: #333333; margin-bottom: 16px;">Hello ${
                      user?.name || "there"
                    },</p>
                    <p style="font-size: 15px; color: #555555; line-height: 1.6; margin-bottom: 16px;">
                        We're excited to let you know that an administrator has created an account for you on <strong>StyleNest</strong>.
                    </p>
                    <p style="font-size: 15px; color: #555555; line-height: 1.6; margin-bottom: 16px;">
                        Your assigned role is: <strong>${
                          user?.role || "user"
                        }</strong>. This role determines the features and access levels available to you on the platform.
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
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      message: "User created successfully!",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    if (!id) {
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
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

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

      await ActivityLog.create({
        user: req.user._id,
        userRole: req.user.role,
        actionType: `vendor_${status}`,
        description: `Admin ${status} vendor application for store "${vendor.storeName}".`,
        status: "success",
      });

      const acceptVendorMailOptions = {
        from: process.env.EMAIL_USER,
        to: vendor.email,
        subject: "You're Approved! Welcome to StyleNest as a Vendor",
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
              
              <!-- Header -->
              <div style="background-color: #111827; padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Vendor Application Approved</h1>
              </div>
              
              <!-- Body -->
              <div style="padding: 30px 24px;">
                <p style="font-size: 16px; color: #333333; margin-bottom: 16px;">
                  Hello ${vendor?.storeName || "there"},
                </p>
        
                <p style="font-size: 15px; color: #555555; line-height: 1.6; margin-bottom: 16px;">
                  Congratulations! Your request to become a vendor on <strong>StyleNest</strong> has been approved. We're excited to have you join our growing community of campus and city-wide sellers.
                </p>
        
                <p style="font-size: 15px; color: #555555; line-height: 1.6; margin-bottom: 16px;">
                  To activate your vendor dashboard, please log out of your current session and log in again. This refresh allows our system to grant you full access to vendor features.
                </p>
        
                <p style="font-size: 15px; color: #555555; line-height: 1.6; margin-bottom: 16px;">
                  Once logged in, you can begin setting up your store, adding products, and managing your sales directly from your dashboard.
                </p>
        
                <p style="font-size: 14px; color: #888888; margin-top: 40px;">
                  If you have any questions or need help setting up, feel free to contact our support team.
                </p>
        
                <p style="font-size: 14px; color: #888888;"><strong>— The StyleNest Team</strong></p>
              </div>
        
              <!-- Footer -->
              <div style="background-color: #f1f1f1; text-align: center; padding: 16px; font-size: 12px; color: #999999;">
                &copy; ${new Date().getFullYear()} StyleNest. All rights reserved.
              </div>
            </div>
          </div>
          `,
      };

      await transporter.sendMail(acceptVendorMailOptions);
    } else if (status === "rejected") {
      await ActivityLog.create({
        user: req.user._id,
        userRole: req.user.role,
        actionType: `vendor_${status}`,
        description: `Admin ${status} vendor application for store "${vendor.storeName}".`,
        status: "success",
      });

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

export const getAllStore = async (req, res) => {
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

    const stores = await Vendor.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (!stores || stores.length === 0) {
      return res.status(200).json({
        success: false,
        stores: [],
        message: "No store found!",
      });
    }

    const totalStore = await Vendor.countDocuments({});
    console.log(totalStore);
    const hasNextPage = page * limit < totalStore;

    return res.status(200).json({
      success: true,
      stores,
      hasNextPage,
    });
  } catch (error) {
    console.error("Error :", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteOrderByAdmin = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    const adminId = req.user._id;

    const { orderId } = req.params;

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (order.isCanceled) {
      return res
        .status(404)
        .json({ success: false, message: "Order has already been cancel" });
    }
    if (!order.cancelRequested) {
      return res.status(404).json({
        success: false,
        message: "Order has not been requested to be cancel",
      });
    }
    if (order.isPayoutSuccess) {
      return res.status(404).json({
        success: false,
        message: "Payment has already been made to the vendor",
      });
    }
    if (order.isReceived) {
      return res.status(404).json({
        success: false,
        message:
          "This order has already been received. Deletion is not allowed.",
      });
    }

    order.isCanceled = true;

    await order.save();

    await ActivityLog.create({
      user: req.user._id,
      userRole: "admin",
      actionType: "order_cancellation_approved",
      description: `Admin approved cancellation for order #${order._id} by deleting the order`,
      status: "success",
    });

    // Archive it before deletion
    const archivedOrder = new DeletedOrder({
      user: order.user,
      vendor: order.vendor,
      orderId: order._id,
      orderGroupId: order.orderGroupId,
      orderItems: order.orderItems,
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      reference: order.reference,
      totalPrice: order.totalPrice,
      buyerPhoneNumber: order.buyerPhoneNumber,
      buyerName: order.buyerName,
      isPaid: order.isPaid,
      paidAt: order.paidAt,
      isDelivered: order.isDelivered,
      deliveredAt: order.deliveredAt,
      isPayoutSuccess: order.isPayoutSuccess,
      isPayoutDate: order.isPayoutDate,
      isReceived: order.isReceived,
      receivedAt: order.receivedAt,
      paymentStatus: order.paymentStatus,
      status: order.status,
      isCanceled: order.isCanceled,
      cancelRequested: order.cancelRequested,
      cancelReason: order.cancelReason,
      deletedBy: adminId,
      deletedAt: new Date(),
    });

    await archivedOrder.save();

    const vendorAccount = await VendorAccount.findOne({ vendor: order.vendor });
    if (!vendorAccount) {
      return res.status(404).json({
        success: false,
        message: `VendorAccount not found for vendor ID: ${order.vendor}`,
      });
    }

    const total = order.totalPrice || 0;
    const fee = Math.round(total * 0.03);
    const payoutAmount = total - fee;

    // Ensure no negative balances
    if (payoutAmount < 0) {
      return res.status(404).json({
        success: false,
        message: `Payout amount is negative for vendor ${order.vendor}, skipping.`,
      });
    }

    vendorAccount.pendingBalance = Math.max(
      0,
      vendorAccount.pendingBalance - payoutAmount
    );

    await vendorAccount.save();

    await Order.findByIdAndDelete(orderId);

    return res.status(200).json({
      success: true,
      message: "Order deleted and archived successfully",
    });
  } catch (error) {
    console.error("Admin delete order error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error. Please try again." });
  }
};

export const getStats = async (req, res) => {
  try {
    const getAggregateTotal = async (model, field) => {
      const result = await model.aggregate([
        { $group: { _id: null, total: { $sum: `$${field}` } } },
      ]);
      return result[0]?.total || 0;
    };

    const [
      totalRevenue,
      totalPlatformFee,
      totalPayout,
      totalPendingBalance,
      totalProducts,
      totalUsers,
      totalOrders,
      totalVendors,
      totalNoTransactions,
    ] = await Promise.all([
      getAggregateTotal(Order, "totalPrice"),
      getAggregateTotal(VendorPayout, "feeDeducted"),
      getAggregateTotal(VendorPayout, "payoutAmount"),
      getAggregateTotal(VendorAccount, "pendingBalance"),
      Product.countDocuments({ isPublished: true }),
      User.countDocuments(),
      Order.countDocuments({ isPaid: true }),
      Vendor.countDocuments({ status: "approved" }),
      Transaction.countDocuments({ status: "paid" }),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalPlatformFee: Number(totalPlatformFee.toFixed(2)),
        totalPayout: Number(totalPayout.toFixed(2)),
        totalPendingBalance: Number(totalPendingBalance.toFixed(2)),
        totalProducts,
        totalUsers,
        totalOrders,
        totalVendors,
        totalNoTransactions,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getChart = async (req, res) => {
  try {
    const today = moment().startOf("day");
    const weekBuckets = [];

    for (let i = 0; i < 4; i++) {
      const start = moment(today)
        .subtract(i, "weeks")
        .startOf("isoWeek")
        .toDate();
      const end = moment(today).subtract(i, "weeks").endOf("isoWeek").toDate();
      const label = i === 0 ? "This W" : i === 1 ? "Last W" : `${i} W ago`;

      weekBuckets.push({ label, start, end });
    }

    // Run all count queries in parallel
    const countPromises = weekBuckets.map((bucket) =>
      Order.countDocuments({
        createdAt: { $gte: bucket.start, $lte: bucket.end },
      })
    );

    const counts = await Promise.all(countPromises);

    const chartStat = weekBuckets.map((bucket, i) => ({
      week: bucket.label,
      orders: counts[i],
    }));

    return res.status(200).json({
      success: true,
      chartStat,
    });
  } catch (error) {
    console.error("Error generating chart:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getRecentActivities = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Fetch activities and count in parallel
    const [recentActivities, totalActivitiesForLast24Hrs] = await Promise.all([
      ActivityLog.find({ createdAt: { $gte: twentyFourHoursAgo } })
        .populate("user", "name email role ")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ActivityLog.countDocuments({ createdAt: { $gte: twentyFourHoursAgo } }),
    ]);

    if (recentActivities.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No recent activities found",
        recentActivities: [],
        hasNextPage: false,
      });
    }

    const hasNextPage = page * limit < totalActivitiesForLast24Hrs;

    return res.status(200).json({
      success: true,
      recentActivities,
      hasNextPage,
      total: totalActivitiesForLast24Hrs,
    });
  } catch (error) {
    console.error("Error fetching recent activities:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getPayoutHistory = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { search, filter } = req.query;

    const matchStage = {};

    // Filter by status
    if (filter && filter.toLowerCase() !== "all") {
      matchStage.status = filter;
    }

    // Build aggregation pipeline
    const pipeline = [
      {
        $lookup: {
          from: "vendors", // The collection name of the Vendor model
          localField: "vendor",
          foreignField: "_id",
          as: "vendor",
        },
      },
      { $unwind: "$vendor" },
      {
        $addFields: {
          orderIdString: { $toString: "$order" },
        },
      },
    ];

    // Search by order, reason, or vendor.storeName
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { orderIdString: { $regex: search, $options: "i" } },
            { reason: { $regex: search, $options: "i" } },
            { "vendor.storeName": { $regex: search, $options: "i" } },
          ],
          ...matchStage,
        },
      });
    } else {
      pipeline.push({ $match: matchStage });
    }

    // Sort, skip, and limit
    pipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    );

    // Fetch payout history
    const payoutHistory = await VendorPayout.aggregate(pipeline);

    // Get total count (for pagination)
    const countPipeline = pipeline.filter(
      (stage) => !("$skip" in stage || "$limit" in stage)
    );
    countPipeline.push({ $count: "total" });

    const totalResult = await VendorPayout.aggregate(countPipeline);
    const totalPayouts = totalResult.length > 0 ? totalResult[0].total : 0;
    const hasNextPage = page * limit < totalPayouts;

    return res.status(200).json({
      success: true,
      payoutHistory,
      hasNextPage,
    });
  } catch (error) {
    console.error("Error fetching payout history:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getVendors = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { search, filter } = req.query;

    const filterQuery = {};

    if (filter && filter.toLowerCase() !== "all") {
      filterQuery.status = filter.toLowerCase();
    }

    if (search) {
      // If search looks like ObjectId, search by _id
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(search);
      if (isObjectId) {
        filterQuery.$or = [{ _id: search }, { user: search }];
      } else {
        filterQuery.$or = [
          { storeName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { contactNumber: { $regex: search, $options: "i" } },
        ];
      }
    }

    const vendors = await Vendor.find(filterQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name ");

    const totalVendors = await Vendor.countDocuments(filterQuery);
    const hasNextPage = page * limit < totalVendors;

    return res.status(200).json({
      success: true,
      vendors,
      hasNextPage,
    });
  } catch (error) {
    console.error("Error fetching vendors:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const {
      search,
      isDelivered,
      isReceived,
      isPayoutSuccess,
      cancelRequested,
    } = req.query;

    // Build filter query
    const filterQuery = {};
    if (isDelivered === "true") filterQuery.isDelivered = true;
    if (isReceived === "true") filterQuery.isReceived = true;
    if (isPayoutSuccess === "true") filterQuery.isPayoutSuccess = true;
    if (cancelRequested === "true") filterQuery.cancelRequested = true;

    const pipeline = [
      {
        $lookup: {
          from: "vendors",
          localField: "vendor",
          foreignField: "_id",
          as: "vendor",
        },
      },
      { $unwind: "$vendor" },
      {
        $addFields: {
          orderIdString: { $toString: "$_id" },
          userIdString: { $toString: "$user" },
          vendorIdString: { $toString: "$vendor._id" },
        },
      },
    ];

    const matchStage = { ...filterQuery };

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { orderIdString: { $regex: search, $options: "i" } },
            { userIdString: { $regex: search, $options: "i" } },
            { vendorIdString: { $regex: search, $options: "i" } },
            { buyerName: { $regex: search, $options: "i" } },
            { "vendor.storeName": { $regex: search, $options: "i" } },
          ],
          ...matchStage,
        },
      });
    } else {
      pipeline.push({ $match: matchStage });
    }

    // Pagination and sorting
    pipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    );

    // Fetch orders
    const orders = await Order.aggregate(pipeline);

    // Count total for pagination
    const countPipeline = pipeline.filter(
      (stage) => !("$skip" in stage || "$limit" in stage)
    );
    countPipeline.push({ $count: "total" });

    const totalResult = await Order.aggregate(countPipeline);
    const totalOrders = totalResult.length > 0 ? totalResult[0].total : 0;
    const hasNextPage = page * limit < totalOrders;

    return res.status(200).json({
      success: true,
      orders,
      hasNextPage,
    });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const markOrderAsReceived = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Admin access required.",
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (order.isReceived) {
      return res.status(409).json({
        success: false,
        message: "Order has already been marked as received.",
      });
    }

    if (order.isCanceled) {
      return res.status(409).json({
        success: false,
        message: "This order was cancelled and cannot be marked as received.",
      });
    }

    // Mark as received
    order.isReceived = true;
    order.receivedAt = new Date();
    order.cancelRequested = false;
    order.cancelReason = "";

    await order.save();

    // Trigger payout if it was already delivered
    const isDeliveredProperly =
      order.isDelivered && order.deliveredAt && order.status === "delivered";
    if (isDeliveredProperly) {
      await triggerPayout(order);
    }

    // Log the action
    await ActivityLog.create({
      user: req.user._id,
      userRole: req.user.role || "admin",
      actionType: "order_received",
      description: `Admin confirmed receipt of order #${order._id} (Total: ₦${order.totalPrice}).`,
      status: "success",
    });

    return res.status(200).json({
      success: true,
      message: "Order marked as received.",
    });
  } catch (error) {
    console.error("Error marking order as received:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const getDeletedOrders = async (req, res) => {
  try {
    const { search } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const pipeline = [
      {
        $lookup: {
          from: "vendors",
          localField: "vendor",
          foreignField: "_id",
          as: "vendor",
        },
      },
      { $unwind: "$vendor" },
      {
        $addFields: {
          orderIdString: { $toString: "$_id" },
          userIdString: { $toString: "$user" },
          vendorIdString: { $toString: "$vendor._id" },
        },
      },
    ];

    const matchStage = {};

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { orderIdString: { $regex: search, $options: "i" } },
            { userIdString: { $regex: search, $options: "i" } },
            { vendorIdString: { $regex: search, $options: "i" } },
            { buyerName: { $regex: search, $options: "i" } },
            { "vendor.storeName": { $regex: search, $options: "i" } },
          ],
          ...matchStage,
        },
      });
    } else {
      pipeline.push({ $match: matchStage });
    }

    pipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    );

    const deletedOrders = await DeletedOrder.aggregate(pipeline);

    // Count total
    const countPipeline = [...pipeline].filter(
      (stage) => !("$skip" in stage || "$limit" in stage)
    );
    countPipeline.push({ $count: "total" });

    const totalResult = await DeletedOrder.aggregate(countPipeline);
    const totalOrders = totalResult.length > 0 ? totalResult[0].total : 0;
    const hasNextPage = page * limit < totalOrders;

    return res.status(200).json({
      success: true,
      deletedOrders,
      hasNextPage,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const orderDetails = await DeletedOrder.findById(id).populate([
      { path: "user", select: "name email" },
      { path: "vendor", select: " email storeName contactNumber " },
      { path: "deletedBy", select: "name email role" },
    ]);
    if (!orderDetails) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    return res.status(200).json({
      success: true,
      orderDetails,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getVendorsAccount = async (req, res) => {
  try {
    const { search } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const pipeline = [
      {
        $lookup: {
          from: "vendors",
          localField: "vendor",
          foreignField: "_id",
          as: "vendor",
        },
      },
      { $unwind: "$vendor" },
      {
        $addFields: {
          userIdString: { $toString: "$user" },
          vendorIdString: { $toString: "$vendor._id" },
        },
      },
    ];

    const matchStage = {};

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { userIdString: { $regex: search, $options: "i" } },
            { vendorIdString: { $regex: search, $options: "i" } },
            { bankName: { $regex: search, $options: "i" } },
            { accountName: { $regex: search, $options: "i" } },
            { recipientCode: { $regex: search, $options: "i" } },
            { "vendor.storeName": { $regex: search, $options: "i" } },
          ],
          ...matchStage,
        },
      });
    } else {
      pipeline.push({ $match: matchStage });
    }

    pipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    );

    const vendorsAccount = await VendorAccount.aggregate(pipeline);

    // Count total
    const countPipeline = [...pipeline].filter(
      (stage) => !("$skip" in stage || "$limit" in stage)
    );
    countPipeline.push({ $count: "total" });

    const totalResult = await VendorAccount.aggregate(countPipeline);
    const totalVendorAccount =
      totalResult.length > 0 ? totalResult[0].total : 0;
    const hasNextPage = page * limit < totalVendorAccount;

    return res.status(200).json({
      success: true,
      vendorsAccount,
      hasNextPage,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
