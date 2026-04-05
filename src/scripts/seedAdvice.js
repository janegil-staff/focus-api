/**
 * Seed script — run once to populate the advice collection.
 *
 *   node scripts/seedAdvice.js
 *
 * Set MONGODB_URI in your .env or pass it as an env var.
 */
import dotenv from "dotenv";
import mongoose from "mongoose";
import Advice from "../models/Advice.js";
dotenv.config();


const ADVICE_SEED = [
  // ── Focus & Attention ────────────────────────────────────────────────────────
  {
    order: 1,
    category: "Focus & Attention",
    icon: "barbell", iconColor: "#4a7ab5",
    tags: ["focus", "adhd"],
    triggerWhen: { focus: "low" },
    title: "Short bursts of exercise can significantly improve focus",
    body: "Research shows that even 20 minutes of aerobic exercise can boost dopamine and norepinephrine levels — the same neurotransmitters targeted by ADHD medication. Try a brisk walk or jumping jacks before tasks that require concentration.\n\nThis effect can last 1–2 hours after exercise.",
  },
  {
    order: 2,
    category: "Focus & Attention",
    icon: "timer", iconColor: "#4a7ab5",
    tags: ["focus", "impulsivity"],
    triggerWhen: { focus: "low", impulsivity: "high" },
    title: "Breaking tasks into 10-minute chunks makes them easier to start",
    body: "ADHD brains often struggle with task initiation, not the task itself. The Pomodoro Technique — 10–25 minute focused blocks with short breaks — works especially well. Set a visible timer and commit only to the block, not the whole task.\n\nStarting is the hardest part. Once you begin, momentum often carries you forward.",
  },
  {
    order: 3,
    category: "Focus & Attention",
    icon: "musical-notes", iconColor: "#4a7ab5",
    tags: ["focus"],
    triggerWhen: { focus: "low" },
    title: "Background noise — like white noise or lo-fi music — can help ADHD focus",
    body: "Silence can actually be more distracting for some people with ADHD. The brain seeks stimulation, and low-level background noise provides just enough input to prevent it from wandering.\n\nExperiment with white noise, brown noise, or lo-fi music playlists. Apps like Brain.fm are designed specifically for focus.",
  },

  // ── Sleep ────────────────────────────────────────────────────────────────────
  {
    order: 4,
    category: "Sleep",
    icon: "moon", iconColor: "#7AABDB",
    tags: ["sleep", "adhd"],
    triggerWhen: { sleep: "low" },
    title: "Irregular sleep is both a symptom and a trigger of ADHD symptoms",
    body: "ADHD is strongly linked to delayed sleep phase syndrome — a tendency to feel alert late at night and struggle to wake in the morning. Poor sleep makes attention, memory, and impulse control significantly worse.\n\nTips that help:\n• Keep wake times consistent, even on weekends\n• Avoid screens 1 hour before bed\n• Keep the bedroom cool and dark\n• Consider melatonin (consult your doctor first)",
  },
  {
    order: 5,
    category: "Sleep",
    icon: "medical", iconColor: "#7AABDB",
    tags: ["sleep", "medication"],
    triggerWhen: { sleep: "low" },
    title: "Stimulant medication timing can directly affect your sleep quality",
    body: "Taking ADHD medication too late in the day is a common reason for sleep difficulties. The half-life of common stimulants means a dose at 2 PM can still be active at midnight.\n\nDiscuss with your doctor whether an earlier dosing schedule or a shorter-acting formulation could improve your sleep without reducing daytime effectiveness.",
  },

  // ── Medication ───────────────────────────────────────────────────────────────
  {
    order: 6,
    category: "Medication",
    icon: "fitness", iconColor: "#22C55E",
    tags: ["medication", "adhd"],
    triggerWhen: {},
    title: "ADHD medication works best when combined with behavioural strategies",
    body: "Medication reduces symptoms, but habits and structure have to be built intentionally. People with ADHD who use both medication and cognitive-behavioural strategies report better long-term outcomes than those using medication alone.\n\nUse the symptom-free windows your medication creates to build routines, practice focus techniques, and reduce clutter.",
  },
  {
    order: 7,
    category: "Medication",
    icon: "restaurant", iconColor: "#22C55E",
    tags: ["medication"],
    triggerWhen: { energy: "low" },
    title: "Appetite loss from stimulants can be managed with strategic meal timing",
    body: "Many stimulant medications suppress appetite, which can lead to skipping meals and energy crashes in the evening. A common strategy is to eat a protein-rich breakfast before taking medication, then a lighter lunch, with a larger meal in the evening when appetite returns.\n\nTalk to your doctor if appetite suppression is significantly affecting your nutrition or weight.",
  },

  // ── Emotional Regulation ─────────────────────────────────────────────────────
  {
    order: 8,
    category: "Emotional Regulation",
    icon: "heart", iconColor: "#EF4444",
    tags: ["impulsivity", "mood"],
    triggerWhen: { impulsivity: "high", mood: "low" },
    title: "Emotional dysregulation is one of the most impairing but least-discussed aspects of ADHD",
    body: "Up to 70% of people with ADHD experience intense emotional reactions — frustration, impatience, or excitement — that can feel overwhelming and difficult to control. This is sometimes called Rejection Sensitive Dysphoria (RSD).\n\nStrategies that help:\n• Pause before responding in emotionally charged situations\n• Name the emotion aloud or in writing\n• Physical movement to discharge emotional energy\n• Therapy focused on emotion regulation (DBT or CBT)",
  },
  {
    order: 9,
    category: "Emotional Regulation",
    icon: "people", iconColor: "#EF4444",
    tags: ["mood", "adhd"],
    triggerWhen: { mood: "low" },
    title: "Rejection sensitivity in ADHD can affect relationships and work performance significantly",
    body: "People with ADHD are often wired to be more sensitive to perceived criticism or rejection, even in neutral situations. This can lead to avoiding feedback, people-pleasing, or overreacting to small comments.\n\nRecognising this pattern is the first step. Cognitive reframing — asking 'Is this reaction proportionate to what actually happened?' — can interrupt automatic emotional responses over time.",
  },

  // ── Organisation ─────────────────────────────────────────────────────────────
  {
    order: 10,
    category: "Organisation",
    icon: "list", iconColor: "#FBBF24",
    tags: ["focus", "adhd"],
    triggerWhen: { focus: "low" },
    title: "Externalising your memory — writing everything down — is one of the most effective ADHD strategies",
    body: "Working memory is often impaired in ADHD, meaning thoughts and tasks disappear quickly. Rather than trying to hold things in your head, build a system that holds them for you.\n\nEffective approaches:\n• A single notebook or app for all tasks (pick one and stick to it)\n• A visible, physical calendar — not just a digital one\n• End-of-day review to capture loose ends\n• Morning alarm with your top 3 priorities",
  },
  {
    order: 11,
    category: "Organisation",
    icon: "people-circle", iconColor: "#FBBF24",
    tags: ["focus", "adhd"],
    triggerWhen: { focus: "low" },
    title: "'Body doubling' — working alongside another person — can dramatically improve productivity",
    body: "Body doubling means having another person present while you work — they don't need to help or even interact. Their presence provides external structure that the ADHD brain responds to.\n\nThis can be:\n• A friend working at the same table\n• A video call with a colleague\n• Online body doubling communities (FocusMate, for example)\n• Even background video of other people working",
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  const existing = await Advice.countDocuments();
  if (existing > 0) {
    console.log(`Advice collection already has ${existing} documents — skipping seed.`);
    console.log("Delete them manually or run with --force to reseed.");
    if (!process.argv.includes("--force")) {
      await mongoose.disconnect();
      return;
    }
    await Advice.deleteMany({});
    console.log("Cleared existing advice.");
  }

  const inserted = await Advice.insertMany(ADVICE_SEED);
  console.log(`✓ Seeded ${inserted.length} advice items.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
