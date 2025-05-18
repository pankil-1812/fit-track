import express from 'express';
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
import { protect } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validatorMiddleware';
import { routineValidation } from '../services/validationService';

const router = express.Router();

// Public routes
router.get('/search', searchRoutines);

// Protected routes
router.use(protect);

router.route('/')
    .get(getRoutines)
    .post(routineValidation, validateRequest, createRoutine);

router.route('/:id')
    .get(getRoutine)
    .put(routineValidation, validateRequest, updateRoutine)
    .delete(deleteRoutine);

router.put('/:id/like', likeRoutine);
router.put('/:id/save', saveRoutine);

export default router;
