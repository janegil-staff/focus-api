import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  patient:         { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, unique: true },
  pushToken:       { type: String },
  reminderTime:    { type: String, default: '20:00' },
  reminderEnabled: { type: Boolean, default: true },
  reminderDays:    { type: [Number], default: [0, 1, 2, 3, 4, 5, 6] },
}, { timestamps: true });

export default mongoose.model('Notification', NotificationSchema);
