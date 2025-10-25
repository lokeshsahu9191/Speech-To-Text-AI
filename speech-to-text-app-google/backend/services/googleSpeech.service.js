import speech from '@google-cloud/speech';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables FIRST
dotenv.config();

// Set Google Cloud credentials path BEFORE importing any services
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, 'config', 'google-credentials.json');
}
console.log('🔑 Google credentials path:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

// Google Cloud Speech-to-Text client (lazy initialization)
let speechClient = null;
let initializationAttempted = false;

/**
 * Initialize Google Cloud Speech-to-Text client (lazy initialization)
 * This is called when the client is first needed, not at module load time
 */
function initializeSpeechClient() {
  if (initializationAttempted) {
    return speechClient;
  }
  
  initializationAttempted = true;
  
  try {
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      speechClient = new speech.SpeechClient();
      console.log('✅ Google Cloud Speech-to-Text client initialized');
      console.log('🔑 Using credentials:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
    } else {
      console.warn('⚠️  GOOGLE_APPLICATION_CREDENTIALS not set');
      console.warn('⚠️  Please set up Google Cloud credentials to use Speech-to-Text API');
    }
  } catch (error) {
    console.error('❌ Failed to initialize Google Speech client:', error.message);
  }
  
  return speechClient;
}

/**
 * Transcribe audio file using Google Cloud Speech-to-Text API
 * @param {string} filePath - Path to audio file
 * @param {object} options - Transcription options
 * @returns {Promise<object>} Transcription result
 */
export async function transcribeAudio(filePath, options = {}) {
  try {
    // Initialize client if not already initialized (lazy initialization)
    if (!speechClient) {
      initializeSpeechClient();
    }
    
    if (!speechClient) {
      throw new Error('Google Speech client not initialized. Please set GOOGLE_APPLICATION_CREDENTIALS.');
    }

    // Read audio file
    const audioBytes = fs.readFileSync(filePath).toString('base64');
    
    // Get file extension to determine encoding
    const ext = path.extname(filePath).toLowerCase();
    const encoding = getAudioEncoding(ext);
    
    // Configure request
    const audio = {
      content: audioBytes,
    };

    const config = {
      encoding: encoding,
      sampleRateHertz: options.sampleRateHertz || 16000,
      languageCode: options.languageCode || 'en-US',
      enableAutomaticPunctuation: true,
      enableWordTimeOffsets: true,
      enableWordConfidence: true,
      model: 'default', // or 'phone_call', 'command_and_search', 'video'
      useEnhanced: true, // Use enhanced model for better accuracy
      ...options.config
    };

    const request = {
      audio: audio,
      config: config,
    };

    console.log('🎙️  Sending audio to Google Cloud Speech-to-Text...');
    
    // Perform speech recognition
    const [response] = await speechClient.recognize(request);
    
    if (!response.results || response.results.length === 0) {
      throw new Error('No transcription results received from Google Cloud');
    }

    // Process results
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    // Calculate average confidence
    let totalConfidence = 0;
    let confidenceCount = 0;
    
    response.results.forEach(result => {
      if (result.alternatives[0].confidence) {
        totalConfidence += result.alternatives[0].confidence;
        confidenceCount++;
      }
    });
    
    const averageConfidence = confidenceCount > 0 
      ? totalConfidence / confidenceCount 
      : 0;

    // Get word-level details (optional)
    const words = [];
    response.results.forEach(result => {
      if (result.alternatives[0].words) {
        result.alternatives[0].words.forEach(wordInfo => {
          words.push({
            word: wordInfo.word,
            startTime: wordInfo.startTime ? 
              parseFloat(wordInfo.startTime.seconds) + (wordInfo.startTime.nanos / 1e9) : 0,
            endTime: wordInfo.endTime ? 
              parseFloat(wordInfo.endTime.seconds) + (wordInfo.endTime.nanos / 1e9) : 0,
            confidence: wordInfo.confidence || 0
          });
        });
      }
    });

    // Calculate duration from last word's end time
    const duration = words.length > 0 
      ? words[words.length - 1].endTime 
      : 0;

    console.log('✅ Transcription completed successfully');

    return {
      text: transcription,
      confidence: averageConfidence,
      language: config.languageCode,
      duration: duration,
      words: words,
      metadata: {
        encoding: encoding,
        sampleRate: config.sampleRateHertz,
        model: config.model
      }
    };

  } catch (error) {
    console.error('❌ Google Speech-to-Text error:', error.message);
    
    // Handle specific Google Cloud errors
    if (error.code === 3) {
      throw new Error('Invalid audio file format. Please use WAV, MP3, FLAC, or OGG format.');
    } else if (error.code === 7) {
      throw new Error('Permission denied. Please check your Google Cloud credentials.');
    } else if (error.code === 8) {
      throw new Error('API quota exceeded. Please check your Google Cloud billing.');
    }
    
    throw new Error(`Google Speech-to-Text API error: ${error.message}`);
  }
}

/**
 * Get audio encoding from file extension
 * @param {string} ext - File extension
 * @returns {string} Google Cloud encoding type
 */
function getAudioEncoding(ext) {
  const encodingMap = {
    '.wav': 'LINEAR16',
    '.mp3': 'MP3',
    '.flac': 'FLAC',
    '.ogg': 'OGG_OPUS',
    '.webm': 'WEBM_OPUS',
    '.m4a': 'MP3', // M4A is often AAC, but we'll try MP3
    '.mp4': 'MP3'
  };
  
  return encodingMap[ext] || 'LINEAR16';
}

/**
 * Transcribe audio file using streaming API (for longer files)
 * @param {string} filePath - Path to audio file
 * @param {object} options - Transcription options
 * @returns {Promise<object>} Transcription result
 */
export async function transcribeAudioStream(filePath, options = {}) {
  try {
    // Initialize client if not already initialized (lazy initialization)
    if (!speechClient) {
      initializeSpeechClient();
    }
    
    if (!speechClient) {
      throw new Error('Google Speech client not initialized');
    }

    const ext = path.extname(filePath).toLowerCase();
    const encoding = getAudioEncoding(ext);

    const config = {
      encoding: encoding,
      sampleRateHertz: options.sampleRateHertz || 16000,
      languageCode: options.languageCode || 'en-US',
      enableAutomaticPunctuation: true,
    };

    const audio = {
      content: fs.readFileSync(filePath).toString('base64'),
    };

    const request = {
      config: config,
      audio: audio,
    };

    // Use long running recognize for files > 1 minute
    const [operation] = await speechClient.longRunningRecognize(request);
    const [response] = await operation.promise();

    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    const confidence = response.results.reduce((acc, result) => 
      acc + (result.alternatives[0].confidence || 0), 0) / response.results.length;

    return {
      text: transcription,
      confidence: confidence,
      language: config.languageCode,
      duration: 0
    };

  } catch (error) {
    console.error('Streaming transcription error:', error);
    throw new Error(`Streaming transcription failed: ${error.message}`);
  }
}

export default {
  transcribeAudio,
  transcribeAudioStream
};

