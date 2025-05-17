import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import {
  getRoutines,
  getRoutine,
  createRoutine,
  updateRoutine,
  deleteRoutine,
  likeRoutine,
  saveRoutine,
  searchRoutines
} from '../controllers/routineController';
import { validate } from '../middlewares/validatorMiddleware';
import { routineValidation, idValidation } from '../services/validationService';

const router = express.Router();

// Protect all routes
router.use(protect);

// Search route
router.get('/search', searchRoutines);

// Like and save routes
router.put('/:id/like', validate(idValidation), likeRoutine);
router.put('/:id/save', validate(idValidation), saveRoutine);

// Standard CRUD routes
router.route('/')
  .get(getRoutines)
  .post(validate(routineValidation), createRoutine);

router.route('/:id')
  .get(validate(idValidation), getRoutine)
  .put([...idValidation, ...routineValidation], updateRoutine)
  .delete(validate(idValidation), deleteRoutine);

export default router;
