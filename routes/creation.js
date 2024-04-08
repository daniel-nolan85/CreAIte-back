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

const router = express.Router();

router.post('/create-prompt', createPrompt);
router.post('/create-image', createImage);
router.post('/create-caption', createCaption);
router.post('/create-keywords', createKeywords);
router.post('/save-creation', saveCreation);
router.get('/fetch-all-creations', fetchAllCreations);
router.get('/fetch-shared-creations', fetchSharedCreations);
router.post('/fetch-user-creations', fetchUserCreations);
router.get('/fetch-random-creations', fetchRandomCreations);
router.put('/download-creation', downloadCreation);
router.put('/like-creation', likeCreation);
router.put('/unlike-creation', unlikeCreation);

export default router;
