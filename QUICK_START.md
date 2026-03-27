# ZenTasks - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Configure MongoDB (2 minutes)

1. Open `.env` file
2. Update your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://zaidshaikh98848:YOUR_PASSWORD@cluster0.kgiff2o.mongodb.net/zentasks?retryWrites=true&w=majority&appName=Cluster0
```

Replace `YOUR_PASSWORD` with your actual MongoDB Atlas password.

### Step 2: Install Dependencies (2 minutes)

```bash
npm install
```

### Step 3: Start Application (1 minute)

```bash
npm start
```

This starts:
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

### Step 4: Verify It Works

1. Open browser: http://localhost:5173
2. Click "Get Started"
3. Click "New Task"
4. Create a test task
5. ✅ Done!

---

## 📊 What You Get

### Features
- ✅ Drag & drop Kanban board
- ✅ MongoDB Atlas database
- ✅ AI task sorting
- ✅ Focus Mode (Pomodoro timer)
- ✅ Voice task creation
- ✅ AI chat bot
- ✅ Standup generator
- ✅ Analytics dashboard
- ✅ Keyboard shortcuts
- ✅ Offline mode

### Pages
- **Dashboard** - Main Kanban board
- **Analytics** - Charts and statistics
- **Settings** - User preferences
- **Admin** - System management

---

## 🔧 Common Commands

```bash
# Start everything
npm start

# Start backend only
npm run server:dev

# Start frontend only
npm run dev

# Build for production
npm run build

# Check backend health
curl http://localhost:5000/api/health
```

---

## 🐛 Quick Troubleshooting

### Backend won't start?
- Check `.env` has correct MongoDB password
- Verify IP is whitelisted in MongoDB Atlas
- Check port 5000 is not in use

### Frontend won't connect?
- Verify backend is running: http://localhost:5000/api/health
- Check browser console (F12) for errors
- Clear browser cache and reload

### Tasks not saving?
- Check MongoDB connection in server terminal
- Look for "✅ Connected to MongoDB Atlas"
- If offline, tasks save to localStorage

---

## 📚 Full Documentation

- **COMPLETE_SETUP_GUIDE.md** - Detailed setup instructions
- **TECHNICAL_DOCUMENTATION.md** - Complete technical reference
- **MONGODB_SETUP.md** - MongoDB Atlas configuration
- **FEATURES.md** - Feature list and descriptions

---

## 🎯 Quick Test

After starting, test these:

1. ✅ Create task
2. ✅ Drag task between columns
3. ✅ Click "AI Sort"
4. ✅ Open Focus Mode
5. ✅ Chat with AI bot
6. ✅ View Analytics page

---

## 🔗 Important URLs

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health
- MongoDB Atlas: https://cloud.mongodb.com
- GitHub Repo: https://github.com/zaidshaikh987/Zen-Task

---

## 💡 Pro Tips

1. Use `npm start` to run both servers at once
2. Press `N` to quickly create new task
3. Press `F` to open Focus Mode
4. Press `S` to generate standup
5. Press `?` to see all keyboard shortcuts
6. Drag tasks to trash zone to delete
7. Click "AI Sort" to auto-organize tasks

---

## 📞 Need Help?

1. Check server terminal for errors
2. Check browser console (F12)
3. Review COMPLETE_SETUP_GUIDE.md
4. Verify MongoDB Atlas connection
5. Restart both servers

---

**Ready to build amazing things! 🎉**
