# Speech-to-Text Application with Google Cloud AI

A full-stack MERN application that converts speech to text using Google Cloud Speech-to-Text API. Upload audio files or record directly from your browser, with support for 12+ languages and real-time transcription.

![MERN Stack](https://img.shields.io/badge/MERN-Stack-green) ![Google Cloud](https://img.shields.io/badge/Google-Cloud-blue) ![React](https://img.shields.io/badge/React-18.2-blue) ![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)

## 🚀 Features

- 🎤 **Audio Recording**: Record audio directly from browser with real-time timer
- 📁 **File Upload**: Upload audio files (MP3, WAV, WEBM, OGG, M4A, FLAC)
- 🌍 **Multi-Language**: Support for 12+ languages including English, Spanish, French, Chinese, etc.
- 🤖 **Google Cloud AI**: High-accuracy transcription with Google Speech-to-Text API
- 🔐 **Authentication**: User registration and login with JWT
- 💾 **MongoDB Storage**: Store transcriptions in MongoDB with full CRUD operations
- 📊 **Statistics Dashboard**: Track your transcription history and usage
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- 📱 **Mobile-Friendly**: Works on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

**Frontend:**
- React 18 with Vite
- Tailwind CSS
- React Router DOM
- Lucide Icons
- Axios

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- Google Cloud Speech-to-Text API
- JWT Authentication
- Multer for file uploads

**APIs:**
- Google Cloud Speech-to-Text

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **Google Cloud Account** with Speech-to-Text API enabled
- **npm** or **yarn**

## 🔧 Installation

### 1. Clone or Navigate to Project

```bash
cd speech-to-text-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

#### Configure Environment Variables

Create `.env` file in `backend` directory:

```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/speech-to-text
# Or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/speech-to-text

# Google Cloud Speech-to-Text
GOOGLE_APPLICATION_CREDENTIALS=./config/google-credentials.json

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

#### Setup Google Cloud Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Speech-to-Text API**:
   - Go to APIs & Services → Library
   - Search for "Cloud Speech-to-Text API"
   - Click "Enable"

4. Create Service Account:
   - Go to IAM & Admin → Service Accounts
   - Click "Create Service Account"
   - Give it a name (e.g., "speech-to-text-service")
   - Grant role: "Cloud Speech Client"
   - Click "Done"

5. Create JSON Key:
   - Click on the service account
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose JSON format
   - Download the file

6. Save the JSON file:
   - Create `backend/config` directory if it doesn't exist
   - Save downloaded file as `backend/config/google-credentials.json`

#### Start Backend

```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

Open new terminal:

```bash
cd frontend
npm install
```

#### Configure Environment Variables

Create `.env` file in `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

#### Start Frontend

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🎯 Usage

### First Time Setup

1. **Register an account** at `http://localhost:5173/register`
   - Or use as guest (limited features)

2. **Upload Audio** or **Record** directly
   - Choose your language
   - Click "Upload & Transcribe" or "Start Recording"

3. **View Results**
   - See transcription with confidence score
   - View word count and duration
   - Copy text to clipboard

4. **Browse History**
   - View all past transcriptions
   - Filter and search
   - Delete old transcriptions

### Supported Languages

- English (US, UK)
- Spanish
- French
- German
- Italian
- Portuguese (Brazil)
- Chinese (Mandarin)
- Japanese
- Korean
- Hindi
- Arabic
- And many more!

## 📁 Project Structure

```
speech-to-text-app/
├── backend/
│   ├── config/
│   │   ├── database.js              # MongoDB connection
│   │   ├── multer.config.js         # File upload config
│   │   └── google-credentials.json  # Google Cloud credentials (you create this)
│   ├── controllers/
│   │   ├── auth.controller.js       # Authentication logic
│   │   └── transcription.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js       # JWT authentication
│   ├── models/
│   │   ├── User.model.js
│   │   └── Transcription.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── transcription.routes.js
│   ├── services/
│   │   └── googleSpeech.service.js  # Google API integration
│   ├── uploads/                     # Uploaded audio files
│   ├── .env                         # Environment variables
│   ├── package.json
│   └── server.js                    # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── AudioUpload.jsx
│   │   │   ├── AudioRecorder.jsx
│   │   │   ├── TranscriptionResult.jsx
│   │   │   └── TranscriptionHistory.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Authentication state
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── services/
│   │   │   └── api.js               # API client
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get user profile (protected) |
| PUT | `/api/auth/profile` | Update profile (protected) |
| PUT | `/api/auth/change-password` | Change password (protected) |

### Transcription

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/transcription/upload` | Upload & transcribe audio |
| GET | `/api/transcription` | Get all transcriptions |
| GET | `/api/transcription/:id` | Get single transcription |
| DELETE | `/api/transcription/:id` | Delete transcription |
| GET | `/api/transcription/statistics` | Get user statistics |

## 💰 Google Cloud Pricing

Google Cloud Speech-to-Text API pricing:

- **First 60 minutes/month**: FREE
- **After 60 minutes**: $0.006 per 15 seconds (~$0.024 per minute)
- **Enhanced models**: $0.009 per 15 seconds

Example: 1000 minutes = ~$15-24/month

[See full pricing](https://cloud.google.com/speech-to-text/pricing)

## 🐛 Troubleshooting

### Backend Issues

**MongoDB connection fails:**
- Check if MongoDB is running: `mongod`
- Verify `MONGODB_URI` in `.env`
- For MongoDB Atlas, whitelist your IP address

**Google API errors:**
- Verify credentials file exists at `backend/config/google-credentials.json`
- If you see "Google Speech client not initialized" error:
  - The app now automatically uses `./config/google-credentials.json` if `GOOGLE_APPLICATION_CREDENTIALS` is not set
  - Make sure the credentials file is in the correct location
  - Restart the backend server after placing the credentials file
- Check if Speech-to-Text API is enabled in Google Cloud Console
- Ensure service account has "Cloud Speech Client" role
- Verify the credentials JSON file is valid (not corrupted)

### Frontend Issues

**Can't connect to backend:**
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Verify CORS settings in backend

**Microphone not working:**
- Click padlock icon in browser address bar
- Allow microphone permission
- Use HTTPS or localhost (required for MediaRecorder API)

## 🚀 Deployment

### Backend (Render/Railway)

1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variables in dashboard
4. Deploy!

### Frontend (Netlify/Vercel)

1. Build project: `npm run build`
2. Deploy `dist` folder to Netlify/Vercel
3. Set `VITE_API_URL` to your deployed backend URL

## 📚 Learning Resources

- [Google Cloud Speech-to-Text Docs](https://cloud.google.com/speech-to-text/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🎓 2-Week Learning Plan

Follow the structured plan provided to build this project step-by-step over 2 weeks.

### Week 1: Core Functionality
- Day 1-2: Setup and Backend
- Day 3: Database
- Day 4: Google API Integration
- Day 5-7: Frontend Development

### Week 2: Polish and Deploy
- Day 8-9: UI Enhancement
- Day 10: Authentication
- Day 11-12: Deployment
- Day 13-14: Testing & Documentation

## 📞 Support

For issues and questions:
- Check this README
- Review error messages in browser console and terminal
- Check Google Cloud console for API errors
- Open an issue on GitHub

---

**Built with ❤️ using MERN Stack and Google Cloud AI**

