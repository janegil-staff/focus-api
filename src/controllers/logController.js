import DailyLog from '../models/DailyLog.js';

export const createOrUpdateLog = async (req, res) => {
  try {
    const { date, mood, focus, sleep, energy, impulsivity, tasksCompleted,
            screenTimeHours, medicationTaken, medicationNames, medicationDoses,
            medicationNotes, note, triggers } = req.body;
    const log = await DailyLog.findOneAndUpdate(
      { patient: req.userId, date },
      { patient: req.userId, date, mood, focus, sleep, energy, impulsivity,
        tasksCompleted, screenTimeHours, medicationTaken, medicationNames,
        medicationDoses, medicationNotes, note, triggers },
      { upsert: true, new: true, runValidators: true }
    );
    res.status(201).json({ success: true, data: log });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to save log' });
  }
};

export const getLogs = async (req, res) => {
  try {
    const { from, to, limit = '90' } = req.query;
    const query = { patient: req.userId };
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = from;
      if (to)   query.date.$lte = to;
    }
    const logs = await DailyLog.find(query).sort({ date: -1 }).limit(Number(limit));
    res.json({ success: true, data: logs });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch logs' });
  }
};

export const getLogByDate = async (req, res) => {
  try {
    const log = await DailyLog.findOne({ patient: req.userId, date: req.params.date });
    res.json({ success: true, data: log || null });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch log' });
  }
};

export const deleteLog = async (req, res) => {
  try {
    await DailyLog.findOneAndDelete({ patient: req.userId, date: req.params.date });
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to delete log' });
  }
};

export const getPatientLogs = async (req, res) => {
  try {
    const { from, to, limit = '90' } = req.query;
    const query = { patient: req.params.patientId };
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = from;
      if (to)   query.date.$lte = to;
    }
    const logs = await DailyLog.find(query).sort({ date: -1 }).limit(Number(limit));
    res.json({ success: true, data: logs });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch logs' });
  }
};

export const getSummary = async (req, res) => {
  try {
    const patientId = req.params.patientId || req.userId;
    const { days = '30' } = req.query;
    const from = new Date();
    from.setDate(from.getDate() - Number(days));
    const fromStr = from.toISOString().split('T')[0];
    const logs = await DailyLog.find({ patient: patientId, date: { $gte: fromStr } });
    if (logs.length === 0) return res.json({ success: true, data: { count: 0 } });

    const avg = (f) => +(logs.reduce((s, l) => s + l[f], 0) / logs.length).toFixed(2);
    const medDays = logs.filter(l => l.medicationTaken).length;

    res.json({
      success: true,
      data: {
        count: logs.length,
        days: Number(days),
        averages: {
          mood: avg('mood'), focus: avg('focus'), sleep: avg('sleep'),
          energy: avg('energy'), impulsivity: avg('impulsivity'),
          tasks: avg('tasksCompleted'), screenTime: avg('screenTimeHours'),
        },
        medicationAdherence: Math.round((medDays / logs.length) * 100),
        trend: logs.slice(0, 7).reverse().map(l => ({
          date: l.date, mood: l.mood, focus: l.focus,
          sleep: l.sleep, energy: l.energy, impulsivity: l.impulsivity,
        })),
      },
    });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to compute summary' });
  }
};
