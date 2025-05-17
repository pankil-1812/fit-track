import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import {
  getAnalyticsOverview,
  getDailyStats,
  getBodyMeasurements,
  addBodyMeasurement,
  getFitnessScores,
  addFitnessScore,
  getAchievements,
  addAchievement,
  rebuildAnalytics
} from '../controllers/analyticsController';
import { validate } from '../middlewares/validatorMiddleware';
import { 
  bodyMeasurementValidation, 
  fitnessScoreValidation, 
  dateRangeValidation 
} from '../services/validationService';

const router = express.Router();

// Protect all routes
router.use(protect);

// Overview route
router.get('/overview', getAnalyticsOverview);

// Daily stats route
router.get('/daily', validate(dateRangeValidation), getDailyStats);

// Body measurements routes
router.route('/body-measurements')
  .get(getBodyMeasurements)
  .post(validate(bodyMeasurementValidation), addBodyMeasurement);

// Fitness scores routes
router.route('/fitness-scores')
  .get(getFitnessScores)
  .post(validate(fitnessScoreValidation), addFitnessScore);

// Achievements routes
router.route('/achievements')
  .get(getAchievements)
  .post(addAchievement);

// Rebuild analytics route
router.post('/rebuild', rebuildAnalytics);

export default router;
