import { useState, useEffect } from 'react'
import AudioUpload from '../components/AudioUpload'
import AudioRecorder from '../components/AudioRecorder'
import TranscriptionResult from '../components/TranscriptionResult'
import TranscriptionHistory from '../components/TranscriptionHistory'
import { getTranscriptions } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function HomePage() {
  const [currentTranscription, setCurrentTranscription] = useState(null)
  const [transcriptions, setTranscriptions] = useState([])
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    loadTranscriptions()
  }, [isAuthenticated])

  const loadTranscriptions = async () => {
    setLoading(true)
    try {
      const response = await getTranscriptions({ page: 1, limit: 20 })
      setTranscriptions(response.data || [])
    } catch (error) {
      console.error('Error loading transcriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTranscriptionComplete = (transcription) => {
    setCurrentTranscription(transcription)
    loadTranscriptions()
    
    // Scroll to result
    setTimeout(() => {
      document.getElementById('result')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Speech-to-Text with
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Google Cloud AI</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Convert your audio to text with high accuracy using Google Cloud's powerful Speech-to-Text API.
          Upload files or record directly from your browser.
        </p>
        {!isAuthenticated && (
          <p className="mt-4 text-sm text-gray-500">
            💡 Tip: <a href="/register" className="text-blue-600 hover:underline">Create an account</a> to save your transcriptions
          </p>
        )}
      </div>

      {/* Upload and Record Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AudioUpload onTranscriptionComplete={handleTranscriptionComplete} />
        <AudioRecorder onTranscriptionComplete={handleTranscriptionComplete} />
      </div>

      {/* Current Transcription Result */}
      <div id="result">
        <TranscriptionResult transcription={currentTranscription} />
      </div>

      {/* Transcription History */}
      <TranscriptionHistory
        transcriptions={transcriptions}
        onRefresh={loadTranscriptions}
        loading={loading}
      />
    </div>
  )
}

