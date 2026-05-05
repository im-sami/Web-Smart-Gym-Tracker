import express from 'express';
import { getFoodCalories } from '../controllers/edamamController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/nutrition', protect, getFoodCalories);

export default router;
