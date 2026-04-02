import mongoose from 'mongoose';

const DailyLogSchema = new mongoose.Schema({
  patient:         { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  date:            { type: String, required: true },
  mood:            { type: Number, min: 1, max: 5, required: true },
  focus:           { type: Number, min: 1, max: 5, required: true },
  sleep:           { type: Number, min: 1, max: 5, required: true },
  energy:          { type: Number, min: 1, max: 5, required: true },
  impulsivity:     { type: Number, min: 1, max: 5, required: true },
  tasksCompleted:  { type: Number, min: 0, max: 20, default: 0 },
  screenTimeHours: { type: Number, min: 0, max: 24, default: 0 },
  medicationTaken: { type: Boolean, default: false },
  medicationNames: [{ type: String }],
  medicationDoses: [{ type: String }],
  medicationNotes: { type: String },
  note:            { type: String, maxlength: 1000 },
  triggers:        [{ type: String }],
}, { timestamps: true });

DailyLogSchema.index({ patient: 1, date: 1 }, { unique: true });
DailyLogSchema.index({ patient: 1, createdAt: -1 });

export default mongoose.model('DailyLog', DailyLogSchema);
