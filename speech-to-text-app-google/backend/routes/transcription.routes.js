import express from 'express';
import { upload, handleMulterError } from '../config/multer.config.js';
import {
  uploadAndTranscribe,
  getAllTranscriptions,
  getTranscriptionById,
  deleteTranscription,
  getStatistics
} from '../controllers/transcription.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes use optional auth - works for both authenticated and guest users
router.use(optionalAuth);

// Upload and transcribe audio
router.post('/upload', upload.single('audio'), handleMulterError, uploadAndTranscribe);

// Get all transcriptions
router.get('/', getAllTranscriptions);

// Get statistics
router.get('/statistics', getStatistics);

// Get single transcription by ID
router.get('/:id', getTranscriptionById);

// Delete transcription
router.delete('/:id', deleteTranscription);

export default router;

