import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const ClinicianSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:     { type: String, required: true, minlength: 6 },
  accessCode:   { type: String, required: true, unique: true, uppercase: true },
  organization: { type: String },
  specialty:    { type: String },
  language:     { type: String, default: 'no' },
}, { timestamps: true });

ClinicianSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

ClinicianSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('Clinician', ClinicianSchema);
