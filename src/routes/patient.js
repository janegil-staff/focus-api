import { Router } from "express";
import {
  getProfile,
  updateProfile,
  deleteAccount,
  getMedications,
  createMedication,
  updateMedication,
  deleteMedication,
  getNotificationSettings,
  updateNotificationSettings,
  bulkUpdateMedications,
} from "../controllers/patientController.js";
import { authMiddleware, patientOnly } from "../middleware/auth.js";

const router = Router();

router.use(authMiddleware, patientOnly);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.delete("/account", deleteAccount);

router.get("/medications", getMedications);
router.post("/medications", createMedication);
router.put("/medications/:id", updateMedication);
router.delete("/medications/:id", deleteMedication);

router.get("/notifications", getNotificationSettings);
router.put("/notifications", updateNotificationSettings);

router.patch("/medications/bulk", bulkUpdateMedications);

export default router;
