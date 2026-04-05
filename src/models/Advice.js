import mongoose from "mongoose";

const adviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Focus & Attention",
        "Sleep",
        "Medication",
        "Emotional Regulation",
        "Organisation",
      ],
    },
    icon: {
      type: String,
      default: "bulb-outline",
    },
    iconColor: {
      type: String,
      default: "#4a7ab5",
    },
    // Tags used to match advice against user log data
    // e.g. ["focus", "sleep", "adhd", "mood", "medication", "impulsivity"]
    tags: [{ type: String }],

    // Which user metric being low/high should surface this advice
    // e.g. { focus: "low", sleep: "low" } → show when avg focus < 3 or avg sleep < 3
    triggerWhen: {
      mood: { type: String, enum: ["low", "high", null], default: null },
      focus: { type: String, enum: ["low", "high", null], default: null },
      sleep: { type: String, enum: ["low", "high", null], default: null },
      energy: { type: String, enum: ["low", "high", null], default: null },
      impulsivity: { type: String, enum: ["low", "high", null], default: null },
    },

    active: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

adviceSchema.index({ tags: 1 });
adviceSchema.index({ category: 1 });
adviceSchema.index({ active: 1 });

export default mongoose.model('Advice', adviceSchema);
