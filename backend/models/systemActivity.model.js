
import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userRole: {
    type: String,
    enum: ['customer', 'vendor', 'admin'],
    required: true,
  },
  actionType: {
    type: String,  
    required: true,
  },
  description: {
    type: String,
  },
  targetType: {
    type: String, // e.g., Product, Order
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId, // ID of the affected resource
  },
  status: {
    type: String,
    enum: ['success', 'failure'],
    default: 'success',
  },
}, { timestamps: true });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;





