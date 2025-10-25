import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { User, Mail, BarChart3 } from 'lucide-react'
import { getStatistics } from '../services/api'

export default function ProfilePage() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStatistics()
  }, [])

  const loadStatistics = async () => {
    try {
      const data = await getStatistics()
      setStats(data)
    } catch (error) {
      console.error('Error loading statistics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {user?.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-600 font-medium mb-1">Member Since</p>
            <p className="text-lg font-bold text-gray-900">
              {new Date(user?.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-600 font-medium mb-1">Account Status</p>
            <p className="text-lg font-bold text-gray-900">
              {user?.isActive ? 'Active' : 'Inactive'}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-purple-600 font-medium mb-1">Role</p>
            <p className="text-lg font-bold text-gray-900 capitalize">
              {user?.role}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Usage Statistics</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-6">
              <p className="text-sm text-blue-600 font-medium mb-2">Total Transcriptions</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalTranscriptions || 0}</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6">
              <p className="text-sm text-green-600 font-medium mb-2">Completed</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.completed || 0}</p>
            </div>
            
            <div className="bg-red-50 rounded-lg p-6">
              <p className="text-sm text-red-600 font-medium mb-2">Failed</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.failed || 0}</p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-6">
              <p className="text-sm text-purple-600 font-medium mb-2">Total Duration</p>
              <p className="text-xl font-bold text-gray-900">{formatDuration(stats?.totalDuration || 0)}</p>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-6">
              <p className="text-sm text-orange-600 font-medium mb-2">Total Size</p>
              <p className="text-xl font-bold text-gray-900">{formatSize(stats?.totalSize || 0)}</p>
            </div>
            
            <div className="bg-indigo-50 rounded-lg p-6">
              <p className="text-sm text-indigo-600 font-medium mb-2">Processing</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.processing || 0}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

