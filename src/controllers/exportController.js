import Patient from '../models/Patient.js';
import Clinician from '../models/Clinician.js';
import DailyLog from '../models/DailyLog.js';
import Medication from '../models/Medication.js';

export const exportPatientReport = async (req, res) => {
  try {
    const patientId = req.params.patientId || req.userId;
    const { from, to, days = '30' } = req.query;

    if (req.userRole === 'clinician') {
      const clinician = await Clinician.findById(req.userId);
      const patient = await Patient.findOne({ _id: patientId, clinicianCode: clinician?.accessCode });
      if (!patient) return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const patient = await Patient.findById(patientId).select('-password');
    if (!patient) return res.status(404).json({ success: false, error: 'Patient not found' });

    const fromDate = from
      ? String(from)
      : (() => { const d = new Date(); d.setDate(d.getDate() - Number(days)); return d.toISOString().split('T')[0]; })();
    const toDate = to ? String(to) : new Date().toISOString().split('T')[0];

    const logs = await DailyLog.find({ patient: patientId, date: { $gte: fromDate, $lte: toDate } }).sort({ date: 1 });
    const meds = await Medication.find({ patient: patientId, active: true });

    const avg = (f) => logs.length === 0 ? 0 : +(logs.reduce((s, l) => s + l[f], 0) / logs.length).toFixed(2);
    const medAdherence = logs.length === 0 ? 0 : Math.round((logs.filter(l => l.medicationTaken).length / logs.length) * 100);

    res.json({
      success: true,
      data: {
        generatedAt: new Date().toISOString(),
        period: { from: fromDate, to: toDate, totalDays: logs.length },
        patient: { name: patient.name, dateOfBirth: patient.dateOfBirth, gender: patient.gender, diagnosis: patient.diagnosis, language: patient.language },
        medications: meds.map(m => ({ name: m.name, dosage: m.dosage, frequency: m.frequency, startDate: m.startDate, prescribedBy: m.prescribedBy })),
        summary: {
          averages: { mood: avg('mood'), focus: avg('focus'), sleep: avg('sleep'), energy: avg('energy'), impulsivity: avg('impulsivity'), tasks: avg('tasksCompleted'), screenTime: avg('screenTimeHours') },
          medicationAdherence: medAdherence,
        },
        logs: logs.map(l => ({ date: l.date, mood: l.mood, focus: l.focus, sleep: l.sleep, energy: l.energy, impulsivity: l.impulsivity, tasksCompleted: l.tasksCompleted, screenTimeHours: l.screenTimeHours, medicationTaken: l.medicationTaken, note: l.note, triggers: l.triggers })),
      },
    });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to generate report' });
  }
};
