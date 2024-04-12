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
router.get('/fetch-shared-creations', fetchSharedCreations);
router.post('/fetch-user-creations', authCheck, fetchUserCreations);
router.get('/fetch-random-creations', fetchRandomCreations);
router.put('/download-creation', downloadCreation);
router.put('/like-creation', authCheck, likeCreation);
router.put('/unlike-creation', authCheck, unlikeCreation);

export default router;
