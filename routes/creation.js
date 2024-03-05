import express from 'express';
import {
  createImage,
  createCaption,
  createCreation,
  fetchCreations,
} from '../controllers/creation.js';

const router = express.Router();

router.post('/create-image', createImage);
router.post('/create-caption', createCaption);
router.post('/create-creation', createCreation);
router.get('/fetch-creations', fetchCreations);

export default router;
