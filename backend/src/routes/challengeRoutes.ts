import express from 'express';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

// Protect all routes
router.use(protect);

// Placeholder route
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Challenges API working'
  });
});

export default router;
