import express from 'express';
import {
  createPrompt,
  createImage,
  createCaption,
  createKeywords,
  saveCreation,
  fetchAllCreations,
  fetchSharedCreations,
  fetchUserCreations,
  fetchRandomCreations,
  fetchUserSharedCreations,
  fetchUserPrivateCreations,
  fetchUserLikedCreations,
  downloadCreation,
  likeCreation,
  unlikeCreation,
} from '../controllers/creation.js';
import { authCheck } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-prompt', authCheck, createPrompt);
router.post('/create-image', authCheck, createImage);
router.post('/create-caption', authCheck, createCaption);
router.post('/create-keywords', authCheck, createKeywords);
router.post('/save-creation', authCheck, saveCreation);
router.get('/fetch-all-creations', fetchAllCreations);
router.post('/fetch-shared-creations', fetchSharedCreations);
router.post('/fetch-user-creations', fetchUserCreations);
router.get('/fetch-random-creations', fetchRandomCreations);
router.post(
  '/fetch-user-shared-creations',
  authCheck,
  fetchUserSharedCreations
);
router.post(
  '/fetch-user-private-creations',
  authCheck,
  fetchUserPrivateCreations
);
router.post('/fetch-user-liked-creations', authCheck, fetchUserLikedCreations);
router.put('/download-creation', downloadCreation);
router.put('/like-creation', authCheck, likeCreation);
router.put('/unlike-creation', authCheck, unlikeCreation);

export default router;
