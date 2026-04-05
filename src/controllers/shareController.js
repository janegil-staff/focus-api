import ShareCode from '../models/ShareCode.js';
import Patient  from '../models/Patient.js';
import DailyLog from '../models/DailyLog.js';

async function generateUniqueCode() {
  let code, exists;
  do {
    code = String(Math.floor(100000 + Math.random() * 900000));
    exists = await ShareCode.findOne({ code, expiresAt: { $gt: new Date() } });
  } while (exists);
  return code;
}

// POST /api/patient/share-code
export const generateShareCode = async (req, res) => {
  try {
    console.log('[share] generateShareCode called, userId:', req.userId);
    const { includeNotes = true } = req.body;

    // Delete any existing active codes for this patient
    await ShareCode.deleteMany({ patient: req.userId });
    console.log('[share] deleted old codes');

    const code      = await generateUniqueCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    console.log('[share] generated code:', code, 'expires:', expiresAt);

    const shareCode = await ShareCode.create({
      code,
      patient: req.userId,
      expiresAt,
      includeNotes,
    });
    console.log('[share] saved to DB:', shareCode._id);

    res.json({
      success: true,
      data: {
        code:         shareCode.code,
        expiresAt:    shareCode.expiresAt,
        includeNotes: shareCode.includeNotes,
      },
    });
  } catch (err) {
    console.error('[share] ERROR:', err.message, err.stack);
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/share/:code
export const getSharedData = async (req, res) => {
  try {
    const { code } = req.params;
    console.log('[share] getSharedData code:', code);

    const shareCode = await ShareCode.findOne({
      code,
      expiresAt: { $gt: new Date() },
    });

    if (!shareCode) {
      console.log('[share] code not found or expired');
      return res.status(404).json({ success: false, error: 'Code not found or expired' });
    }

    const [patient, logs] = await Promise.all([
      Patient.findById(shareCode.patient).select('-password -__v'),
      DailyLog.find({ patient: shareCode.patient }).sort({ date: -1 }).lean(),
    ]);

    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }

    const processedLogs = logs.map((log) => {
      if (!shareCode.includeNotes) {
        const { note, ...rest } = log;
        return rest;
      }
      return log;
    });

    res.json({
      success: true,
      data: {
        patient: {
          name:        patient.name,
          age:         patient.age,
          gender:      patient.gender,
          language:    patient.language,
          medications: patient.medications ?? [],
        },
        logs:        processedLogs,
        generatedAt: new Date().toISOString(),
        expiresAt:   shareCode.expiresAt,
      },
    });
  } catch (err) {
    console.error('[share] getSharedData ERROR:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};