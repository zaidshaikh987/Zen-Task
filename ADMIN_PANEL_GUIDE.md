# Admin Panel Guide

## Overview

The Admin Panel provides comprehensive system monitoring and management capabilities for ZenTasks. It displays real-time statistics, charts, user management, and task oversight.

---

## Accessing the Admin Panel

### Navigation
1. Start the application: `npm start`
2. Open browser: http://localhost:5173
3. Click "Get Started" to go to dashboard
4. Click "Admin" in the left sidebar

**Direct URL:** http://localhost:5173/dashboard/admin

---

## Features

### 1. Statistics Cards

Four key metrics displayed at the top:

**Total Users**
- Icon: Users (cyan)
- Shows total number of registered users
- Includes all user roles

**Total Tasks**
- Icon: List (amber)
- Shows all tasks across all users
- Includes tasks in all statuses

**Completed Tasks**
- Icon: CheckCircle (emerald)
- Shows tasks with status "done"
- Indicates productivity level

**High Priority Tasks**
- Icon: TrendingUp (rose)
- Shows tasks marked as high priority
- Helps identify urgent work

### 2. Task Status Distribution Chart

**Type:** Bar Chart

**Purpose:** Visualize task distribution across statuses

**Data Shown:**
- To Do (Cyan) - Tasks not started
- Doing (Amber) - Tasks in progress
- Done (Emerald) - Completed tasks

**Use Cases:**
- Identify bottlenecks
- See workflow balance
- Track completion progress

### 3. Priority Distribution Chart

**Type:** Pie Chart (Donut)

**Purpose:** Show priority breakdown

**Data Shown:**
- High Priority (Rose) - Urgent tasks
- Low Priority (Blue) - Regular tasks
- Center shows total task count

**Use Cases:**
- Assess workload urgency
- Balance priority distribution
- Plan resource allocation

### 4. Task Creation Activity Chart

**Type:** Line Chart

**Purpose:** Track task creation over time

**Data Shown:**
- Last 7 days of activity
- Number of tasks created each day
- Trend visualization

**Use Cases:**
- Identify busy periods
- Track team activity
- Spot patterns

### 5. Users Management

**Features:**
- List all registered users
- View user details (username, email, role)
- Delete users and their tasks
- User avatars with initials

**Actions:**
- **Delete User:** Removes user and all associated tasks
- Confirmation required before deletion

**User Card Shows:**
- Avatar with first letter
- Username
- Email address
- Role badge (user/admin)
- Delete button

### 6. Recent Tasks List

**Features:**
- Shows last 20 tasks created
- Scrollable list
- Task details and metadata

**Task Card Shows:**
- Task title
- Creation date
- Assignee (if any)
- Status badge (To Do/In Progress/Done)
- Priority badge (if high priority)

**Status Colors:**
- To Do: Cyan
- In Progress: Amber
- Done: Emerald

---

## API Endpoints Used

### GET /api/admin/stats
Returns system statistics:
```json
{
  "totalUsers": 5,
  "totalTasks": 42,
  "completedTasks": 15,
  "highPriorityTasks": 8,
  "completionRate": 36
}
```

### GET /api/admin/users
Returns all users:
```json
[
  {
    "_id": "...",
    "username": "alexdoe",
    "email": "alex@example.com",
    "role": "user",
    "createdAt": "2026-03-20T..."
  }
]
```

### GET /api/admin/tasks
Returns all tasks:
```json
[
  {
    "_id": "...",
    "title": "Setup CI/CD",
    "status": "doing",
    "priority": "high",
    "assignee": "Alex",
    "createdAt": "2026-03-27T..."
  }
]
```

### DELETE /api/admin/users/:id
Deletes user and their tasks:
```json
{
  "message": "User and associated tasks deleted successfully"
}
```

---

## How It Works

### Data Loading Flow

```
1. Component mounts
   ↓
2. useEffect() triggers loadData()
   ↓
3. Three parallel API calls:
   - adminAPI.getStats()
   - adminAPI.getUsers()
   - adminAPI.getTasks()
   ↓
4. Promise.all() waits for all responses
   ↓
5. State updated with data
   ↓
6. UI re-renders with new data
```

### Error Handling

**If Backend Not Running:**
- Shows error screen
- Displays helpful message
- Provides commands to start server
- "Try Again" button to retry

**Error Screen Shows:**
- Alert icon
- Error message
- Command to start backend
- Retry button

### Refresh Functionality

**Manual Refresh:**
- Click "Refresh" button (top right)
- Reloads all data from API
- Updates all charts and lists

**Auto-refresh:**
- Currently manual only
- Can be enhanced with polling

---

## Charts Implementation

### Using Recharts Library

**Bar Chart (Status Distribution):**
```javascript
<BarChart data={statusData}>
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip />
  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
    {statusData.map((entry, index) => (
      <Cell key={index} fill={entry.color} />
    ))}
  </Bar>
</BarChart>
```

**Pie Chart (Priority Distribution):**
```javascript
<PieChart>
  <Pie
    data={priorityData}
    innerRadius={60}
    outerRadius={90}
    paddingAngle={5}
    dataKey="value"
  >
    {priorityData.map((entry, index) => (
      <Cell key={index} fill={entry.color} />
    ))}
  </Pie>
</PieChart>
```

**Line Chart (Activity):**
```javascript
<LineChart data={activityData}>
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
  <Line
    type="monotone"
    dataKey="tasks"
    stroke="#06b6d4"
    strokeWidth={2}
  />
</LineChart>
```

---

## Calculations

