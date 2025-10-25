import { useState } from 'react'
import { Upload, Loader2, CheckCircle } from 'lucide-react'
import { uploadAudio } from '../services/api'

export default function AudioUpload({ onTranscriptionComplete }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [language, setLanguage] = useState('en-US')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/webm', 'audio/ogg', 'audio/m4a', 'audio/flac']
      const validExtensions = ['.mp3', '.wav', '.webm', '.ogg', '.m4a', '.flac']
      const ext = '.' + file.name.split('.').pop().toLowerCase()
      
      if (!validTypes.includes(file.type) && !validExtensions.includes(ext)) {
        setError('Please select a valid audio file (MP3, WAV, WEBM, OGG, M4A, FLAC)')
        setSelectedFile(null)
        return
      }
      
      // Validate file size (25MB max)
      if (file.size > 25 * 1024 * 1024) {
        setError('File size must be less than 25MB')
        setSelectedFile(null)
        return
      }

      setSelectedFile(file)
      setError(null)
      setSuccess(false)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first')
      return
    }

    setUploading(true)
    setError(null)
    setSuccess(false)

    try {
      const result = await uploadAudio(selectedFile, { languageCode: language })
      onTranscriptionComplete(result)
      setSuccess(true)
      setSelectedFile(null)
      // Reset file input
      document.getElementById('audio-file-input').value = ''
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.message || 'Failed to transcribe audio')
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-3 rounded-lg">
          <Upload className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Upload Audio File</h2>
      </div>

      <div className="space-y-4">
        {/* File Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Audio File
          </label>
          <input
            id="audio-file-input"
            type="file"
            accept="audio/*"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              cursor-pointer"
          />
          {selectedFile && (
            <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>
                {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          )}
        </div>

        {/* Language Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={uploading}
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="es-ES">Spanish</option>
            <option value="fr-FR">French</option>
            <option value="de-DE">German</option>
            <option value="it-IT">Italian</option>
            <option value="pt-BR">Portuguese (Brazil)</option>
            <option value="zh-CN">Chinese (Mandarin)</option>
            <option value="ja-JP">Japanese</option>
            <option value="ko-KR">Korean</option>
            <option value="hi-IN">Hindi</option>
            <option value="ar-SA">Arabic</option>
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
            <span className="text-red-500 font-bold">✖</span>
            <span>{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>Transcription completed successfully!</span>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg
            hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Transcribing...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Upload & Transcribe
            </>
          )}
        </button>

        {/* Supported Formats */}
        <div className="text-xs text-gray-500 text-center">
          Supported formats: MP3, WAV, WEBM, OGG, M4A, FLAC (max 25MB)
        </div>
      </div>
    </div>
  )
}

