# 🚀 Start Your ZenTasks App with MongoDB

## ⚡ Super Quick Start (3 Steps)

### 1️⃣ Add Your MongoDB Password

Open `.env` file and replace `YOUR_PASSWORD_HERE`:

```env
MONGODB_URI=mongodb+srv://zaidshaikh98848:YOUR_ACTUAL_PASSWORD@cluster0.kgiff2o.mongodb.net/zentasks?retryWrites=true&w=majority&appName=Cluster0
```

### 2️⃣ Install Dependencies (if not done)

```bash
npm install
```

### 3️⃣ Start Everything

```bash
npm start
```

That's it! 🎉

---

## 🌐 Access Your App

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

---

## 🎯 What You'll See

### Terminal Output

**Backend (Port 5000):**
```
✅ Connected to MongoDB Atlas
📊 Database: zentasks
🚀 Server running on http://localhost:5000
📡 API available at http://localhost:5000/api
```

**Frontend (Port 5173):**
```
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Browser

1. Landing page with voice navigation
2. Dashboard with Kanban board
3. Tasks automatically sync to MongoDB
4. Admin dashboard at `/dashboard/admin`
5. AI chat bot (bottom-left button)

---

## 🎮 Try These Features

### 1. Create a Task
- Click "New Task" button
- Fill in details
- Task saves to MongoDB instantly

### 2. Admin Dashboard
- Navigate to http://localhost:5173/dashboard/admin
- View system statistics
- See all users and tasks

### 3. AI Chat Bot
- Click chat button (bottom-left)
- Ask: "What should I work on next?"
- Chat history saves to database

### 4. Test Offline Mode
- Stop the backend server (Ctrl+C)
- App continues working with localStorage
- Restart server to sync back

---

## 🔧 Alternative Start Methods

### Start Backend Only
```bash
npm run server:dev
```

### Start Frontend Only
```bash
npm run dev
```

### Start Both Separately

Terminal 1:
```bash
npm run server:dev
```

Terminal 2:
```bash
npm run dev
```

---

## ✅ Verify Everything Works

### 1. Check Backend
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "ok",
  "message": "ZenTasks API is running",
  "database": "connected"
}
```

### 2. Check Frontend
Open http://localhost:5173 - should see landing page

### 3. Check Database
1. Create a task in the app
2. Go to MongoDB Atlas
3. Browse Collections → zentasks → tasks
4. Your task should appear!

---

## 🐛 Common Issues

### "MongoDB connection error"
**Fix**: Check your password in `.env` file

### "Port 5000 already in use"
**Fix**: Change PORT in `.env` to 5001

### "Using offline mode" toast
**Fix**: Backend isn't running - start it with `npm run server:dev`

### Dependencies missing
**Fix**: Run `npm install` again

---

## 📚 Documentation

- **MONGODB_SETUP.md** - Detailed setup guide
- **MONGODB_INTEGRATION_SUMMARY.md** - What was added
- **SETUP_COMPLETE.md** - Feature overview
- **README.md** - Full documentation

---

## 🎉 You're Ready!

Your full-stack Kanban app with MongoDB is running!

**Features Available:**
- ✅ MongoDB database persistence
- ✅ REST API backend
- ✅ Admin dashboard
- ✅ AI chat bot
- ✅ Offline mode
- ✅ Real-time sync
- ✅ All Tier 1-4 features

**Happy coding!** 🚀