### Task Status Distribution
```javascript
const getTasksByStatus = () => {
  const todo = tasks.filter(t => t.status === 'todo').length;
  const doing = tasks.filter(t => t.status === 'doing').length;
  const done = tasks.filter(t => t.status === 'done').length;
  return [
    { name: 'To Do', value: todo, color: '#06b6d4' },
    { name: 'Doing', value: doing, color: '#f59e0b' },
    { name: 'Done', value: done, color: '#10b981' },
  ];
};
```

### Priority Distribution
```javascript
const getTasksByPriority = () => {
  const high = tasks.filter(t => t.priority === 'high').length;
  const low = tasks.filter(t => t.priority === 'low').length;
  return [
    { name: 'High Priority', value: high, color: '#f43f5e' },
    { name: 'Low Priority', value: low, color: '#3b82f6' },
  ];
};
```

### Recent Activity (Last 7 Days)
```javascript
const getRecentActivity = () => {
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayTasks = tasks.filter(t => {
      const taskDate = new Date(t.createdAt).toISOString().split('T')[0];
      return taskDate === dateStr;
    });
    
    last7Days.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      tasks: dayTasks.length
    });
  }
  return last7Days;
};
```

---

## Styling

### Color Scheme

**Status Colors:**
- To Do: `#06b6d4` (Cyan)
- Doing: `#f59e0b` (Amber)
- Done: `#10b981` (Emerald)

**Priority Colors:**
- High: `#f43f5e` (Rose)
- Low: `#3b82f6` (Blue)

**UI Colors:**
- Background: `#0a0e1a`
- Cards: `#161b26`
- Borders: `rgba(255,255,255,0.05)`
- Text: `#e5e7eb` (Gray 200)

### Animations

**Framer Motion:**
- Fade in on mount
- Stagger children (0.1s delay)
- Smooth transitions
- Hover effects

```javascript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: i * 0.1 }}
>
  {/* Content */}
</motion.div>
```

---

## User Management

### Deleting a User

**Process:**
1. Click trash icon next to user
2. Confirmation dialog appears
3. If confirmed:
   - DELETE request to `/api/admin/users/:id`
   - Backend deletes user from database
   - Backend deletes all user's tasks
   - Frontend refreshes data
   - Success toast notification

**Code:**
```javascript
const handleDeleteUser = async (userId) => {
  if (!confirm('Are you sure?')) return;
  
  try {
    await adminAPI.deleteUser(userId);
    toast.success('User deleted successfully');
    loadData(); // Refresh data
  } catch (error) {
    toast.error('Failed to delete user');
  }
};
```

**Backend Logic:**
```javascript
router.delete('/users/:id', async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  await Task.deleteMany({ userId: req.params.id });
  res.json({ message: 'User and tasks deleted' });
});
```

---

## Troubleshooting

### Issue: "Server Not Running" Error

**Cause:** Backend server not started

**Solution:**
```bash
# Start backend
npm run server:dev

# Or start both
npm start
```

### Issue: No Data Showing

**Cause:** No users or tasks in database

**Solution:**
1. Go to main dashboard
2. Create some tasks
3. Return to admin panel
4. Click "Refresh"

### Issue: Charts Not Rendering

**Cause:** Missing recharts library

**Solution:**
```bash
npm install recharts
```

### Issue: Delete Not Working

**Cause:** Backend route not configured

**Solution:**
- Check `server/routes/admin.js` exists
- Verify route is imported in `server/server.js`
- Check MongoDB connection

---

## Future Enhancements

### Planned Features

1. **Real-time Updates**
   - WebSocket integration
   - Live data refresh
   - Push notifications

2. **Advanced Filters**
   - Filter by date range
   - Filter by user
   - Filter by status/priority

3. **Export Data**
   - Export to CSV
   - Export to PDF
   - Generate reports

4. **User Roles**
   - Role-based access control
   - Permission management
   - Admin-only features

5. **Audit Log**
   - Track all changes
   - User activity log
   - System events

6. **Bulk Operations**
   - Bulk delete tasks
   - Bulk update status
   - Bulk assign users

---

## Security Considerations

### Current Implementation

⚠️ **Development Mode:**
- No authentication required
- All users can access admin panel
- No role verification

### Production Recommendations

1. **Add Authentication**
```javascript
// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

router.get('/stats', requireAdmin, async (req, res) => {
  // Admin-only endpoint
});
```

2. **Protect Routes**
- Add JWT authentication
- Verify admin role
- Log admin actions

3. **Rate Limiting**
- Limit delete operations
- Prevent abuse
- Monitor suspicious activity

---

## Performance

### Optimization Techniques

1. **Parallel API Calls**
```javascript
const [statsRes, usersRes, tasksRes] = await Promise.all([
  adminAPI.getStats(),
  adminAPI.getUsers(),
  adminAPI.getTasks(),
]);
```

2. **Pagination**
- Show only 20 recent tasks
- Load more on demand
- Reduce initial load time

3. **Memoization**
- Cache chart calculations
- Prevent unnecessary re-renders
- Use React.memo for components

4. **Lazy Loading**
- Load charts only when visible
- Defer heavy computations
- Improve initial render

---

## Summary

The Admin Panel provides:

✅ Real-time system statistics
✅ Visual data representation with charts
✅ User management capabilities
✅ Task oversight and monitoring
✅ Activity tracking
✅ Responsive design
✅ Error handling
✅ Smooth animations

**Access:** http://localhost:5173/dashboard/admin

**Requirements:**
- Backend server running
- MongoDB connected
- Admin role (future)

---

**Last Updated:** March 27, 2026
**Version:** 1.0.0
