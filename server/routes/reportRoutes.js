import express from 'express';
import { getMemberReport } from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/member/:id', protect, getMemberReport);

export default router;
