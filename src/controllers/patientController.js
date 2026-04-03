import Patient from "../models/Patient.js";
import Medication from "../models/Medication.js";
import Notification from "../models/Notification.js";

export const getProfile = async (req, res) => {
  try {
    const patient = await Patient.findById(req.userId).select("-password");
    if (!patient)
      return res.status(404).json({ success: false, error: "Not found" });
    res.json({ success: true, data: patient });
  } catch {
    res.status(500).json({ success: false, error: "Failed to get profile" });
  }
};

// In src/controllers/patientController.js
// Replace updateProfile with this:

export const updateProfile = async (req, res) => {
  try {
    const allowed = [
      "name",
      "dateOfBirth",
      "gender",
      "diagnosis",
      "medications",
      "language",
      "timezone",
      "notificationsEnabled",
      "age",
    ];
    const updates = {};
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });
    const patient = await Patient.findByIdAndUpdate(req.userId, updates, {
      returnDocument: "after",
      runValidators: true,
    }).select("-password");
    res.json({ success: true, data: patient });
  } catch (err) {
    console.error("updateProfile error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.userId);
    res.json({ success: true, message: "Account deleted" });
  } catch {
    res.status(500).json({ success: false, error: "Failed to delete account" });
  }
};

export const getMedications = async (req, res) => {
  try {
    const query = { patient: req.userId };
    if (req.query.active !== undefined)
      query.active = req.query.active === "true";
    const meds = await Medication.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: meds });
  } catch {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch medications" });
  }
};

export const createMedication = async (req, res) => {
  try {
    const { name, dosage, startDate } = req.body;
    if (!name || !dosage || !startDate)
      return res
        .status(400)
        .json({
          success: false,
          error: "name, dosage and startDate are required",
        });
    const med = await Medication.create({ patient: req.userId, ...req.body });
    res.status(201).json({ success: true, data: med });
  } catch {
    res
      .status(500)
      .json({ success: false, error: "Failed to create medication" });
  }
};

export const updateMedication = async (req, res) => {
  try {
    const med = await Medication.findOneAndUpdate(
      { _id: req.params.id, patient: req.userId },
      req.body,
      { new: true, runValidators: true },
    );
    if (!med)
      return res
        .status(404)
        .json({ success: false, error: "Medication not found" });
    res.json({ success: true, data: med });
  } catch {
    res
      .status(500)
      .json({ success: false, error: "Failed to update medication" });
  }
};

export const deleteMedication = async (req, res) => {
  try {
    await Medication.findOneAndDelete({
      _id: req.params.id,
      patient: req.userId,
    });
    res.json({ success: true });
  } catch {
    res
      .status(500)
      .json({ success: false, error: "Failed to delete medication" });
  }
};

export const getNotificationSettings = async (req, res) => {
  try {
    const settings = await Notification.findOne({ patient: req.userId });
    res.json({
      success: true,
      data: settings || {
        reminderTime: "20:00",
        reminderEnabled: true,
        reminderDays: [0, 1, 2, 3, 4, 5, 6],
      },
    });
  } catch {
    res.status(500).json({ success: false, error: "Failed to get settings" });
  }
};

export const updateNotificationSettings = async (req, res) => {
  try {
    const settings = await Notification.findOneAndUpdate(
      { patient: req.userId },
      { patient: req.userId, ...req.body },
      { upsert: true, new: true },
    );
    res.json({ success: true, data: settings });
  } catch {
    res
      .status(500)
      .json({ success: false, error: "Failed to update settings" });
  }
};

export const bulkUpdateMedications = async (req, res) => {
  try {
    const { medications } = req.body; // array of medication name IDs e.g. ['methylphenidate', 'atomoxetine']
    if (!Array.isArray(medications))
      return res.status(400).json({ success: false, error: 'medications must be an array' });

    await Patient.findByIdAndUpdate(req.userId, { medications });
    res.json({ success: true, data: { medications } });
  } catch (err) {
    console.error('bulkUpdateMedications error:', err);
    res.status(500).json({ success: false, error: 'Failed to save medications' });
  }
};