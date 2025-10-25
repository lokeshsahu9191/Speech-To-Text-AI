import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===== Auth APIs =====

export const register = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data.data;
};

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data.data;
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data.data;
};

export const updateProfile = async (name, email) => {
  const response = await api.put('/auth/profile', { name, email });
  return response.data.data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const response = await api.put('/auth/change-password', {
    currentPassword,
    newPassword
  });
  return response.data;
};

// ===== Transcription APIs =====

export const uploadAudio = async (file, options = {}) => {
  try {
    const formData = new FormData();
    formData.append('audio', file);
    if (options.languageCode) {
      formData.append('languageCode', options.languageCode);
    }
    if (options.sampleRateHertz) {
      formData.append('sampleRateHertz', options.sampleRateHertz);
    }

    const response = await api.post('/transcription/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getTranscriptions = async (params = {}) => {
  try {
    const response = await api.get('/transcription', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getTranscriptionById = async (id) => {
  try {
    const response = await api.get(`/transcription/${id}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteTranscription = async (id) => {
  try {
    const response = await api.delete(`/transcription/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getStatistics = async () => {
  try {
    const response = await api.get('/transcription/statistics');
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default api;

