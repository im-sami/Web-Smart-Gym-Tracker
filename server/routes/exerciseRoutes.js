import express from 'express';
import {
  getExercises,
  searchExercises,
  createExercise
} from '../controllers/exerciseController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getExercises)
  .post(authorize('trainer', 'admin'), createExercise);

router.get('/search', searchExercises);

export default router;
