import { body, param, query, check } from 'express-validator';

/**
 * Validation rules for user registration
 */
export const registerValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please include a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

/**
 * Validation rules for user login
 */
export const loginValidation = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please include a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

/**
 * Validation rules for creating/updating routines
 */
export const routineValidation = [
    check('title')
        .exists()
        .withMessage('Title field must exist')
        .notEmpty()
        .withMessage('Title is required')
        .trim()
        .isLength({ max: 100 })
        .withMessage('Title cannot be more than 100 characters'),
    
    check('description')
        .exists()
        .withMessage('Description field must exist')
        .notEmpty()
        .withMessage('Description is required')
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description cannot be more than 500 characters'),
    
    check('category')
        .exists()
        .withMessage('Category field must exist')
        .notEmpty()
        .withMessage('Category is required')
        .isIn([
            'strength',
            'cardio',
            'hiit',
            'flexibility',
            'bodyweight',
            'powerlifting',
            'crossfit',
            'yoga',
            'other'
        ])
        .withMessage('Invalid category'),
    
    check('difficulty')
        .exists()
        .withMessage('Difficulty field must exist')
        .notEmpty()
        .withMessage('Difficulty level is required')
        .isIn(['beginner', 'intermediate', 'advanced'])
        .withMessage('Invalid difficulty level'),
    
    check('exercises')
        .exists()
        .withMessage('Exercises field must exist')
        .isArray()
        .withMessage('Exercises must be provided as an array')
        .notEmpty()
        .withMessage('At least one exercise is required'),
    
    check('exercises.*.name')
        .exists()
        .withMessage('Exercise name field must exist')
        .notEmpty()
        .withMessage('Exercise name is required')
        .trim(),
    
    check('exercises.*.sets')
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage('Sets must be a positive number'),
    
    check('exercises.*.reps')
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage('Reps must be a positive number'),
    
    check('exercises.*.duration')
        .optional({ nullable: true })
        .isInt({ min: 0 })
        .withMessage('Duration must be a non-negative number'),
    
    check('exercises.*.restTime')
        .optional({ nullable: true })
        .isInt({ min: 0 })
        .withMessage('Rest time must be a non-negative number'),
    
    check('exercises.*.weight')
        .optional({ nullable: true })
        .isInt({ min: 0 })
        .withMessage('Weight must be a non-negative number'),
    
    check('isPublic')
        .optional({ nullable: true })
        .isBoolean()
        .withMessage('isPublic must be a boolean')
        .toBoolean(),
    
    check('tags')
        .optional({ nullable: true })
        .isArray()
        .withMessage('Tags must be provided as an array')
];

/**
 * Validation rules for creating/updating workout logs
 */
export const workoutLogValidation = [
    check('routine')
        .exists()
        .withMessage('Routine field must exist')
        .notEmpty()
        .withMessage('Routine ID is required')
        .isMongoId()
        .withMessage('Invalid routine ID'),
    
    check('startTime')
        .exists()
        .withMessage('Start time field must exist')
        .notEmpty()
        .withMessage('Start time is required')
        .isISO8601()
        .withMessage('Invalid start time format'),
    
    check('endTime')
        .exists()
        .withMessage('End time field must exist')
        .notEmpty()
        .withMessage('End time is required')
        .isISO8601()
        .withMessage('Invalid end time format'),
    
    check('duration')
        .exists()
        .withMessage('Duration field must exist')
        .isNumeric()
        .withMessage('Duration must be a number'),
    
    check('exercises')
        .exists()
        .withMessage('Exercises field must exist')
        .isArray()
        .withMessage('Exercises must be an array')
        .notEmpty()
        .withMessage('At least one exercise is required'),
    
    check('exercises.*.name')
        .exists()
        .withMessage('Exercise name field must exist')
        .notEmpty()
        .withMessage('Exercise name is required'),
    
    check('exercises.*.actualSets')
        .exists()
        .withMessage('Actual sets field must exist')
        .isNumeric()
        .withMessage('Actual sets must be a number'),
    
    check('exercises.*.actualReps')
        .exists()
        .withMessage('Actual reps field must exist')
        .isNumeric()
        .withMessage('Actual reps must be a number'),
    
    check('rating')
        .optional({ nullable: true })
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5')
];

/**
 * Validation rules for body measurements
 */
export const bodyMeasurementValidation = [
  body('weight')
    .notEmpty()
    .withMessage('Weight is required')
    .isNumeric()
    .withMessage('Weight must be a number'),
  body('bodyFat')
    .optional()
    .isNumeric()
    .withMessage('Body fat must be a number'),
  body('chest')
    .optional()
    .isNumeric()
    .withMessage('Chest measurement must be a number'),
  body('waist')
    .optional()
    .isNumeric()
    .withMessage('Waist measurement must be a number'),
  body('hips')
    .optional()
    .isNumeric()
    .withMessage('Hips measurement must be a number')
];

/**
 * Validation rules for fitness scores
 */
export const fitnessScoreValidation = [
  body('strength')
    .notEmpty()
    .withMessage('Strength score is required')
    .isInt({ min: 0, max: 100 })
    .withMessage('Strength score must be between 0 and 100'),
  body('cardio')
    .notEmpty()
    .withMessage('Cardio score is required')
    .isInt({ min: 0, max: 100 })
    .withMessage('Cardio score must be between 0 and 100'),
  body('flexibility')
    .notEmpty()
    .withMessage('Flexibility score is required')
    .isInt({ min: 0, max: 100 })
    .withMessage('Flexibility score must be between 0 and 100'),
  body('consistency')
    .notEmpty()
    .withMessage('Consistency score is required')
    .isInt({ min: 0, max: 100 })
    .withMessage('Consistency score must be between 0 and 100')
];

/**
 * Validation for date range queries
 */
export const dateRangeValidation = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date')
];

/**
 * Validation rules for ID parameters
 */
export const idValidation = [
  param('id')
    .notEmpty()
    .withMessage('ID parameter is required')
    .isMongoId()
    .withMessage('Invalid ID format')
];
