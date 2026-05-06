import express from 'express';
import { getMemberReport, getSystemReport } from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/member/:id', protect, getMemberReport);
router.get('/system', protect, authorize('admin'), getSystemReport);

export default router;
