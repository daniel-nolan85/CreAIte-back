import express from 'express';
import formidable from 'express-formidable';
import {
  uploadMediaToCloudinary,
  destroyMediaFromCloudinary,
} from '../controllers/cloudinary.js';
import { authCheck } from '../middleware/auth.js';

const router = express.Router();

router.post(
  '/upload-media',
  formidable({ maxFileSize: 5 * 1024 * 1024 }),
  uploadMediaToCloudinary
);
router.post('/destroy-media', authCheck, destroyMediaFromCloudinary);

export default router;
