import express from 'express';
import {
  fetchUser,
  updateProfile,
  updateProfileImage,
  updateCoverImage,
  updateSubscription,
  captureUserEmail,
} from '../controllers/user.js';
import { authCheck } from '../middleware/auth.js';

const router = express.Router();

router.post('/fetch-user', authCheck, fetchUser);
router.put('/update-profile', authCheck, updateProfile);
router.put('/update-profile-image', authCheck, updateProfileImage);
router.put('/update-cover-image', authCheck, updateCoverImage);
router.put('/update-subscription', authCheck, updateSubscription);
router.post('/capture-user-email', authCheck, captureUserEmail);

export default router;
