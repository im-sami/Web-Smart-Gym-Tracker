import express from 'express';
import { createWorkoutLog, getWorkoutLogs } from '../controllers/workoutController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createWorkoutLog)
  .get(getWorkoutLogs);

export default router;
