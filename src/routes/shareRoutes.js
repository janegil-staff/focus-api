import { Router } from 'express';
import { generateShareCode, getSharedData } from '../controllers/shareController.js';
import { authMiddleware, patientOnly } from '../middleware/auth.js';

const router = Router();

// Authenticated — patient generates a code
router.post('/patient/share-code', authMiddleware, patientOnly, generateShareCode);

// Public — doctor/clinician fetches data by code
router.get('/share/:code', getSharedData);

export default router;
