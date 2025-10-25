# ⚡ Quick Start Guide - Speech-to-Text with Google Cloud

Get your Speech-to-Text application running in 15 minutes!

## 📋 Prerequisites Checklist

- [ ] Node.js v18+ installed
- [ ] MongoDB installed (or MongoDB Atlas account)
- [ ] Google Cloud account with billing enabled

---

## 🚀 Setup Steps

### Step 1: Install Dependencies (5 minutes)

```bash
# Backend
cd backend
npm install

# Frontend (new terminal)
cd frontend
npm install
```

### Step 2: Setup Google Cloud (5 minutes)

#### A. Create Project & Enable API

1. Go to https://console.cloud.google.com/
2. Create new project (or select existing)
3. Enable Speech-to-Text API:
   - Go to **APIs & Services** → **Library**
   - Search "Cloud Speech-to-Text API"
   - Click **Enable**

#### B. Create Service Account

1. Go to **IAM & Admin** → **Service Accounts**
2. Click **Create Service Account**
3. Name: `speech-to-text-service`
4. Grant role: **Cloud Speech Client**
5. Click **Done**

#### C. Download Credentials

1. Click on the service account you just created
2. Go to **Keys** tab
3. Click **Add Key** → **Create new key**
4. Choose **JSON** format
5. Click **Create** (file downloads automatically)

#### D. Save Credentials

1. Create folder: `backend/config/`
2. Move downloaded JSON file to: `backend/config/google-credentials.json`

### Step 3: Setup MongoDB (2 minutes)

**Option A: Local MongoDB**
```bash
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create free cluster (M0)
3. Get connection string
4. Replace in `.env` file

### Step 4: Configure Environment (1 minute)

Backend `.env` is already created with default values. Just verify:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/speech-to-text
GOOGLE_APPLICATION_CREDENTIALS=./config/google-credentials.json
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_please
FRONTEND_URL=http://localhost:5173
```

### Step 5: Start the Application (1 minute)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Expected output:
```
✅ MongoDB Connected: localhost
📦 Database: speech-to-text
✅ Google Cloud Speech-to-Text client initialized
🚀 Server is running on port 5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Expected output:
```
➜  Local:   http://localhost:5173/
```

### Step 6: Test It! (1 minute)

1. **Open browser**: http://localhost:5173
2. **Click "Start Recording"**
3. **Allow microphone** access
4. **Speak clearly**: "Hello, this is a test of the speech to text system"
5. **Click "Stop Recording"**
6. **Wait 3-5 seconds**
7. **See your transcription!** ✨

---

## 🎯 What You Can Do

### ✅ Upload Audio Files
- Supported: MP3, WAV, WEBM, OGG, M4A, FLAC
- Max size: 25MB
- 12+ languages supported

### ✅ Record Audio
- Direct browser recording
- Real-time timer
- Automatic transcription

### ✅ User Accounts
- Register and login
- Save transcription history
- View statistics

### ✅ View History
- See all past transcriptions
- Filter and search
- Delete old transcriptions

---

## 🐛 Troubleshooting

### Backend won't start

**Problem:** MongoDB connection error
```
❌ MongoDB connection error: connect ECONNREFUSED
```

**Solutions:**
1. Check if MongoDB is running: `mongod`
2. Verify `MONGODB_URI` in `.env`
3. For Atlas, check connection string format

---

**Problem:** Google API error
```
❌ Failed to initialize Google Speech client
❌ Google Speech client not initialized. Please set GOOGLE_APPLICATION_CREDENTIALS.
```

**Solutions:**
1. Check if `google-credentials.json` exists in `backend/config/`
2. The app now automatically uses `./config/google-credentials.json` - no need to set environment variable manually
3. Restart the backend server after placing the credentials file
4. Verify Speech-to-Text API is enabled in Google Cloud Console
5. Check service account has "Cloud Speech Client" role
6. Ensure the JSON file is valid and not corrupted

---

### Frontend issues

**Problem:** Can't connect to backend
```
Network Error
```

**Solutions:**
1. Ensure backend is running on port 5000
2. Check browser console for errors
3. Verify `VITE_API_URL` in frontend `.env`

---

**Problem:** Microphone not working

**Solutions:**
1. Click padlock icon in browser address bar
2. Allow microphone permission
3. Try Chrome or Edge (best compatibility)
4. Check microphone is not used by another app

---

## 💰 Google Cloud Costs

- **First 60 minutes/month**: FREE ✨
- **After 60 minutes**: ~$0.024 per minute
- **Example**: 1000 minutes = ~$15-24/month

💡 **Tip**: Start with the free tier to test!

---

## 📚 Next Steps

### After Setup:
1. ✅ Create an account (Register page)
2. ✅ Test with different languages
3. ✅ Upload various audio files
4. ✅ Check your statistics (Profile page)

### Deployment:
- Follow `README.md` for production deployment
- Use environment-specific credentials
- Set up monitoring and backups

---

## 🎓 Features by Week

### Week 1 ✅
- [x] Project setup
- [x] Backend with Express.js
- [x] MongoDB database
- [x] Google Speech-to-Text integration
- [x] Frontend with React & Tailwind
- [x] Audio recording
- [x] File upload

### Week 2 ✅
- [x] Enhanced UI
- [x] Error handling
- [x] User authentication
- [x] Statistics dashboard
- [x] Complete documentation

---

## 💡 Pro Tips

1. **Best Audio Quality**: Use WAV or FLAC format
2. **Quiet Environment**: Reduces transcription errors
3. **Clear Speech**: Speak at normal pace
4. **Language Selection**: Choose correct language for best accuracy
5. **File Size**: Keep under 10MB for faster processing

---

## 📞 Getting Help

1. Check console logs (both terminals)
2. Read error messages carefully
3. Review `README.md` for detailed docs
4. Check Google Cloud Console for API status
5. Verify all environment variables

---

## 🎉 You're Ready!

Your Speech-to-Text application is now running with Google Cloud AI!

**Project Location:**
```
C:\Work Space\WhislebMain\main\speech-to-text-app
```

**Access Points:**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API Docs: See README.md

---

**Happy Transcribing! 🎙️✨**

