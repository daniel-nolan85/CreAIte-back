import express from 'express';
import {
  createImage,
  createCaption,
  createKeywords,
  saveCreation,
  fetchSharedCreations,
  fetchUserCreations,
  downloadCreation,
  likeCreation,
  unlikeCreation,
} from '../controllers/creation.js';

const router = express.Router();

router.post('/create-image', createImage);
router.post('/create-caption', createCaption);
router.post('/create-keywords', createKeywords);
router.post('/save-creation', saveCreation);
router.get('/fetch-shared-creations', fetchSharedCreations);
router.post('/fetch-user-creations', fetchUserCreations);
router.put('/download-creation', downloadCreation);
router.put('/like-creation', likeCreation);
router.put('/unlike-creation', unlikeCreation);

export default router;
