import mongoose from 'mongoose';

const transcriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow guest users
  },
  fileName: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  transcriptionText: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    default: 0,
    min: 0,
    max: 1
  },
  language: {
    type: String,
    default: 'en-US'
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  wordCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'completed'
  },
  errorMessage: {
    type: String
  },
  metadata: {
    encoding: String,
    sampleRate: Number,
    channels: Number
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
transcriptionSchema.index({ user: 1, createdAt: -1 });
transcriptionSchema.index({ status: 1 });
transcriptionSchema.index({ createdAt: -1 });

// Calculate word count before saving
transcriptionSchema.pre('save', function(next) {
  if (this.transcriptionText) {
    this.wordCount = this.transcriptionText.trim().split(/\s+/).length;
  }
  next();
});

// Virtual for formatted file size
transcriptionSchema.virtual('formattedSize').get(function() {
  const size = this.fileSize;
  if (size < 1024) return size + ' B';
  if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB';
  return (size / (1024 * 1024)).toFixed(2) + ' MB';
});

// Virtual for formatted duration
transcriptionSchema.virtual('formattedDuration').get(function() {
  const duration = this.duration;
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// Ensure virtuals are included when converting to JSON
transcriptionSchema.set('toJSON', { virtuals: true });
transcriptionSchema.set('toObject', { virtuals: true });

export default mongoose.model('Transcription', transcriptionSchema);

