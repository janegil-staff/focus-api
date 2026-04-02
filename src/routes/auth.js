import { Router } from 'express';
import { patientRegister, patientLogin, clinicianLogin, refreshToken, getMe } from '../controllers/authController.js';
import { registerClinician } from '../controllers/clinicianController.js';
import { authMiddleware } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimit.js';

const router = Router();

router.post('/patient/register',   authLimiter, patientRegister);
router.post('/patient/login',      authLimiter, patientLogin);
router.post('/clinician/register', authLimiter, registerClinician);
router.post('/clinician/login',    authLimiter, clinicianLogin);
router.post('/refresh',            refreshToken);
router.get('/me',                  authMiddleware, getMe);

export default router;
