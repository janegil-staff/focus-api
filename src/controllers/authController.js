import Patient from "../models/Patient.js";
import Clinician from "../models/Clinician.js";
import { signTokens, verifyRefresh, generateAccessCode } from "../utils/jwt.js";

export const patientRegister = async (req, res) => {
  try {
    const { name, email, password, language, clinicianCode, age } = req.body;
    if (!name || !email || !password || !age)
      return res
        .status(400)
        .json({
          success: false,
          error: "Name, email and password are required",
        });
    if (await Patient.findOne({ email }))
      return res
        .status(409)
        .json({ success: false, error: "Email already registered" });
    if (clinicianCode) {
      const c = await Clinician.findOne({
        accessCode: clinicianCode.toUpperCase(),
      });
      if (!c)
        return res
          .status(400)
          .json({ success: false, error: "Invalid clinician code" });
    }
    const patient = await Patient.create({
      age,
      name,
      email,
      password,
      language: language || "no",
      clinicianCode: clinicianCode?.toUpperCase(),
    });
    const tokens = signTokens(patient._id.toString(), "patient");
    res
      .status(201)
      .json({
        success: true,
        data: {
          ...tokens,
          patient: {
            _id: patient._id,
            age: patient.age,
            name: patient.name,
            email: patient.email,
            language: patient.language,
          },
        },
      });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const patientLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const patient = await Patient.findOne({ email });
    if (!patient || !(await patient.comparePassword(password)))
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    const tokens = signTokens(patient._id.toString(), "patient");
    res.json({
      success: true,
      data: {
        ...tokens,
        patient: {
          _id: patient._id,
          name: patient.name,
          email: patient.email,
          language: patient.language,
        },
      },
    });
  } catch {
    res.status(500).json({ success: false, error: "Login failed" });
  }
};

export const clinicianLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const clinician = await Clinician.findOne({ email });
    if (!clinician || !(await clinician.comparePassword(password)))
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    const tokens = signTokens(clinician._id.toString(), "clinician");
    res.json({
      success: true,
      data: {
        ...tokens,
        clinician: {
          _id: clinician._id,
          name: clinician.name,
          email: clinician.email,
          accessCode: clinician.accessCode,
        },
      },
    });
  } catch {
    res.status(500).json({ success: false, error: "Login failed" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res
        .status(400)
        .json({ success: false, error: "Refresh token required" });
    const decoded = verifyRefresh(refreshToken);
    const tokens = signTokens(decoded.userId, decoded.role);
    res.json({ success: true, data: tokens });
  } catch {
    res.status(401).json({ success: false, error: "Invalid refresh token" });
  }
};

export const getMe = async (req, res) => {
  try {
    if (req.userRole === "patient") {
      const patient = await Patient.findById(req.userId).select("-password");
      return res.json({ success: true, data: patient });
    }
    const clinician = await Clinician.findById(req.userId).select("-password");
    res.json({ success: true, data: clinician });
  } catch {
    res.status(500).json({ success: false, error: "Failed to get user" });
  }
};
