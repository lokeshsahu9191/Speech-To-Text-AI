import { FileText, Copy, CheckCircle, Clock, Award } from 'lucide-react'
import { useState } from 'react'

export default function TranscriptionResult({ transcription }) {
  const [copied, setCopied] = useState(false)

  if (!transcription) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(transcription.transcriptionText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Transcription Result</h2>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          {copied ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-xs text-blue-600 font-medium mb-1">File Name</p>
          <p className="text-sm text-gray-800 font-semibold truncate">{transcription.originalName}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-green-600" />
            <p className="text-xs text-green-600 font-medium">Confidence</p>
          </div>
          <p className="text-sm text-gray-800 font-semibold">{(transcription.confidence * 100).toFixed(1)}%</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-xs text-purple-600 font-medium mb-1">Duration</p>
          <p className="text-sm text-gray-800 font-semibold">{transcription.duration?.toFixed(1)}s</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <p className="text-xs text-orange-600 font-medium mb-1">Words</p>
          <p className="text-sm text-gray-800 font-semibold">{transcription.wordCount || 0}</p>
        </div>
      </div>

      {/* Transcription Text */}
      <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
        <p className="text-gray-900 text-lg leading-relaxed whitespace-pre-wrap">
          {transcription.transcriptionText}
        </p>
      </div>

      {/* Timestamp */}
      {transcription.createdAt && (
        <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Transcribed on {formatDate(transcription.createdAt)}</span>
        </div>
      )}
    </div>
  )
}

