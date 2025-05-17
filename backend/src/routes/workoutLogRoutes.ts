import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import {
  getWorkoutLogs,
  getWorkoutLog,
  createWorkoutLog,
  updateWorkoutLog,
  deleteWorkoutLog,
  getWorkoutStats
} from '../controllers/workoutLogController';
import { validate } from '../middlewares/validatorMiddleware';
import { 
  workoutLogValidation, 
  idValidation, 
  dateRangeValidation 
} from '../services/validationService';

const router = express.Router();

// Protect all routes
router.use(protect);

// Stats route
router.get('/stats', validate(dateRangeValidation), getWorkoutStats);

// Standard CRUD routes
router.route('/')
  .get(validate(dateRangeValidation), getWorkoutLogs)
  .post(validate(workoutLogValidation), createWorkoutLog);

router.route('/:id')
  .get(validate(idValidation), getWorkoutLog)
  .put([...idValidation, ...workoutLogValidation], updateWorkoutLog)
  .delete(validate(idValidation), deleteWorkoutLog);

export default router;
