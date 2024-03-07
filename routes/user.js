import express from 'express';
import {
  fetchUser,
  updateProfile,
  updateProfileImage,
  updateCoverImage,
} from '../controllers/user.js';

const router = express.Router();

router.post('/fetch-user', fetchUser);
router.put('/update-profile', updateProfile);
router.put('/update-profile-image', updateProfileImage);
router.put('/update-cover-image', updateCoverImage);

export default router;
