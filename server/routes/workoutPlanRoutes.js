import express from 'express';
import {
  createWorkoutPlan,
  getWorkoutPlans,
  updateWorkoutPlan,
  deleteWorkoutPlan
} from '../controllers/workoutPlanController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router
  .route('/')
  .post(authorize('trainer', 'admin'), createWorkoutPlan)
  .get(getWorkoutPlans);

router
  .route('/:id')
  .put(authorize('trainer', 'admin'), updateWorkoutPlan)
  .delete(authorize('trainer', 'admin'), deleteWorkoutPlan);

export default router;
