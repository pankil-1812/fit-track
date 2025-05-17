import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyTwoFactor,
  refreshToken
} from '../controllers/authController';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updatePrivacySettings,
  uploadProfilePicture,
  searchUsers
} from '../controllers/userController';
import { protect, authorize } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validatorMiddleware';
import { 
  registerValidation, 
  loginValidation,
  idValidation
} from '../services/validationService';

const router = express.Router();

// Auth routes
router.post('/register', validate(registerValidation), register);
router.post('/login', validate(loginValidation), login);
router.post('/verify-2fa', verifyTwoFactor);
router.get('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);
router.post('/refresh-token', refreshToken);

// Protected routes
router.use(protect);

router.get('/me', getMe);
router.put('/update-details', updateDetails);
router.put('/update-password', updatePassword);
router.put('/privacy', updatePrivacySettings);
router.put('/profile-picture', uploadProfilePicture);
router.get('/search', searchUsers);

// Admin only routes
router.use(authorize('admin'));

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

export default router;
