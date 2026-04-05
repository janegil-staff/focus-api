import Advice  from "../models/Advice.js";
import Patient from "../models/Patient.js";

const METRICS        = ["mood", "focus", "sleep", "energy", "impulsivity"];
const LOW_THRESHOLD  = 2.5;
const HIGH_THRESHOLD = 3.5;

function computeAverages(records) {
  if (!records.length) return {};
  const sums = {}, count = {};
  for (const r of records) {
    for (const m of METRICS) {
      if (r[m] != null) {
        sums[m]  = (sums[m]  || 0) + r[m];
        count[m] = (count[m] || 0) + 1;
      }
    }
  }
  const avgs = {};
  for (const m of METRICS) {
    if (count[m]) avgs[m] = sums[m] / count[m];
  }
  return avgs;
}

function matchesTrigger(triggerWhen, averages) {
  const triggers = Object.entries(triggerWhen || {}).filter(([, v]) => v != null);
  if (!triggers.length) return true;
  return triggers.some(([metric, direction]) => {
    const avg = averages[metric];
    if (avg == null) return false;
    return direction === "low" ? avg <= LOW_THRESHOLD : avg >= HIGH_THRESHOLD;
  });
}

// ── GET /api/advice ────────────────────────────────────────────────────────────
export const getAll = async (req, res) => {
  try {
    const advice = await Advice.find({ active: true }).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: advice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/advice/relevant ───────────────────────────────────────────────────
export const getRelevant = async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id);
    if (!patient) return res.json({ success: true, data: [] });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentRecords = (patient.records || []).filter(
      (r) => new Date(r.date) >= thirtyDaysAgo
    );

    const averages = computeAverages(recentRecords);
    const all      = await Advice.find({ active: true }).sort({ order: 1 });
    const relevant = all.filter((item) => matchesTrigger(item.triggerWhen, averages));

    res.json({ success: true, data: relevant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/advice/:id ────────────────────────────────────────────────────────
export const getOne = async (req, res) => {
  try {
    const advice = await Advice.findById(req.params.id);
    if (!advice) return res.status(404).json({ success: false, message: "Advice not found" });
    res.json({ success: true, data: advice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/advice ───────────────────────────────────────────────────────────
export const create = async (req, res) => {
  try {
    const advice = await Advice.create(req.body);
    res.status(201).json({ success: true, data: advice });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ── PUT /api/advice/:id ────────────────────────────────────────────────────────
export const update = async (req, res) => {
  try {
    const advice = await Advice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!advice) return res.status(404).json({ success: false, message: "Advice not found" });
    res.json({ success: true, data: advice });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ── DELETE /api/advice/:id ─────────────────────────────────────────────────────
export const remove = async (req, res) => {
  try {
    const advice = await Advice.findByIdAndDelete(req.params.id);
    if (!advice) return res.status(404).json({ success: false, message: "Advice not found" });
    res.json({ success: true, message: "Advice deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/advice/:id/viewed ────────────────────────────────────────────────
// Marks an advice item as viewed for the current patient (idempotent)
export const markViewed = async (req, res) => {
  try {
    await Patient.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { viewedAdvice: req.params.id } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/advice/:id/relevant ─────────────────────────────────────────────
// Toggles an advice item in the patient's relevantAdvice list
export const toggleRelevant = async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id);
    if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });

    const id = req.params.id;
    const isRelevant = patient.relevantAdvice.some((r) => r.toString() === id);

    await Patient.findByIdAndUpdate(
      req.user.id,
      isRelevant
        ? { $pull:      { relevantAdvice: id } }
        : { $addToSet:  { relevantAdvice: id } }
    );

    res.json({ success: true, relevant: !isRelevant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/advice/my-state ───────────────────────────────────────────────────
// Returns the patient's viewed and relevant advice IDs — called on app load
// so AdviceContext can hydrate from the database instead of starting empty
export const getMyState = async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id)
      .select("viewedAdvice relevantAdvice");
    if (!patient) return res.json({ success: true, data: { viewed: [], relevant: [] } });

    res.json({
      success: true,
      data: {
        viewed:   patient.viewedAdvice,
        relevant: patient.relevantAdvice,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};