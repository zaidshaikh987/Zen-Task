# Complete Setup Guide - ZenTasks

## Step-by-Step: From Zero to Running Application

---

## Prerequisites

Before starting, ensure you have:

- ✅ Node.js (v18 or higher) - [Download](https://nodejs.org/)
- ✅ npm (comes with Node.js)
- ✅ Git (optional, for cloning)
- ✅ MongoDB Atlas account (free) - [Sign up](https://www.mongodb.com/cloud/atlas/register)
- ✅ Code editor (VS Code recommended)

---

## Part 1: MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with email or Google
3. Choose "Free" tier (M0 Sandbox)
4. Select cloud provider (AWS recommended)
5. Choose region closest to you
6. Click "Create Cluster"

**Wait 3-5 minutes for cluster creation**

### Step 2: Create Database User

1. In Atlas dashboard, click "Database Access" (left sidebar)
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Set username: `zaidshaikh98848`
5. Set password: `pass123` (or your own - remember it!)
6. Set role: "Atlas admin" or "Read and write to any database"
7. Click "Add User"

### Step 3: Whitelist IP Address

1. Click "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Choose one:
   - **Option A (Development):** Click "Allow Access from Anywhere" → `0.0.0.0/0`
   - **Option B (Secure):** Click "Add Current IP Address"
4. Click "Confirm"

**Wait 1-2 minutes for changes to apply**

### Step 4: Get Connection String

1. Click "Database" (left sidebar)
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. Select "Driver: Node.js" and "Version: 5.5 or later"
5. Copy the connection string:

```
mongodb+srv://zaidshaikh98848:<password>@cluster0.kgiff2o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

6. Replace `<password>` with your actual password
7. Add database name before the `?`:

```
mongodb+srv://zaidshaikh98848:pass123@cluster0.kgiff2o.mongodb.net/zentasks?retryWrites=true&w=majority&appName=Cluster0
```

---

## Part 2: Project Setup

### Step 1: Clone or Download Project

**Option A: Clone from GitHub**
```bash
git clone https://github.com/zaidshaikh987/Zen-Task.git
cd Zen-Task
```

**Option B: Download ZIP**
1. Download project ZIP
2. Extract to folder
3. Open terminal in that folder

### Step 2: Install Dependencies

```bash
# Install all dependencies (frontend + backend)
npm install
```

**This installs:**
- React and related packages
- Express and MongoDB drivers
- All UI libraries
- Development tools

**Wait 2-3 minutes for installation**

### Step 3: Configure Environment Variables

1. Open the `.env` file in root directory
2. Update with your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://zaidshaikh98848:pass123@cluster0.kgiff2o.mongodb.net/zentasks?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
NODE_ENV=development
JWT_SECRET=zentasks-secret-key-2024-change-in-production
```

**Important:** Replace `pass123` with your actual MongoDB password!

3. Save the file

---

## Part 3: Starting the Application

### Method 1: Start Everything at Once (Recommended)

```bash
npm start
```

**This command:**
- Starts backend server on port 5000
- Starts frontend dev server on port 5173
- Runs both concurrently

**You should see:**
```
[0] 
[0] > zentasks-kanban@1.0.0 server:dev
[0] > nodemon server/server.js
[0] 
[1] 
[1] > zentasks-kanban@1.0.0 dev
[1] > vite
[1] 
[0] 🚀 Server running on http://localhost:5000
[0] 📡 API available at http://localhost:5000/api
[0] ✅ Connected to MongoDB Atlas
[0] 📊 Database: zentasks
[1] 
[1]   VITE v6.4.1  ready in 1234 ms
[1] 
[1]   ➜  Local:   http://localhost:5173/
[1]   ➜  Network: use --host to expose
```

### Method 2: Start Separately (For Debugging)

**Terminal 1 - Backend:**
```bash
npm run server:dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

---

## Part 4: Verify Everything Works

### Step 1: Check Backend Health

Open browser and go to:
```
http://localhost:5000/api/health
```

**Expected response:**
```json
{
  "status": "ok",
  "message": "ZenTasks API is running",
  "database": "connected"
}
```

✅ If you see this, backend is working!

❌ If you see error:
- Check MongoDB connection string in `.env`
- Verify IP is whitelisted in Atlas
- Check server terminal for error messages

### Step 2: Check Frontend

Open browser and go to:
```
http://localhost:5173
```

**You should see:**
- Landing page with "ZenTasks" branding
- "Get Started" button
- Smooth animations

✅ Click "Get Started" → Should navigate to dashboard

### Step 3: Test Task Creation

1. Click "New Task" button (top right)
2. Fill in:
   - Title: "Test MongoDB Connection"
   - Description: "Verify database is working"
   - Priority: High
   - Status: To Do
3. Click "Create Task"

**Expected:**
- Toast notification: "Task created!"
- Task appears in "To Do" column
- Task is saved to MongoDB

### Step 4: Verify in MongoDB Atlas

1. Go to MongoDB Atlas dashboard
2. Click "Browse Collections"
3. Select database: `zentasks`
4. Select collection: `tasks`
5. You should see your task document!

```json
{
  "_id": "65f8a1b2c3d4e5f6g7h8i9j0",
  "title": "Test MongoDB Connection",
  "description": "Verify database is working",
  "status": "todo",
  "priority": "high",
  "userId": "default-user",
  "createdAt": "2026-03-27T...",
  "updatedAt": "2026-03-27T..."
}
```

---

## Part 5: Understanding the Connection Flow

### How Data Flows from Frontend to MongoDB

```
1. User clicks "Create Task"
   ↓
2. React component calls createTask()
   ↓
3. KanbanContext.jsx → tasksAPI.create()
   ↓
4. Axios sends HTTP POST to http://localhost:5000/api/tasks
   ↓
5. Express server receives request
   ↓
6. server/routes/tasks.js → POST handler
   ↓
7. Creates new Task model instance
   ↓
8. Mongoose validates data against schema
   ↓
9. Mongoose sends command to MongoDB Atlas
   ↓
10. MongoDB Atlas saves document
   ↓
11. MongoDB returns saved document with _id
   ↓
12. Express sends response back to frontend
   ↓
13. Frontend updates state with new task
   ↓
14. React re-renders UI with new task
```

### Connection Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Your Computer                         │
│                                                          │
│  ┌──────────────┐              ┌──────────────┐        │
│  │   Browser    │              │   Terminal   │        │
│  │              │              │              │        │
│  │ React App    │◄────────────►│ Express      │        │
│  │ Port 5173    │   Axios      │ Server       │        │
│  │              │   HTTP       │ Port 5000    │        │
│  └──────────────┘              └──────┬───────┘        │
│                                        │                │
└────────────────────────────────────────┼────────────────┘
                                         │
                                         │ Mongoose
                                         │ MongoDB Driver
                                         │
                                         ▼
                              ┌──────────────────┐
                              │  MongoDB Atlas   │
                              │  (Cloud)         │
                              │                  │
                              │  Database:       │
                              │  zentasks        │
                              │                  │
                              │  Collections:    │
                              │  - tasks         │
                              │  - users         │
                              │  - chatmessages  │
                              └──────────────────┘
```


---

## Part 6: Troubleshooting Connection Issues

### Issue 1: "MongoServerError: bad auth"

**Cause:** Wrong password in connection string

**Solution:**
1. Open `.env` file
2. Check password matches MongoDB Atlas user password
3. If password has special characters, URL encode them:
   - `@` → `%40`
   - `#` → `%23`
   - `$` → `%24`
   - `%` → `%25`

**Example:**
```env
# If password is: p@ss#123
MONGODB_URI=mongodb+srv://user:p%40ss%23123@cluster.mongodb.net/zentasks
```

### Issue 2: "MongoServerError: IP not whitelisted"

**Cause:** Your IP address is not allowed to connect

**Solution:**
1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Wait 1-2 minutes
5. Restart server: `npm start`

### Issue 3: "ECONNREFUSED 127.0.0.1:5000"

**Cause:** Backend server not running

**Solution:**
```bash
# Check if server is running
# You should see: "Server running on http://localhost:5000"

# If not, start it:
npm run server:dev
```

### Issue 4: "Cannot GET /api/tasks"

**Cause:** Wrong API URL or CORS issue

**Solution:**
1. Check `src/lib/api.js`:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

2. Check server has CORS enabled:
```javascript
// server/server.js
app.use(cors());
```

### Issue 5: Tasks Not Saving

**Check these in order:**

1. **Is backend running?**
   ```bash
   # Visit: http://localhost:5000/api/health
   # Should return: {"status":"ok","database":"connected"}
   ```

2. **Is MongoDB connected?**
   ```bash
   # Check server terminal for:
   # ✅ Connected to MongoDB Atlas
   ```

3. **Check browser console:**
   ```
   Press F12 → Console tab
   Look for errors
   ```

4. **Check Network tab:**
   ```
   Press F12 → Network tab
   Create a task
   Look for POST request to /api/tasks
   Check response status (should be 201)
   ```

### Issue 6: "Using offline mode" Toast

**Cause:** Frontend can't reach backend

**Solution:**
1. Verify backend is running on port 5000
2. Check no firewall blocking localhost
3. Try accessing: http://localhost:5000/api/health
4. If it works, refresh frontend page

---

## Part 7: Testing All Features

### Test 1: Create Task
```
1. Click "New Task"
2. Fill form
3. Click "Create Task"
✅ Task appears in column
✅ Toast: "Task created!"
```

### Test 2: Drag & Drop
```
1. Drag task from "To Do"
2. Drop in "Doing"
✅ Task moves to new column
✅ Position updates in database
```

### Test 3: Delete Task
```
1. Drag task to trash zone (bottom)
2. Release
✅ Task disappears
✅ Toast: "Task deleted"
```

### Test 4: AI Sort
```
1. Click "AI Sort" button on column
2. Wait 1-2 seconds
✅ Tasks reorder by priority
✅ Toast: "AI sorted! Sorted by priority, age, and title"
```

### Test 5: Focus Mode
```
1. Click "Focus" button (top bar)
2. Click "Start"
✅ Timer counts down from 25:00
✅ Can pause/resume
```

### Test 6: Voice Input
```
1. Click microphone icon (top bar)
2. Click "Start Recording"
3. Say: "Create high priority task: Test voice"
✅ Task created from voice
✅ Toast: "Task created from voice!"
```

### Test 7: AI Chat Bot
```
1. Click pink chat button (bottom right)
2. Type: "What should I work on next?"
3. Press Enter
✅ AI responds with suggestion
✅ Message saved to database
```

### Test 8: Standup Generator
```
1. Click "Standup" button (top bar)
2. Click "Generate Standup"
✅ Shows yesterday's completed tasks
✅ Shows today's in-progress tasks
✅ Shows blockers (old tasks)
```

### Test 9: Analytics Page
```
1. Click "Analytics" in sidebar
✅ Shows task statistics
✅ Shows completion rate
✅ Shows charts and graphs
```

### Test 10: Offline Mode
```
1. Stop backend server (Ctrl+C in server terminal)
2. Try creating a task
✅ Toast: "Task created (offline)"
✅ Task saved to localStorage
✅ Works without server
```

---

## Part 8: MongoDB Collections Explained

### Collection 1: tasks

**Purpose:** Store all Kanban tasks

**Fields:**
- `_id` - Unique identifier (auto-generated)
- `title` - Task title (required)
- `description` - Task details
- `status` - "todo", "doing", or "done"
- `priority` - "low" or "high"
- `assignee` - Person assigned to task
- `order` - Position in column (for sorting)
- `userId` - User who owns task
- `createdAt` - When task was created
- `updatedAt` - When task was last modified

**Example Document:**
```json
{
  "_id": ObjectId("65f8a1b2c3d4e5f6g7h8i9j0"),
  "title": "Setup CI/CD pipeline",
  "description": "GitHub Actions for automated deployments",
  "status": "todo",
  "priority": "high",
  "assignee": "Alex",
  "order": 0,
  "userId": "default-user",
  "createdAt": ISODate("2026-03-27T10:30:00.000Z"),
  "updatedAt": ISODate("2026-03-27T10:30:00.000Z")
}
```

### Collection 2: users

**Purpose:** Store user accounts

**Fields:**
- `_id` - Unique identifier
- `username` - Unique username
- `email` - User email
- `password` - Hashed password
- `role` - "user" or "admin"
- `settings` - User preferences
- `createdAt` - Account creation date
- `updatedAt` - Last profile update

**Example Document:**
```json
{
  "_id": ObjectId("65f8a1b2c3d4e5f6g7h8i9j1"),
  "username": "alexdoe",
  "email": "alex@example.com",
  "password": "$2b$10$...", // Hashed
  "role": "user",
  "settings": {
    "theme": "dark",
    "notifications": true
  },
  "createdAt": ISODate("2026-03-20T08:00:00.000Z"),
  "updatedAt": ISODate("2026-03-27T10:30:00.000Z")
}
```

### Collection 3: chatmessages

**Purpose:** Store AI chat history

**Fields:**
- `_id` - Unique identifier
- `userId` - User who sent message
- `message` - User's question
- `response` - AI's answer
- `type` - "chat", "standup", or "breakdown"
- `createdAt` - When message was sent
- `updatedAt` - Last update

**Example Document:**
```json
{
  "_id": ObjectId("65f8a1b2c3d4e5f6g7h8i9j2"),
  "userId": "default-user",
  "message": "What should I work on next?",
  "response": "I recommend working on 'Setup CI/CD pipeline' next. It's high priority and in your To Do list.",
  "type": "chat",
  "createdAt": ISODate("2026-03-27T11:00:00.000Z"),
  "updatedAt": ISODate("2026-03-27T11:00:00.000Z")
}
```

---

## Part 9: API Endpoints Reference

### Base URL
```
http://localhost:5000/api
```

### Tasks Endpoints

**GET /tasks**
- Get all tasks for a user
- Query params: `userId` (optional, default: "default-user")
- Response: Array of task objects

**GET /tasks/status/:status**
- Get tasks by status
- Params: `status` ("todo", "doing", "done")
- Query params: `userId`
- Response: Array of task objects

**POST /tasks**
- Create new task
- Body: `{ title, description, status, priority, assignee, userId }`
- Response: Created task object

**PUT /tasks/:id**
- Update existing task
- Params: `id` (task ID)
- Body: Fields to update
- Response: Updated task object

**DELETE /tasks/:id**
- Delete task
- Params: `id` (task ID)
- Response: `{ message, task }`

**POST /tasks/bulk-update**
- Update multiple tasks
- Body: `{ updates: [{ id, order, status }, ...] }`
- Response: `{ message }`

**GET /tasks/analytics/stats**
- Get task statistics
- Query params: `userId`
- Response: `{ total, todo, doing, done, highPriority, completionRate }`

### Users Endpoints

**GET /users/:id**
- Get user by ID
- Response: User object

**POST /users**
- Create new user
- Body: `{ username, email, password, role }`
- Response: Created user object

**PUT /users/:id/settings**
- Update user settings
- Body: `{ theme, notifications }`
- Response: Updated user object

### Admin Endpoints

**GET /admin/users**
- Get all users
- Response: Array of user objects

**GET /admin/tasks**
- Get all tasks (all users)
- Response: Array of task objects

**GET /admin/stats**
- Get system statistics
- Response: `{ totalUsers, totalTasks, activeTasks, recentTasks }`

**DELETE /admin/users/:id**
- Delete user
- Params: `id` (user ID)
- Response: `{ message }`

### Chat Endpoints

**POST /chat**
- Send chat message
- Body: `{ message, response, type, userId }`
- Response: Created chat message object

**GET /chat/history**
- Get chat history
- Query params: `userId`, `limit` (default: 50)
- Response: Array of chat message objects

**POST /chat/standup**
- Generate standup report
- Body: `{ userId }`
- Response: Standup object

### Health Check

**GET /health**
- Check server status
- Response: `{ status, message, database }`

---

## Part 10: Environment Variables Explained

### .env File Structure

```env
# MongoDB Connection String
# Format: mongodb+srv://username:password@cluster.mongodb.net/database
MONGODB_URI=mongodb+srv://zaidshaikh98848:pass123@cluster0.kgiff2o.mongodb.net/zentasks?retryWrites=true&w=majority&appName=Cluster0

# Server Port
# The port Express server will run on
PORT=5000

# Environment Mode
# "development" or "production"
NODE_ENV=development

# JWT Secret (for future authentication)
# Random string for signing JWT tokens
JWT_SECRET=zentasks-secret-key-2024-change-in-production
```

### Breaking Down MongoDB URI

```
mongodb+srv://zaidshaikh98848:pass123@cluster0.kgiff2o.mongodb.net/zentasks?retryWrites=true&w=majority&appName=Cluster0
│              │                │       │                              │        │
│              │                │       │                              │        └─ Query parameters
│              │                │       │                              └─ Database name
│              │                │       └─ Cluster hostname
│              │                └─ Password
│              └─ Username
└─ Protocol (SRV for Atlas)
```

**Parts:**
1. `mongodb+srv://` - Protocol (use SRV for Atlas)
2. `zaidshaikh98848` - Database username
3. `pass123` - Database password
4. `cluster0.kgiff2o.mongodb.net` - Cluster hostname
5. `zentasks` - Database name
6. `?retryWrites=true&w=majority` - Connection options

### Frontend Environment Variables

Create `.env.local` in root (optional):

```env
# API URL for frontend
VITE_API_URL=http://localhost:5000/api
```

**Note:** Vite requires `VITE_` prefix for environment variables

---

## Part 11: Quick Commands Reference

### Development

```bash
# Start everything
npm start

# Start backend only
npm run server
npm run server:dev  # With auto-restart

# Start frontend only
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Database

```bash
# Check MongoDB connection
curl http://localhost:5000/api/health

# Get all tasks
curl http://localhost:5000/api/tasks

# Create task (Windows PowerShell)
Invoke-RestMethod -Uri http://localhost:5000/api/tasks -Method POST -Body '{"title":"Test","status":"todo","priority":"low"}' -ContentType "application/json"
```

### Git

```bash
# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "Your message"

# Push to GitHub
git push

# Pull latest
git pull
```

---

## Summary Checklist

Before you start coding, verify:

- ✅ MongoDB Atlas cluster created
- ✅ Database user created with password
- ✅ IP address whitelisted
- ✅ Connection string copied
- ✅ `.env` file configured
- ✅ Dependencies installed (`npm install`)
- ✅ Backend starts without errors
- ✅ Frontend starts without errors
- ✅ Can access http://localhost:5173
- ✅ Can access http://localhost:5000/api/health
- ✅ Tasks save to MongoDB
- ✅ Can see tasks in Atlas dashboard

**If all checked, you're ready to develop! 🎉**

---

**Need Help?**
- Check server terminal for error messages
- Check browser console (F12) for frontend errors
- Review MongoDB Atlas logs
- Verify all ports are available (5000, 5173)
- Restart both servers if issues persist

**Last Updated:** March 27, 2026
