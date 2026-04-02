import Clinician from '../models/Clinician.js';
import Patient from '../models/Patient.js';
import DailyLog from '../models/DailyLog.js';
import { generateAccessCode } from '../utils/jwt.js';

export const registerClinician = async (req, res) => {
  try {
    const { name, email, password, organization, specialty, language } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, error: 'Name, email and password are required' });
    if (await Clinician.findOne({ email }))
      return res.status(409).json({ success: false, error: 'Email already registered' });
    let accessCode = generateAccessCode();
    while (await Clinician.findOne({ accessCode })) accessCode = generateAccessCode();
    const clinician = await Clinician.create({ name, email, password, accessCode, organization, specialty, language: language || 'no' });
    res.status(201).json({ success: true, data: { _id: clinician._id, name: clinician.name, email: clinician.email, accessCode: clinician.accessCode } });
  } catch {
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
};

export const getMyPatients = async (req, res) => {
  try {
    const clinician = await Clinician.findById(req.userId);
    if (!clinician) return res.status(404).json({ success: false, error: 'Not found' });
    const patients = await Patient.find({ clinicianCode: clinician.accessCode }).select('-password');
    res.json({ success: true, data: patients });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch patients' });
  }
};

export const getPatientDetail = async (req, res) => {
  try {
    const clinician = await Clinician.findById(req.userId);
    if (!clinician) return res.status(404).json({ success: false, error: 'Not found' });
    const patient = await Patient.findOne({ _id: req.params.patientId, clinicianCode: clinician.accessCode }).select('-password');
    if (!patient) return res.status(404).json({ success: false, error: 'Patient not found' });
    res.json({ success: true, data: patient });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch patient' });
  }
};

export const getAlerts = async (req, res) => {
  try {
    const clinician = await Clinician.findById(req.userId);
    if (!clinician) return res.status(404).json({ success: false, error: 'Not found' });
    const patients = await Patient.find({ clinicianCode: clinician.accessCode }).select('_id name');
    const alerts = [];
    for (const p of patients) {
      const logs = await DailyLog.find({ patient: p._id }).sort({ date: -1 }).limit(3);
      if (logs.length < 2) continue;
      const avgMood  = logs.reduce((s, l) => s + l.mood, 0) / logs.length;
      const avgFocus = logs.reduce((s, l) => s + l.focus, 0) / logs.length;
      if (avgMood <= 2 || avgFocus <= 2)
        alerts.push({ patient: { _id: p._id, name: p.name }, avgMood: +avgMood.toFixed(1), avgFocus: +avgFocus.toFixed(1), latestDate: logs[0].date });
    }
    res.json({ success: true, data: alerts });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch alerts' });
  }
};
