import mongoose from 'mongoose';

const ASRSResultSchema = new mongoose.Schema({
  patient:    { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  answers:    { type: Map, of: Number, required: true },
  scoreA:     { type: Number, required: true },
  scoreTotal: { type: Number, required: true },
  level:      { type: String, enum: ['low', 'moderate', 'high'], required: true },
}, { timestamps: true });

ASRSResultSchema.index({ patient: 1, createdAt: -1 });

export default mongoose.model('ASRSResult', ASRSResultSchema);