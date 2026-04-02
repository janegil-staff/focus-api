import mongoose from 'mongoose';

const MedicationSchema = new mongoose.Schema({
  patient:      { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  name:         { type: String, required: true, trim: true },
  dosage:       { type: String, required: true },
  frequency:    { type: String, enum: ['daily', 'twice_daily', 'three_times_daily', 'weekly', 'as_needed'], default: 'daily' },
  timeOfDay:    [{ type: String, enum: ['morning', 'afternoon', 'evening', 'night'] }],
  startDate:    { type: String, required: true },
  endDate:      { type: String },
  prescribedBy: { type: String },
  notes:        { type: String },
  active:       { type: Boolean, default: true },
}, { timestamps: true });

MedicationSchema.index({ patient: 1, active: 1 });

export default mongoose.model('Medication', MedicationSchema);
