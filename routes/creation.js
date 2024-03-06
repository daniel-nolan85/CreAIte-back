import express from 'express';
import {
  createImage,
  createCaption,
  createCreation,
  fetchCreations,
  fetchUserCreations,
} from '../controllers/creation.js';

const router = express.Router();

router.post('/create-image', createImage);
router.post('/create-caption', createCaption);
router.post('/create-creation', createCreation);
router.get('/fetch-creations', fetchCreations);
router.post('/fetch-user-creations', fetchUserCreations);

export default router;
