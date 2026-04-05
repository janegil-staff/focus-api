import mongoose from "mongoose";

const shareCodeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, index: true },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    expiresAt: { type: Date, required: true },
    includeNotes: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Auto-delete expired codes
shareCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("ShareCode", shareCodeSchema);
