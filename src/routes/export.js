import { Router } from 'express';
import { exportPatientReport } from '../controllers/exportController.js';
import { authMiddleware, patientOnly } from '../middleware/auth.js';

const router = Router();

router.get('/my-report', authMiddleware, patientOnly, exportPatientReport);

export default router;
