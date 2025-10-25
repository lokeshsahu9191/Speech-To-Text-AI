import { History, Trash2, RefreshCw, FileText } from 'lucide-react'
import { useState } from 'react'
import { deleteTranscription } from '../services/api'

export default function TranscriptionHistory({ transcriptions, onRefresh, loading }) {
  const [deleting, setDeleting] = useState(null)

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transcription?')) {
      return
    }

    setDeleting(id)
    try {
      await deleteTranscription(id)
      onRefresh()
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete transcription')
    } finally {
      setDeleting(null)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!transcriptions || transcriptions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <History className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Transcription History</h2>
        </div>
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No transcriptions yet. Upload or record audio to get started!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <History className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Transcription History</h2>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
            {transcriptions.length}
          </span>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {transcriptions.map((item) => (
          <div
            key={item._id}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {item.originalName}
                  </h3>
                  <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs font-medium">
                    {item.language || 'en-US'}
                  </span>
                </div>
                
                <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                  {item.transcriptionText}
                </p>
                
                <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                  <span>📅 {formatDate(item.createdAt)}</span>
                  <span>⏱️ {item.duration?.toFixed(1)}s</span>
                  <span>📊 {(item.confidence * 100).toFixed(1)}%</span>
                  <span>📝 {item.wordCount || 0} words</span>
                  <span>💾 {(item.fileSize / 1024).toFixed(1)} KB</span>
                </div>
              </div>

              <button
                onClick={() => handleDelete(item._id)}
                disabled={deleting === item._id}
                className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                title="Delete transcription"
              >
                {deleting === item._id ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

