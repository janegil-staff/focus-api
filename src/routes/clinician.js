import { Router } from 'express';
import { getMyPatients, getPatientDetail, getAlerts } from '../controllers/clinicianController.js';
import { getPatientLogs, getSummary } from '../controllers/logController.js';
import { exportPatientReport } from '../controllers/exportController.js';
import { authMiddleware, clinicianOnly } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware, clinicianOnly);

router.get('/patients',                       getMyPatients);
router.get('/patients/:patientId',            getPatientDetail);
router.get('/patients/:patientId/logs',       getPatientLogs);
router.get('/patients/:patientId/summary',    getSummary);
router.get('/patients/:patientId/export',     exportPatientReport);
router.get('/alerts',                         getAlerts);

export default router;
