import Transcription from '../models/Transcription.model.js';
import { transcribeAudio } from '../services/googleSpeech.service.js';
import fs from 'fs';
import path from 'path';

/**
 * Upload and transcribe audio file
 */
export const uploadAndTranscribe = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
        message: 'Please upload an audio file'
      });
    }

    const filePath = req.file.path;
    const { languageCode = 'en-US', sampleRateHertz } = req.body;

    console.log('📝 Processing file:', req.file.originalname);
    console.log('📏 File size:', req.file.size, 'bytes');
    console.log('🎵 MIME type:', req.file.mimetype);

    // Transcribe the audio using Google Cloud Speech-to-Text
    const transcriptionResult = await transcribeAudio(filePath, {
      languageCode,
      sampleRateHertz: sampleRateHertz ? parseInt(sampleRateHertz) : undefined
    });

    // Prepare transcription data
    const transcriptionData = {
      user: req.userId || null, // null for guest users
      fileName: req.file.filename,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      filePath: filePath,
      transcriptionText: transcriptionResult.text,
      confidence: transcriptionResult.confidence,
      language: transcriptionResult.language,
      duration: transcriptionResult.duration,
      status: 'completed',
      metadata: transcriptionResult.metadata
    };

    // Save to MongoDB
    const savedTranscription = await Transcription.create(transcriptionData);

    console.log('✅ Transcription saved to database');

    res.status(200).json({
      success: true,
      message: 'Audio transcribed successfully',
      data: savedTranscription
    });

  } catch (error) {
    console.error('❌ Transcription error:', error);
    
    // Clean up uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
        console.log('🗑️  Cleaned up failed upload');
      } catch (unlinkError) {
        console.error('Failed to clean up file:', unlinkError);
      }
    }

    // Save failed transcription to database
    if (req.file) {
      try {
        await Transcription.create({
          user: req.userId || null,
          fileName: req.file.filename,
          originalName: req.file.originalname,
          fileSize: req.file.size,
          mimeType: req.file.mimetype,
          filePath: req.file.path,
          transcriptionText: '',
          status: 'failed',
          errorMessage: error.message
        });
      } catch (dbError) {
        console.error('Failed to save error record:', dbError);
      }
    }

    res.status(500).json({
      success: false,
      error: 'Transcription failed',
      message: error.message
    });
  }
};

/**
 * Get all transcriptions
 */
export const getAllTranscriptions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build query
    const query = {};
    
    // If user is authenticated, show only their transcriptions
    // Otherwise show only guest transcriptions (user === null)
    if (req.userId) {
      query.user = req.userId;
    } else {
      query.user = null;
    }

    if (status) {
      query.status = status;
    }

    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sort = {};
    sort[sortBy] = order === 'asc' ? 1 : -1;

    // Execute query with pagination
    const [transcriptions, total] = await Promise.all([
      Transcription.find(query)
        .sort(sort)
        .limit(parseInt(limit))
        .skip(skip)
        .populate('user', 'name email')
        .lean(),
      Transcription.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: transcriptions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching transcriptions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transcriptions',
      message: error.message
    });
  }
};

/**
 * Get single transcription by ID
 */
export const getTranscriptionById = async (req, res) => {
  try {
    const { id } = req.params;

    const transcription = await Transcription.findById(id)
      .populate('user', 'name email');

    if (!transcription) {
      return res.status(404).json({
        success: false,
        error: 'Transcription not found'
      });
    }

    // Check ownership
    if (transcription.user && req.userId) {
      if (transcription.user._id.toString() !== req.userId.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Access denied',
          message: 'You can only view your own transcriptions'
        });
      }
    } else if (transcription.user && !req.userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      data: transcription
    });

  } catch (error) {
    console.error('Error fetching transcription:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transcription',
      message: error.message
    });
  }
};

/**
 * Delete transcription
 */
export const deleteTranscription = async (req, res) => {
  try {
    const { id } = req.params;

    const transcription = await Transcription.findById(id);

    if (!transcription) {
      return res.status(404).json({
        success: false,
        error: 'Transcription not found'
      });
    }

    // Check ownership
    if (transcription.user && req.userId) {
      if (transcription.user.toString() !== req.userId.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Access denied',
          message: 'You can only delete your own transcriptions'
        });
      }
    } else if (transcription.user && !req.userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Delete associated audio file
    if (transcription.filePath && fs.existsSync(transcription.filePath)) {
      try {
        fs.unlinkSync(transcription.filePath);
        console.log('🗑️  Deleted audio file:', transcription.fileName);
      } catch (unlinkError) {
        console.error('Failed to delete audio file:', unlinkError);
      }
    }

    // Delete from database
    await Transcription.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Transcription deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting transcription:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete transcription',
      message: error.message
    });
  }
};

/**
 * Get transcription statistics
 */
export const getStatistics = async (req, res) => {
  try {
    const query = req.userId ? { user: req.userId } : { user: null };

    const [total, completed, failed, totalDuration, totalSize] = await Promise.all([
      Transcription.countDocuments(query),
      Transcription.countDocuments({ ...query, status: 'completed' }),
      Transcription.countDocuments({ ...query, status: 'failed' }),
      Transcription.aggregate([
        { $match: query },
        { $group: { _id: null, total: { $sum: '$duration' } } }
      ]),
      Transcription.aggregate([
        { $match: query },
        { $group: { _id: null, total: { $sum: '$fileSize' } } }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalTranscriptions: total,
        completed,
        failed,
        processing: total - completed - failed,
        totalDuration: totalDuration[0]?.total || 0,
        totalSize: totalSize[0]?.total || 0
      }
    });

  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
};

