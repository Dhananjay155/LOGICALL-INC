import express from 'express';
import {
  getAllMedia,
  getMediaById,
  createMedia,
  updateMedia,
  deleteMedia
} from '../controllers/mediaController.js';
import { validateMedia } from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All media routes require authentication
router.use(authenticate);

router.get('/', getAllMedia);
router.get('/:id', getMediaById);
router.post('/', validateMedia, createMedia);
router.put('/:id', validateMedia, updateMedia);
router.delete('/:id', deleteMedia);

export default router;