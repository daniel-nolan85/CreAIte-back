import express from 'express';
import {
  fetchUser,
  updateProfile,
  updateProfileImage,
  updateCoverImage,
  updateSubscription,
  captureUserEmail,
} from '../controllers/user.js';

const router = express.Router();

router.post('/fetch-user', fetchUser);
router.put('/update-profile', updateProfile);
router.put('/update-profile-image', updateProfileImage);
router.put('/update-cover-image', updateCoverImage);
router.put('/update-subscription', updateSubscription);
router.post('/capture-user-email', captureUserEmail);

export default router;
