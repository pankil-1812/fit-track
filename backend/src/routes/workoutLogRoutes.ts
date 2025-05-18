import express from 'express';
import { check } from 'express-validator';
import {
    getWorkoutLogs,
    getWorkoutLogsByDate,
    getWorkoutLogsByRoutine,
    createWorkoutLog,
    updateWorkoutLog,
    deleteWorkoutLog,
    getWorkoutStats
} from '../controllers/workoutLogController';
import { protect } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validatorMiddleware';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Validation middleware
const validateWorkoutLog = [
    check('routine')
        .notEmpty()
        .withMessage('Routine ID is required')
        .isMongoId()
        .withMessage('Invalid routine ID'),
    check('startTime')
        .notEmpty()
        .withMessage('Start time is required')
        .isISO8601()
        .withMessage('Invalid start time format'),
    check('endTime')
        .notEmpty()
        .withMessage('End time is required')
        .isISO8601()
        .withMessage('Invalid end time format'),
    check('duration')
        .isNumeric()
        .withMessage('Duration must be a number'),
    check('exercises')
        .isArray()
        .withMessage('Exercises must be an array'),
    check('exercises.*.name')
        .notEmpty()
        .withMessage('Exercise name is required'),
    check('exercises.*.actualSets')
        .isNumeric()
        .withMessage('Actual sets must be a number'),
    check('exercises.*.actualReps')
        .isNumeric()
        .withMessage('Actual reps must be a number')
];

// Routes
router.route('/')
    .get(getWorkoutLogs)
    .post(validateWorkoutLog, validateRequest, createWorkoutLog);

router.get('/stats', getWorkoutStats);
router.get('/date/:date', getWorkoutLogsByDate);
router.get('/routine/:routineId', getWorkoutLogsByRoutine);

router.route('/:id')
    .put(validateWorkoutLog, validateRequest, updateWorkoutLog)
    .delete(deleteWorkoutLog);

export default router;
