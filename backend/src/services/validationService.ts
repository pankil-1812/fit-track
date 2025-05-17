import { body, param, query } from 'express-validator';

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
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('exercises')
    .isArray()
    .withMessage('Exercises must be an array'),
  body('exercises.*.name')
    .notEmpty()
    .withMessage('Exercise name is required'),
  body('category')
    .optional()
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
  body('difficulty')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
    .withMessage('Invalid difficulty level')
];

/**
 * Validation rules for creating/updating workout logs
 */
export const workoutLogValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required'),
  body('exerciseLogs')
    .isArray()
    .withMessage('Exercise logs must be an array'),
  body('exerciseLogs.*.exercise')
    .notEmpty()
    .withMessage('Exercise name is required'),
  body('duration')
    .isNumeric()
    .withMessage('Duration must be a number')
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
