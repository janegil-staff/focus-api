import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const PatientSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  email:       { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:    { type: String, required: true, minlength: 6 },
  dateOfBirth: { type: Date },
  gender:      { type: String, enum: ['male', 'female', 'other', 'prefer_not_to_say'] },
  diagnosis:   { type: String },
  medications: [{ type: String }],
  clinicianCode: { type: String },
  language:    { type: String, default: 'no' },
  timezone:    { type: String, default: 'Europe/Oslo' },
  notificationsEnabled: { type: Boolean, default: true },
}, { timestamps: true });

PatientSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

PatientSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('Patient', PatientSchema);
