# ZenTasks - Complete Technical Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Frontend Structure](#frontend-structure)
3. [Backend Structure](#backend-structure)
4. [Data Flow](#data-flow)
5. [Routing System](#routing-system)
6. [State Management](#state-management)
7. [API Integration](#api-integration)
8. [Database Schema](#database-schema)
9. [Component Breakdown](#component-breakdown)
10. [Features Implementation](#features-implementation)

---

## 1. Architecture Overview

### Tech Stack

**Frontend:**
- React 18.2.0 - UI library
- Vite 6.1.0 - Build tool and dev server
- React Router DOM 6.26.0 - Client-side routing
- Framer Motion 11.16.4 - Animations
- Tailwind CSS 3.4.17 - Styling
- Axios 1.13.6 - HTTP client
- @hello-pangea/dnd 17.0.0 - Drag and drop

**Backend:**
- Node.js with Express 4.22.1 - Server framework
- MongoDB Atlas - Cloud database
- Mongoose 8.23.0 - ODM (Object Data Modeling)
- CORS 2.8.6 - Cross-origin resource sharing
- dotenv 16.6.1 - Environment variables

**Development Tools:**
- Nodemon 3.1.14 - Auto-restart server
- Concurrently 8.2.2 - Run multiple commands
- ESLint 9.19.0 - Code linting

### Application Flow

```
User Browser
    ↓
React App (Port 5173)
    ↓
Axios API Layer
    ↓
Express Server (Port 5000)
    ↓
Mongoose ODM
    ↓
MongoDB Atlas (Cloud)
    ↓ (if offline)
localStorage (Fallback)
```

---

## 2. Frontend Structure

### Directory Layout

```
src/
├── components/          # Reusable UI components
│   ├── chat/           # Chat bot component
│   ├── dashboard/      # Dashboard-specific components
│   ├── kanban/         # Kanban board components
│   └── ui/             # Base UI components (shadcn/ui)
├── lib/                # Utilities and helpers
│   ├── api.js          # API service layer
│   ├── KanbanContext.jsx  # Global state management
│   ├── mockAI.js       # AI mock functions
│   └── utils.js        # Utility functions
├── pages/              # Route pages
│   ├── Dashboard.jsx   # Main kanban board
│   ├── Analytics.jsx   # Analytics page
│   ├── Settings.jsx    # Settings page
│   ├── Admin.jsx       # Admin panel
│   └── Landing.jsx     # Landing page
├── App.jsx             # Root component
├── main.jsx            # Entry point
└── index.css           # Global styles
```


### Entry Point Flow

**1. index.html** - Root HTML file
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ZenTasks - Kanban Board</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**2. main.jsx** - React initialization
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**3. App.jsx** - Root component with routing
```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { KanbanProvider } from '@/lib/KanbanContext'
import { Toaster } from 'sonner'

// Pages
import Landing from '@/pages/Landing'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import Dashboard from '@/pages/Dashboard'
import Analytics from '@/pages/Analytics'
import Settings from '@/pages/Settings'
import Admin from '@/pages/Admin'

function App() {
  return (
    <KanbanProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="admin" element={<Admin />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </KanbanProvider>
  )
}
```

---

## 3. Backend Structure

### Directory Layout

```
server/
├── models/              # Mongoose schemas
│   ├── Task.js         # Task model
│   ├── User.js         # User model
│   └── ChatMessage.js  # Chat message model
├── routes/             # Express routes
│   ├── tasks.js        # Task endpoints
│   ├── users.js        # User endpoints
│   ├── admin.js        # Admin endpoints
│   └── chat.js         # Chat endpoints
├── middleware/         # Custom middleware
│   └── auth.js         # Authentication (future)
└── server.js           # Main server file
```

### Server Initialization (server.js)

```javascript
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());              // Enable CORS for all routes
app.use(express.json());      // Parse JSON bodies

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    console.log('📊 Database: zentasks');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Routes
app.use('/api/tasks', tasksRouter);
app.use('/api/users', usersRouter);
app.use('/api/admin', adminRouter);
app.use('/api/chat', chatRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'ZenTasks API is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});
```


---

## 4. Data Flow

### Task Creation Flow

```
1. User clicks "New Task" button
   ↓
2. Dialog opens with form (DashboardLayout.jsx)
   ↓
3. User fills form and submits
   ↓
4. handleSubmit() calls createTask() from KanbanContext
   ↓
5. KanbanContext checks if online or offline
   ↓
6a. ONLINE: Calls tasksAPI.create() → POST /api/tasks
   ↓
7a. Express server receives request
   ↓
8a. Creates new Task document in MongoDB
   ↓
9a. Returns saved task with _id
   ↓
10a. Frontend updates state with new task
   
6b. OFFLINE: Creates task with local ID
   ↓
7b. Saves to localStorage
   ↓
8b. Updates state immediately
```

### Task Update Flow (Drag & Drop)

```
1. User drags task card
   ↓
2. onDragStart() sets isDragging = true
   ↓
3. User drops task in new column
   ↓
4. onDragEnd() receives result object:
   {
     draggableId: "task-id",
     source: { droppableId: "todo", index: 0 },
     destination: { droppableId: "doing", index: 1 }
   }
   ↓
5. Calculate new order value
   ↓
6. Call moveTask(taskId, newStatus, newOrder)
   ↓
7. moveTask calls updateTask() from context
   ↓
8. ONLINE: PUT /api/tasks/:id with { status, order }
   ↓
9. MongoDB updates document
   ↓
10. Frontend updates state
   ↓
11. UI re-renders with new position
```

### Data Synchronization

```
Component Mount
    ↓
useEffect() runs
    ↓
loadTasks() called
    ↓
Try API call: GET /api/tasks?userId=default-user
    ↓
    ├─ SUCCESS: Set tasks from API
    │   └─ setUseLocalStorage(false)
    │
    └─ FAILURE: Load from localStorage
        └─ setUseLocalStorage(true)
        └─ Show toast: "Using offline mode"
```

---

## 5. Routing System

### React Router Configuration

**Route Structure:**
```
/ (Landing)
└── /dashboard (DashboardLayout - Outlet)
    ├── /dashboard (index) → Dashboard.jsx
    ├── /dashboard/analytics → Analytics.jsx
    ├── /dashboard/settings → Settings.jsx
    └── /dashboard/admin → Admin.jsx
```

### DashboardLayout with Nested Routes

```javascript
// DashboardLayout.jsx
export default function DashboardLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside>
        <Link to="/dashboard">Board</Link>
        <Link to="/dashboard/analytics">Analytics</Link>
        <Link to="/dashboard/settings">Settings</Link>
      </aside>
      
      {/* Main Content Area */}
      <main>
        <Outlet />  {/* Child routes render here */}
      </main>
    </div>
  )
}
```

### Navigation Flow

```
User clicks "Board" link
    ↓
React Router intercepts click
    ↓
Prevents page reload
    ↓
Updates URL to /dashboard
    ↓
Matches route configuration
    ↓
Renders Dashboard component in <Outlet />
    ↓
DashboardLayout stays mounted (sidebar, header persist)
    ↓
Only content area updates
```


---

## 6. State Management (KanbanContext)

### Context Provider Pattern

**Why Context?**
- Share state across multiple components without prop drilling
- Centralized task management logic
- Single source of truth for tasks

**Implementation:**

```javascript
// 1. Create Context
const KanbanContext = createContext(null);

// 2. Provider Component
export function KanbanProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useLocalStorage, setUseLocalStorage] = useState(false);
  
  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);
  
  // Save to localStorage when offline
  useEffect(() => {
    if (useLocalStorage && tasks.length > 0) {
      localStorage.setItem('zentasks_tasks', JSON.stringify(tasks));
    }
  }, [tasks, useLocalStorage]);
  
  // CRUD operations
  const createTask = async (taskData) => { /* ... */ };
  const updateTask = async (taskId, data) => { /* ... */ };
  const deleteTask = async (taskId) => { /* ... */ };
  const moveTask = (taskId, newStatus, newOrder) => { /* ... */ };
  const getTasksByStatus = (status) => { /* ... */ };
  
  return (
    <KanbanContext.Provider value={{
      tasks,
      isLoading,
      useLocalStorage,
      createTask,
      updateTask,
      deleteTask,
      moveTask,
      getTasksByStatus,
      refreshTasks: loadTasks,
    }}>
      {children}
    </KanbanContext.Provider>
  );
}

// 3. Custom Hook
export function useKanban() {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  return context;
}
```

### Using Context in Components

```javascript
// Any component can access context
function Board() {
  const { tasks, moveTask, deleteTask } = useKanban();
  
  return (
    <div>
      {tasks.map(task => (
        <TaskCard 
          key={task.id} 
          task={task}
          onMove={moveTask}
          onDelete={deleteTask}
        />
      ))}
    </div>
  );
}
```

### State Updates Flow

```
User Action (e.g., create task)
    ↓
Component calls context method: createTask(data)
    ↓
Context method makes API call
    ↓
API returns new task
    ↓
Context updates state: setTasks(prev => [...prev, newTask])
    ↓
React detects state change
    ↓
All components using useKanban() re-render
    ↓
UI updates automatically
```

---

## 7. API Integration

### API Service Layer (src/lib/api.js)

**Purpose:** Centralize all HTTP requests

```javascript
import axios from 'axios';

// Base configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tasks API
export const tasksAPI = {
  // GET /api/tasks?userId=default-user
  getAll: (userId = 'default-user') => 
    api.get(`/tasks?userId=${userId}`),
  
  // GET /api/tasks/status/todo?userId=default-user
  getByStatus: (status, userId = 'default-user') => 
    api.get(`/tasks/status/${status}?userId=${userId}`),
  
  // POST /api/tasks
  create: (task) => 
    api.post('/tasks', task),
  
  // PUT /api/tasks/:id
  update: (id, data) => 
    api.put(`/tasks/${id}`, data),
  
  // DELETE /api/tasks/:id
  delete: (id) => 
    api.delete(`/tasks/${id}`),
  
  // POST /api/tasks/bulk-update
  bulkUpdate: (updates) => 
    api.post('/tasks/bulk-update', { updates }),
  
  // GET /api/tasks/analytics/stats?userId=default-user
  getStats: (userId = 'default-user') => 
    api.get(`/tasks/analytics/stats?userId=${userId}`),
};

// Users API
export const usersAPI = {
  get: (id) => api.get(`/users/${id}`),
  create: (user) => api.post('/users', user),
  updateSettings: (id, settings) => api.put(`/users/${id}/settings`, settings),
};

// Admin API
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  getTasks: () => api.get('/admin/tasks'),
  getStats: () => api.get('/admin/stats'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

// Chat API
export const chatAPI = {
  sendMessage: (message) => api.post('/chat', message),
  getHistory: (userId = 'default-user', limit = 50) => 
    api.get(`/chat/history?userId=${userId}&limit=${limit}`),
  generateStandup: (userId = 'default-user') => 
    api.post('/chat/standup', { userId }),
};

// Health check
export const healthCheck = () => api.get('/health');
```

### API Request Flow

```
Component calls: tasksAPI.create(taskData)
    ↓
Axios intercepts request
    ↓
Adds base URL: http://localhost:5000/api
    ↓
Adds headers: Content-Type: application/json
    ↓
Sends HTTP POST to: http://localhost:5000/api/tasks
    ↓
Express server receives request
    ↓
Routes to: server/routes/tasks.js
    ↓
Controller creates task in MongoDB
    ↓
Returns response: { data: { _id, title, ... } }
    ↓
Axios returns promise
    ↓
Component receives data
```


---

## 8. Database Schema

### MongoDB Collections

#### Tasks Collection

**Schema Definition (server/models/Task.js):**

```javascript
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['todo', 'doing', 'done'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'high'],
    default: 'low'
  },
  assignee: {
    type: String,
    default: null
  },
  order: {
    type: Number,
    default: 0
  },
  userId: {
    type: String,
    default: 'default-user'
  }
}, {
  timestamps: true  // Adds createdAt and updatedAt
});

// Index for faster queries
taskSchema.index({ userId: 1, status: 1, order: 1 });

const Task = mongoose.model('Task', taskSchema);
export default Task;
```

**Example Document:**
```json
{
  "_id": "65f8a1b2c3d4e5f6g7h8i9j0",
  "title": "Setup CI/CD pipeline",
  "description": "GitHub Actions for automated deployments",
  "status": "todo",
  "priority": "high",
  "assignee": "Alex",
  "order": 0,
  "userId": "default-user",
  "createdAt": "2026-03-25T10:30:00.000Z",
  "updatedAt": "2026-03-25T10:30:00.000Z"
}
```

#### Users Collection

**Schema Definition (server/models/User.js):**

```javascript
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  settings: {
    theme: {
      type: String,
      default: 'dark'
    },
    notifications: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});
```

#### ChatMessages Collection

**Schema Definition (server/models/ChatMessage.js):**

```javascript
const chatMessageSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    default: 'default-user'
  },
  message: {
    type: String,
    required: true
  },
  response: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['chat', 'standup', 'breakdown'],
    default: 'chat'
  }
}, {
  timestamps: true
});
```

### Database Indexes

**Why Indexes?**
- Speed up queries
- Reduce database load
- Improve performance

**Task Index:**
```javascript
{ userId: 1, status: 1, order: 1 }
```

This compound index optimizes queries like:
```javascript
Task.find({ userId: 'default-user', status: 'todo' }).sort({ order: 1 })
```


---

## 9. Component Breakdown

### Board Component (Kanban Board)

**File:** `src/components/kanban/Board.jsx`

**Purpose:** Main Kanban board with drag & drop functionality

**Key Features:**
1. Three columns (To Do, Doing, Done)
2. Drag and drop tasks between columns
3. AI task sorting
4. WIP (Work In Progress) limits
5. Trash zone for deletion
6. Overdue decay effect

**Component Structure:**

```javascript
export default function Board() {
  const { moveTask, deleteTask, getTasksByStatus } = useKanban();
  const [isDragging, setIsDragging] = useState(false);

  // Drag handlers
  const onDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const onDragEnd = useCallback((result) => {
    setIsDragging(false);
    const { destination, source, draggableId } = result;

    // Check if dropped in trash
    if (destination?.droppableId === 'trash') {
      deleteTask(draggableId);
      return;
    }

    // Calculate new order
    const newStatus = destination.droppableId;
    const destTasks = getTasksByStatus(newStatus);
    let newOrder = calculateOrder(destination.index, destTasks);

    moveTask(draggableId, newStatus, newOrder);
  }, [moveTask, deleteTask, getTasksByStatus]);

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <Column status="todo" />
      <Column status="doing" />
      <Column status="done" />
      <TrashZone isVisible={isDragging} />
    </DragDropContext>
  );
}
```

**Drag & Drop Library:** `@hello-pangea/dnd`

**How it works:**

1. **DragDropContext** - Wraps entire drag area
2. **Droppable** - Defines drop zones (columns)
3. **Draggable** - Makes items draggable (task cards)

```javascript
<DragDropContext onDragEnd={handleDragEnd}>
  <Droppable droppableId="todo">
    {(provided) => (
      <div ref={provided.innerRef} {...provided.droppableProps}>
        {tasks.map((task, index) => (
          <Draggable key={task.id} draggableId={task.id} index={index}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <TaskCard task={task} />
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
</DragDropContext>
```

### TaskCard Component

**Purpose:** Display individual task with animations

**Features:**
- Priority badge (High/Low)
- Status badge (To Do/In Progress/Done)
- Assignee avatar
- Timestamp
- Overdue decay effect
- Hover animations

**Overdue Decay Logic:**

```javascript
const getDecayStyle = () => {
  if (task.status !== 'doing') return {};
  
  const created = new Date(task.created_date);
  const hoursOld = (Date.now() - created.getTime()) / (1000 * 60 * 60);
  
  // Start decay after 2 hours, max at 24 hours
  const decayRatio = Math.min(Math.max((hoursOld - 2) / 22, 0), 1);
  
  if (decayRatio === 0) return {};
  
  return {
    boxShadow: `inset 0 0 0 1px rgba(244,63,94,${decayRatio * 0.6}), 
                0 0 ${decayRatio * 20}px rgba(244,63,94,${decayRatio * 0.15})`
  };
};
```

**Result:** Tasks in "Doing" column gradually get red glow as they age

### Column Component

**Purpose:** Render a single Kanban column

**Features:**
- Task count badge
- WIP limit warning
- AI sort button
- Droppable area

**WIP Limit Logic:**

```javascript
const WIP_LIMIT = 3;

function Column({ status }) {
  const tasks = getTasksByStatus(status);
  const wipExceeded = status === 'doing' && tasks.length > WIP_LIMIT;

  return (
    <div>
      <div className={wipExceeded ? 'shake-animation' : ''}>
        <h3>{status}</h3>
        <span>{tasks.length}</span>
        {wipExceeded && <AlertTriangle />}
      </div>
      {/* Tasks */}
    </div>
  );
}
```

**Result:** "Doing" column shakes and shows warning when > 3 tasks


---

## 10. Features Implementation

### Feature 1: AI Task Sorting

**File:** `src/lib/mockAI.js`

**How it works:**

```javascript
export const mockAI = {
  sortTasks: async (tasks) => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Sorting logic:
    // 1. High priority first
    // 2. Older tasks first
    // 3. Alphabetical by title
    
    const sorted = [...tasks].sort((a, b) => {
      // Priority comparison
      if (a.priority === 'high' && b.priority === 'low') return -1;
      if (a.priority === 'low' && b.priority === 'high') return 1;
      
      // Date comparison
      const dateA = new Date(a.created_date || a.updated_date);
      const dateB = new Date(b.created_date || b.updated_date);
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;
      
      // Title comparison
      return a.title.localeCompare(b.title);
    });
    
    return {
      ordered_ids: sorted.map(t => t.id),
      reason: 'Sorted by priority, age, and title'
    };
  }
};
```

**Usage in Component:**

```javascript
const handleAISort = async () => {
  setSorting(true);
  const result = await mockAI.sortTasks(tasks);
  
  // Update order for each task
  result.ordered_ids.forEach((id, index) => {
    updateTask(id, { order: index });
  });
  
  toast.success(`AI sorted! ${result.reason}`);
  setSorting(false);
};
```

### Feature 2: Focus Mode (Pomodoro Timer)

**File:** `src/components/dashboard/FocusMode.jsx`

**Implementation:**

```javascript
export default function FocusMode({ isOpen, onClose }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' or 'break'

  useEffect(() => {
    if (!isRunning) return;
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Timer finished
          setIsRunning(false);
          playSound();
          
          if (mode === 'focus') {
            toast.success('Focus session complete! Take a break.');
            setMode('break');
            setTimeLeft(5 * 60); // 5 minute break
          } else {
            toast.success('Break over! Ready for another session?');
            setMode('focus');
            setTimeLeft(25 * 60);
          }
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isRunning, mode]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <h2>Focus Mode</h2>
        <div className="text-6xl font-bold">
          {formatTime(timeLeft)}
        </div>
        <div>
          <Button onClick={() => setIsRunning(!isRunning)}>
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          <Button onClick={() => setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60)}>
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

**Pomodoro Technique:**
1. Work for 25 minutes (focus)
2. Take 5 minute break
3. Repeat

### Feature 3: Voice Input

**File:** `src/components/dashboard/VoiceInput.jsx`

**Implementation:**

```javascript
export default function VoiceInput({ isOpen, onClose }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { createTask } = useKanban();

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error('Speech recognition not supported');
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      
      // Parse voice command
      // "Create high priority task: Setup CI/CD"
      const match = text.match(/create (high|low) priority task:? (.+)/i);
      
      if (match) {
        const [, priority, title] = match;
        createTask({
          title: title.trim(),
          priority: priority.toLowerCase(),
          status: 'todo',
          description: ''
        });
        toast.success('Task created from voice!');
        onClose();
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <h2>Voice Input</h2>
        <p>Say: "Create high priority task: Your task title"</p>
        
        {isListening && (
          <div className="animate-pulse">
            <Mic className="h-12 w-12" />
            <p>Listening...</p>
          </div>
        )}
        
        {transcript && (
          <div>
            <p>You said:</p>
            <p className="font-bold">{transcript}</p>
          </div>
        )}
        
        <Button onClick={startListening} disabled={isListening}>
          {isListening ? 'Listening...' : 'Start Recording'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
```

**Browser API Used:** Web Speech API (`webkitSpeechRecognition`)


### Feature 4: AI Chat Bot

**File:** `src/components/chat/ChatBot.jsx`

**Architecture:**

```
User types message
    ↓
handleSend() called
    ↓
Add user message to state
    ↓
Call mockAI.chat(message, tasks)
    ↓
AI analyzes message and tasks
    ↓
Returns contextual response
    ↓
Add AI response to state
    ↓
Save to database (if online)
    ↓
UI updates with new messages
```

**Implementation:**

```javascript
export default function ChatBot({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { tasks, useLocalStorage } = useKanban();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    setMessages(prev => [...prev, { 
      text: userMessage, 
      isUser: true 
    }]);
    
    setLoading(true);

    try {
      // Get AI response
      const aiResponse = await mockAI.chat(userMessage, tasks);
      
      // Add AI response
      setMessages(prev => [...prev, { 
        text: aiResponse, 
        isUser: false 
      }]);

      // Save to database if online
      if (!useLocalStorage) {
        await chatAPI.sendMessage({
          message: userMessage,
          response: aiResponse,
          type: 'chat'
        });
      }
    } catch (error) {
      toast.error('Failed to get response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="fixed bottom-24 right-6 z-50 w-96"
    >
      <Card>
        <div className="p-4 border-b">
          <h3>AI Agile Coach</h3>
          <Button onClick={onClose}>
            <X />
          </Button>
        </div>

        <div className="h-96 overflow-y-auto p-4">
          {messages.map((msg, i) => (
            <div key={i} className={msg.isUser ? 'text-right' : 'text-left'}>
              <div className={msg.isUser ? 'bg-blue-500' : 'bg-gray-700'}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && <Loader2 className="animate-spin" />}
        </div>

        <div className="p-4 border-t">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
          />
          <Button onClick={handleSend} disabled={loading}>
            <Send />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
```

**AI Response Logic (mockAI.js):**

```javascript
chat: async (message, tasks) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const lowerMsg = message.toLowerCase();
  
  // Pattern matching for responses
  if (lowerMsg.includes('what') && lowerMsg.includes('next')) {
    const highPriorityTodo = tasks.find(
      t => t.status === 'todo' && t.priority === 'high'
    );
    
    if (highPriorityTodo) {
      return `I recommend working on "${highPriorityTodo.title}" next. It's high priority and in your To Do list.`;
    }
    return "You're all caught up! No high priority tasks waiting.";
  }
  
  if (lowerMsg.includes('progress') || lowerMsg.includes('status')) {
    const total = tasks.length;
    const done = tasks.filter(t => t.status === 'done').length;
    const percentage = Math.round((done / total) * 100);
    
    return `You've completed ${done} out of ${total} tasks (${percentage}%). Keep it up!`;
  }
  
  if (lowerMsg.includes('prioritize') || lowerMsg.includes('priority')) {
    const highPriority = tasks.filter(t => t.priority === 'high' && t.status !== 'done');
    
    return `You have ${highPriority.length} high priority tasks. Focus on those first!`;
  }
  
  // Default response
  return "I'm here to help! Ask me about your tasks, progress, or what to work on next.";
}
```

### Feature 5: Keyboard Shortcuts

**File:** `src/components/dashboard/KeyboardShortcuts.jsx`

**Implementation:**

```javascript
// In DashboardLayout.jsx
useEffect(() => {
  const handleKeyPress = (e) => {
    // Ignore if typing in input/textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }
    
    switch(e.key) {
      case 'n':
      case 'N':
        setIsNewTaskOpen(true);
        break;
      case 'f':
      case 'F':
        setShowFocus(true);
        break;
      case 's':
      case 'S':
        setShowStandup(true);
        break;
      case '?':
        setShowShortcuts(true);
        break;
    }
  };

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

**Available Shortcuts:**
- `N` - New Task
- `F` - Focus Mode
- `S` - Standup
- `?` - Show Shortcuts

### Feature 6: Standup Generator

**File:** `src/components/dashboard/StandupPanel.jsx`

**Purpose:** Generate daily standup report

**Implementation:**

```javascript
const generateStandup = async () => {
  setGenerating(true);
  
  const result = await mockAI.generateStandup(tasks);
  
  setStandup({
    yesterday: result.yesterday,
    today: result.today,
    blockers: result.blockers
  });
  
  // Save to database
  if (!useLocalStorage) {
    await chatAPI.generateStandup();
  }
  
  setGenerating(false);
};
```

**AI Logic:**

```javascript
generateStandup: async (tasks) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const yesterday = tasks.filter(t => {
    const updated = new Date(t.updated_date);
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return updated > oneDayAgo && t.status === 'done';
  });
  
  const today = tasks.filter(t => t.status === 'doing');
  
  const blockers = tasks.filter(t => {
    const created = new Date(t.created_date);
    const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
    return created < threeDaysAgo && t.status === 'doing';
  });
  
  return {
    yesterday: yesterday.map(t => t.title),
    today: today.map(t => t.title),
    blockers: blockers.map(t => t.title)
  };
}
```


---

## 11. Backend Routes Deep Dive

### Tasks Routes (server/routes/tasks.js)

**GET /api/tasks**
```javascript
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId || 'default-user';
    const tasks = await Task.find({ userId }).sort({ order: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Flow:**
1. Extract userId from query params
2. Query MongoDB: `Task.find({ userId })`
3. Sort by order field
4. Return JSON array of tasks

**POST /api/tasks**
```javascript
router.post('/', async (req, res) => {
  try {
    const userId = req.body.userId || 'default-user';
    const task = new Task({
      ...req.body,
      userId
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

**Flow:**
1. Extract task data from request body
2. Create new Task instance
3. Save to MongoDB
4. Return created task with _id

**PUT /api/tasks/:id**
```javascript
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

**Options:**
- `new: true` - Return updated document
- `runValidators: true` - Validate against schema

**DELETE /api/tasks/:id**
```javascript
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully', task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**POST /api/tasks/bulk-update**
```javascript
router.post('/bulk-update', async (req, res) => {
  try {
    const { updates } = req.body; 
    // updates = [{ id, order, status }, ...]
    
    const promises = updates.map(update => 
      Task.findByIdAndUpdate(update.id, { 
        order: update.order,
        status: update.status 
      })
    );
    
    await Promise.all(promises);
    res.json({ message: 'Tasks updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Use Case:** Reorder multiple tasks at once after drag & drop

**GET /api/tasks/analytics/stats**
```javascript
router.get('/analytics/stats', async (req, res) => {
  try {
    const userId = req.query.userId || 'default-user';
    
    const [total, todo, doing, done, highPriority] = await Promise.all([
      Task.countDocuments({ userId }),
      Task.countDocuments({ userId, status: 'todo' }),
      Task.countDocuments({ userId, status: 'doing' }),
      Task.countDocuments({ userId, status: 'done' }),
      Task.countDocuments({ userId, priority: 'high' })
    ]);

    res.json({
      total,
      todo,
      doing,
      done,
      highPriority,
      completionRate: total > 0 ? Math.round((done / total) * 100) : 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Optimization:** Use `Promise.all()` to run queries in parallel

### Admin Routes (server/routes/admin.js)

**GET /api/admin/stats**
```javascript
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalTasks, activeTasks] = await Promise.all([
      User.countDocuments(),
      Task.countDocuments(),
      Task.countDocuments({ status: { $ne: 'done' } })
    ]);

    const recentTasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status priority createdAt');

    res.json({
      totalUsers,
      totalTasks,
      activeTasks,
      recentTasks
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**MongoDB Operators:**
- `$ne` - Not equal
- `.sort({ createdAt: -1 })` - Sort descending
- `.limit(5)` - Return only 5 documents
- `.select('field1 field2')` - Return only specified fields

### Chat Routes (server/routes/chat.js)

**POST /api/chat**
```javascript
router.post('/', async (req, res) => {
  try {
    const { message, response, type, userId } = req.body;
    
    const chatMessage = new ChatMessage({
      userId: userId || 'default-user',
      message,
      response,
      type: type || 'chat'
    });
    
    await chatMessage.save();
    res.status(201).json(chatMessage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

**GET /api/chat/history**
```javascript
router.get('/history', async (req, res) => {
  try {
    const userId = req.query.userId || 'default-user';
    const limit = parseInt(req.query.limit) || 50;
    
    const messages = await ChatMessage.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit);
    
    res.json(messages.reverse()); // Oldest first
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**POST /api/chat/standup**
```javascript
router.post('/standup', async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Get tasks for standup
    const tasks = await Task.find({ 
      userId: userId || 'default-user' 
    });
    
    // Generate standup (would call AI service)
    const standup = generateStandupReport(tasks);
    
    // Save to chat history
    const chatMessage = new ChatMessage({
      userId: userId || 'default-user',
      message: 'Generate standup',
      response: JSON.stringify(standup),
      type: 'standup'
    });
    
    await chatMessage.save();
    res.json(standup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```


---

## 12. Animation System (Framer Motion)

### Why Framer Motion?

- Declarative animations
- React-friendly API
- Gesture support
- Layout animations
- Exit animations

### Basic Animation Pattern

```javascript
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}      // Starting state
  animate={{ opacity: 1, y: 0 }}       // Ending state
  exit={{ opacity: 0, y: -20 }}        // Exit state
  transition={{ duration: 0.3 }}       // Animation config
>
  Content
</motion.div>
```

### AnimatePresence for Exit Animations

**Problem:** React removes components immediately, no time to animate out

**Solution:** Wrap with `AnimatePresence`

```javascript
import { AnimatePresence } from 'framer-motion';

<AnimatePresence>
  {showChatBot && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <ChatBot />
    </motion.div>
  )}
</AnimatePresence>
```

**How it works:**
1. Component mounts → plays `initial` to `animate`
2. Component unmounts → plays `exit` animation
3. After exit animation completes → removes from DOM

### Layout Animations

```javascript
<motion.div layout>
  {tasks.map(task => (
    <motion.div key={task.id} layout>
      <TaskCard task={task} />
    </motion.div>
  ))}
</motion.div>
```

**Result:** When tasks reorder, they smoothly animate to new positions

### Gesture Animations

```javascript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={handleClick}
>
  Click me
</motion.button>
```

### Variants (Reusable Animations)

```javascript
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

<motion.div
  variants={cardVariants}
  initial="hidden"
  animate="visible"
  exit="exit"
>
  Card content
</motion.div>
```

### Stagger Children

```javascript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1  // Delay between children
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

<motion.div variants={containerVariants} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.name}
    </motion.div>
  ))}
</motion.div>
```

**Result:** Children animate in one after another

---

## 13. Styling System (Tailwind CSS)

### Utility-First CSS

Instead of writing CSS:
```css
.button {
  background-color: #06b6d4;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  color: white;
}
```

Use utility classes:
```jsx
<button className="bg-cyan-500 px-4 py-2 rounded-md text-white">
  Button
</button>
```

### Custom Configuration (tailwind.config.js)

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors
        'dark-bg': '#0a0e1a',
        'dark-card': '#1a1f2e',
      },
      animation: {
        // Custom animations
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}
```

### Responsive Design

```jsx
<div className="
  w-full           // Full width on mobile
  md:w-1/2         // Half width on medium screens
  lg:w-1/3         // Third width on large screens
  p-4              // Padding 1rem
  md:p-6           // Padding 1.5rem on medium+
">
  Content
</div>
```

**Breakpoints:**
- `sm:` - 640px
- `md:` - 768px
- `lg:` - 1024px
- `xl:` - 1280px
- `2xl:` - 1536px

### Dark Mode

```jsx
<div className="
  bg-white         // White in light mode
  dark:bg-gray-900 // Dark gray in dark mode
  text-black
  dark:text-white
">
  Content
</div>
```

### Custom Utilities

```css
/* index.css */
@layer utilities {
  .glass-card {
    @apply bg-white/5 backdrop-blur-sm border border-white/10;
  }
  
  .gradient-bg {
    @apply bg-gradient-to-r from-cyan-500 to-blue-600;
  }
}
```

Usage:
```jsx
<div className="glass-card">
  Glassmorphism effect
</div>
```

---

## 14. Environment Variables

### Configuration (.env)

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zentasks

# Server Configuration
PORT=5000
NODE_ENV=development

# Security
JWT_SECRET=your-secret-key-here
```

### Frontend Environment Variables

**Vite requires `VITE_` prefix:**

```env
VITE_API_URL=http://localhost:5000/api
```

**Usage:**
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

### Security Best Practices

1. **Never commit .env to git**
   - Add to `.gitignore`
   - Provide `.env.example` instead

2. **Use different values for production**
   ```env
   # Development
   MONGODB_URI=mongodb://localhost:27017/zentasks
   
   # Production
   MONGODB_URI=mongodb+srv://prod-user:secure-pass@cluster.mongodb.net/zentasks
   ```

3. **Validate environment variables**
   ```javascript
   if (!process.env.MONGODB_URI) {
     throw new Error('MONGODB_URI is required');
   }
   ```


---

## 15. Error Handling & Offline Mode

### API Error Handling Pattern

```javascript
// In KanbanContext.jsx
const createTask = async (taskData) => {
  try {
    if (useLocalStorage) {
      // Offline mode - use localStorage
      const newTask = {
        id: Date.now().toString(),
        ...taskData,
        created_date: new Date().toISOString(),
      };
      setTasks(prev => [...prev, newTask]);
      toast.success('Task created (offline)');
    } else {
      // Online mode - use API
      const response = await tasksAPI.create({ ...taskData, userId });
      const newTask = {
        ...response.data,
        id: response.data._id,
      };
      setTasks(prev => [...prev, newTask]);
      toast.success('Task created!');
    }
  } catch (error) {
    console.error('Failed to create task:', error);
    toast.error('Failed to create task');
  }
};
```

### Automatic Fallback System

```javascript
// Load tasks on mount
useEffect(() => {
  loadTasks();
}, []);

const loadTasks = async () => {
  setIsLoading(true);
  try {
    // Try API first
    const response = await tasksAPI.getAll(userId);
    const apiTasks = response.data.map(task => ({
      ...task,
      id: task._id,
    }));
    
    setTasks(apiTasks);
    setUseLocalStorage(false);
  } catch (error) {
    console.error('Failed to load from API, using localStorage:', error);
    
    // Fallback to localStorage
    const saved = localStorage.getItem('zentasks_tasks');
    setTasks(saved ? JSON.parse(saved) : initialTasks);
    setUseLocalStorage(true);
    
    toast.error('Using offline mode. Start the server for full features.');
  } finally {
    setIsLoading(false);
  }
};
```

### localStorage Sync

```javascript
// Auto-save to localStorage when offline
useEffect(() => {
  if (useLocalStorage && tasks.length > 0) {
    localStorage.setItem('zentasks_tasks', JSON.stringify(tasks));
  }
}, [tasks, useLocalStorage]);
```

**How it works:**
1. When `tasks` or `useLocalStorage` changes
2. If in offline mode AND have tasks
3. Save tasks to localStorage
4. Next time app loads, data persists

### Toast Notifications (Sonner)

```javascript
import { toast } from 'sonner';

// Success
toast.success('Task created!');

// Error
toast.error('Failed to save task');

// Info
toast.info('Using offline mode');

// Loading
const toastId = toast.loading('Saving...');
// Later:
toast.success('Saved!', { id: toastId });

// Custom
toast('Custom message', {
  description: 'Additional details',
  duration: 5000,
  action: {
    label: 'Undo',
    onClick: () => console.log('Undo')
  }
});
```

---

## 16. Build & Deployment

### Development Mode

```bash
# Start both frontend and backend
npm start

# Or separately:
npm run dev          # Frontend (Vite) - Port 5173
npm run server:dev   # Backend (Nodemon) - Port 5000
```

**What happens:**
1. Vite starts dev server with HMR (Hot Module Replacement)
2. Nodemon starts Express server with auto-restart
3. Changes to files trigger automatic reload

### Production Build

```bash
npm run build
```

**Build process:**
1. Vite bundles all React code
2. Minifies JavaScript and CSS
3. Optimizes images and assets
4. Generates `dist/` folder

**Output:**
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js    # Bundled JavaScript
│   └── index-[hash].css   # Bundled CSS
└── vite.svg
```

### Preview Production Build

```bash
npm run preview
```

Serves the `dist/` folder locally to test production build

### Deployment Options

**Frontend (Vercel/Netlify):**
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy automatically on push

**Backend (Heroku/Railway):**
1. Create new app
2. Connect GitHub repository
3. Set start command: `npm run server`
4. Add environment variables
5. Deploy

**Environment Variables for Production:**
```env
# Frontend
VITE_API_URL=https://your-api.herokuapp.com/api

# Backend
MONGODB_URI=mongodb+srv://prod:pass@cluster.mongodb.net/zentasks
PORT=5000
NODE_ENV=production
JWT_SECRET=secure-random-string
```

---

## 17. Performance Optimizations

### 1. React.memo for Expensive Components

```javascript
import { memo } from 'react';

const TaskCard = memo(({ task, onMove, onDelete }) => {
  return (
    <div>
      {/* Task card content */}
    </div>
  );
});

export default TaskCard;
```

**Benefit:** Component only re-renders if props change

### 2. useCallback for Event Handlers

```javascript
const handleDragEnd = useCallback((result) => {
  // Handle drag end
}, [moveTask, deleteTask]);
```

**Benefit:** Function reference stays same across renders

### 3. useMemo for Expensive Calculations

```javascript
const sortedTasks = useMemo(() => {
  return tasks
    .filter(t => t.status === status)
    .sort((a, b) => a.order - b.order);
}, [tasks, status]);
```

**Benefit:** Only recalculates when dependencies change

### 4. Code Splitting

```javascript
import { lazy, Suspense } from 'react';

const Analytics = lazy(() => import('@/pages/Analytics'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Analytics />
    </Suspense>
  );
}
```

**Benefit:** Load components only when needed

### 5. MongoDB Indexes

```javascript
taskSchema.index({ userId: 1, status: 1, order: 1 });
```

**Benefit:** Faster queries

### 6. API Response Caching

```javascript
// In frontend
const [cachedTasks, setCachedTasks] = useState(null);

const loadTasks = async () => {
  if (cachedTasks && Date.now() - cachedTasks.timestamp < 60000) {
    // Use cache if less than 1 minute old
    setTasks(cachedTasks.data);
    return;
  }
  
  const response = await tasksAPI.getAll();
  setCachedTasks({
    data: response.data,
    timestamp: Date.now()
  });
  setTasks(response.data);
};
```

---

## 18. Testing Strategy

### Unit Tests (Example)

```javascript
// mockAI.test.js
import { mockAI } from './mockAI';

describe('mockAI.sortTasks', () => {
  it('should sort high priority tasks first', async () => {
    const tasks = [
      { id: '1', priority: 'low', title: 'Task 1' },
      { id: '2', priority: 'high', title: 'Task 2' },
    ];
    
    const result = await mockAI.sortTasks(tasks);
    
    expect(result.ordered_ids[0]).toBe('2');
    expect(result.ordered_ids[1]).toBe('1');
  });
});
```

### Integration Tests

```javascript
// api.test.js
import { tasksAPI } from './api';

describe('tasksAPI', () => {
  it('should create a task', async () => {
    const taskData = {
      title: 'Test Task',
      status: 'todo',
      priority: 'high'
    };
    
    const response = await tasksAPI.create(taskData);
    
    expect(response.data).toHaveProperty('_id');
    expect(response.data.title).toBe('Test Task');
  });
});
```

### E2E Tests (Cypress Example)

```javascript
describe('Kanban Board', () => {
  it('should create and move a task', () => {
    cy.visit('/dashboard');
    
    // Create task
    cy.contains('New Task').click();
    cy.get('input[name="title"]').type('Test Task');
    cy.contains('Create Task').click();
    
    // Verify task appears
    cy.contains('Test Task').should('be.visible');
    
    // Drag task to "Doing" column
    cy.contains('Test Task')
      .drag('[data-column="doing"]');
    
    // Verify task moved
    cy.get('[data-column="doing"]')
      .should('contain', 'Test Task');
  });
});
```

---

## 19. Security Considerations

### Current Implementation (Development)

✅ Environment variables for secrets
✅ CORS enabled for localhost
✅ Input validation with Mongoose schemas
⚠️ No authentication (demo mode)
⚠️ Shared user ID

### Production Recommendations

**1. Add Authentication**
```javascript
// JWT-based auth
import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Protect routes
router.get('/tasks', authMiddleware, async (req, res) => {
  const tasks = await Task.find({ userId: req.userId });
  res.json(tasks);
});
```

**2. Rate Limiting**
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

**3. Input Sanitization**
```javascript
import mongoSanitize from 'express-mongo-sanitize';

app.use(mongoSanitize());
```

**4. HTTPS Only**
```javascript
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

**5. Helmet for Security Headers**
```javascript
import helmet from 'helmet';

app.use(helmet());
```

---

## 20. Troubleshooting Guide

### Common Issues

**1. MongoDB Connection Failed**
```
Error: MongoServerError: bad auth
```
**Solution:**
- Check password in `.env`
- Verify IP whitelist in MongoDB Atlas
- Ensure connection string is correct

**2. CORS Error**
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
```javascript
// server.js
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

**3. Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
```bash
# Find process using port
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F

# Or change port in .env
PORT=5001
```

**4. Tasks Not Loading**
**Check:**
1. Backend running? `http://localhost:5000/api/health`
2. MongoDB connected? Check server logs
3. Browser console errors?
4. Network tab in DevTools

**5. Build Fails**
```
Error: Cannot find module '@/components/...'
```
**Solution:**
- Check `vite.config.js` has path alias
- Restart dev server
- Clear node_modules and reinstall

---

## Summary

This ZenTasks application demonstrates:

✅ Full-stack architecture (React + Express + MongoDB)
✅ RESTful API design
✅ State management with Context API
✅ Drag & drop functionality
✅ Real-time animations
✅ Offline-first approach
✅ Modern UI with Tailwind CSS
✅ AI-powered features
✅ Responsive design
✅ Production-ready build system

**Key Technologies:**
- Frontend: React, Vite, Tailwind, Framer Motion
- Backend: Express, MongoDB, Mongoose
- Tools: Axios, React Router, Sonner

**Architecture Pattern:**
- Client-server separation
- API service layer
- Context for state management
- Component-based UI
- RESTful endpoints
- Document database

---

**Last Updated:** March 27, 2026
**Version:** 1.0.0
