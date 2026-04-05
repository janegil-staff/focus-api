import { Router } from "express";
import authRoutes from "./auth.js";
import patientRoutes from "./patient.js";
import logRoutes from "./logs.js";
import clinicianRoutes from "./clinician.js";
import exportRoutes from "./export.js";
import shareRoutes from "./shareRoutes.js";
import adviceRoutes from "./advice.js";

const router = Router();

router.get("/health", (_, res) =>
  res.json({
    success: true,
    message: "Fokus API is running 🧠",
    env: process.env.NODE_ENV,
  }),
);

router.use("/api/auth", authRoutes);
router.use("/api/patient", patientRoutes);
router.use("/api/logs", logRoutes);
router.use("/api/clinician", clinicianRoutes);
router.use("/api/export", exportRoutes);
router.use("/api/advice", adviceRoutes);
router.use("/api", shareRoutes);

export default router;
