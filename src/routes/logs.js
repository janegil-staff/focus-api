import { Router } from 'express';
import {
  createOrUpdateLog, getLogs, getLogByDate,
  deleteLog, getSummary,
} from '../controllers/logController.js';
import { authMiddleware, patientOnly } from '../middleware/auth.js';
import { validateLog } from '../middleware/validate.js';

const router = Router();

router.use(authMiddleware, patientOnly);

router.post('/',        validateLog, createOrUpdateLog);
router.get('/',         getLogs);
router.get('/summary',  getSummary);
router.get('/:date',    getLogByDate);
router.delete('/:date', deleteLog);

export default router;
