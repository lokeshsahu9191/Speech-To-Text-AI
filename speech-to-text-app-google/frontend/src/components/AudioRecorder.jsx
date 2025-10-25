import { useState, useRef } from 'react'
import { Mic, Square, Loader2 } from 'lucide-react'
import { uploadAudio } from '../services/api'

export default function AudioRecorder({ onTranscriptionComplete }) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [language, setLanguage] = useState('en-US')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)
  
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      })
      
      // Use appropriate MIME type based on browser support
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4'

      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: mimeType })
        await handleRecordingComplete(audioBlob)
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      setError(null)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

    } catch (err) {
      console.error('Error accessing microphone:', err)
      setError('Could not access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      clearInterval(timerRef.current)
    }
  }

  const handleRecordingComplete = async (audioBlob) => {
    setProcessing(true)
    setError(null)

    try {
      // Convert blob to file
      const extension = audioBlob.type.includes('webm') ? 'webm' : 'mp4'
      const audioFile = new File(
        [audioBlob], 
        `recording-${Date.now()}.${extension}`,
        { type: audioBlob.type }
      )

      const result = await uploadAudio(audioFile, { languageCode: language })
      onTranscriptionComplete(result)
      setRecordingTime(0)
    } catch (err) {
      setError(err.message || 'Failed to transcribe recording')
      console.error('Recording transcription error:', err)
    } finally {
      setProcessing(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-red-100 p-3 rounded-lg">
          <Mic className="w-6 h-6 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Record Audio</h2>
      </div>

      <div className="space-y-4">
        {/* Language Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={isRecording || processing}
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50"
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

        {/* Recording Timer */}
        {isRecording && (
          <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse recording-pulse"></div>
              <span className="text-red-700 font-semibold">Recording...</span>
            </div>
            <p className="text-4xl font-bold text-red-700 font-mono">
              {formatTime(recordingTime)}
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Recording Controls */}
        <div className="flex gap-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              disabled={processing}
              className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg
                hover:from-red-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  Start Recording
                </>
              )}
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex-1 bg-gradient-to-r from-gray-700 to-gray-900 text-white font-semibold py-3 px-6 rounded-lg
                hover:from-gray-800 hover:to-black
                flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Square className="w-5 h-5" />
              Stop Recording
            </button>
          )}
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong className="font-semibold">💡 Tips:</strong> Speak clearly in a quiet environment for best results. 
            Google Cloud AI will automatically add punctuation and format your speech.
          </p>
        </div>
      </div>
    </div>
  )
}

