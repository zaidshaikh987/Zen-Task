import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { adminAPI, tasksAPI } from '@/lib/api';
import { Users, ListTodo, CheckCircle2, TrendingUp, Trash2, RefreshCw, AlertCircle, Activity, Clock, Target } from 'lucide-react';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const STATUS_COLORS = {
  todo: '#06b6d4',
  doing: '#f59e0b',
  done: '#10b981'
};

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, usersRes, tasksRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers(),
        adminAPI.getTasks(),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error('Failed to load admin data:', error);
      setError('Failed to connect to server. Make sure the backend is running on port 5000.');
      toast.error('Failed to load admin data. Check if server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user and all their tasks?')) return;
    
    try {
      await adminAPI.deleteUser(userId);
      toast.success('User deleted successfully');
      loadData();
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error('Failed to delete user');
    }
  };

  // Calculate additional stats
  const getTasksByStatus = () => {
    const todo = tasks.filter(t => t.status === 'todo').length;
    const doing = tasks.filter(t => t.status === 'doing').length;
    const done = tasks.filter(t => t.status === 'done').length;
    return [
      { name: 'To Do', value: todo, color: STATUS_COLORS.todo },
      { name: 'Doing', value: doing, color: STATUS_COLORS.doing },
      { name: 'Done', value: done, color: STATUS_COLORS.done },
    ];
  };

  const getTasksByPriority = () => {
    const high = tasks.filter(t => t.priority === 'high').length;
    const low = tasks.filter(t => t.priority === 'low').length;
    return [
      { name: 'High Priority', value: high, color: '#f43f5e' },
      { name: 'Low Priority', value: low, color: '#3b82f6' },
    ];
  };

  const getRecentActivity = () => {
    // Group tasks by date (last 7 days)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <RefreshCw className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <AlertCircle className="h-12 w-12 text-rose-400" />
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-200 mb-2">Server Not Running</h2>
          <p className="text-sm text-gray-400 mb-4 max-w-md">{error}</p>
          <div className="space-y-2 text-xs text-gray-500 mb-4">
            <p>To start the backend server, run:</p>
            <code className="block bg-[#161b26] px-4 py-2 rounded border border-white/10">
              npm run server:dev
            </code>
            <p className="mt-2">Or start both frontend and backend:</p>
            <code className="block bg-[#161b26] px-4 py-2 rounded border border-white/10">
              npm start
            </code>
          </div>
          <Button onClick={loadData} className="bg-cyan-500 hover:bg-cyan-600">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const statusData = getTasksByStatus();
  const priorityData = getTasksByPriority();
  const activityData = getRecentActivity();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-cyan-400">Admin Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">System overview and management</p>
        </div>
        <Button onClick={loadData} variant="outline" size="sm" className="border-white/10 hover:bg-white/5">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
            { label: 'Total Tasks', value: stats.totalTasks, icon: ListTodo, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
            { label: 'Completed', value: stats.completedTasks, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
            { label: 'High Priority', value: stats.highPriorityTasks, icon: TrendingUp, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-[#161b26]/80 backdrop-blur-sm border-white/5">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">{stat.label}</p>
                      <p className="text-3xl font-bold mt-1 text-gray-200">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bg} ${stat.color} border ${stat.border}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Task Status Distribution */}
        <Card className="bg-[#161b26]/80 backdrop-blur-sm border-white/5">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-200 flex items-center gap-2">
              <Target className="h-4 w-4 text-cyan-400" />
              Task Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#161b26',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card className="bg-[#161b26]/80 backdrop-blur-sm border-white/5">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-200 flex items-center gap-2">
              <Activity className="h-4 w-4 text-rose-400" />
              Priority Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#161b26',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-200">{tasks.length}</p>
                  <p className="text-xs text-gray-400">Total</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Chart */}
      <Card className="bg-[#161b26]/80 backdrop-blur-sm border-white/5">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-200 flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-400" />
            Task Creation Activity (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    background: '#161b26',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="tasks"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={{ fill: '#06b6d4', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-[#161b26]/80 backdrop-blur-sm border-white/5">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-200">Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {users.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No users found</p>
            ) : (
              users.map(user => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-4 rounded-lg bg-[#0a0e1a] hover:bg-[#0d1117] transition-colors border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center border border-cyan-500/30">
                      <span className="text-sm font-medium text-cyan-300">
                        {user.username?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-200">{user.username}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
                      {user.role}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Tasks */}
      <Card className="bg-[#161b26]/80 backdrop-blur-sm border-white/5">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-200">Recent Tasks ({tasks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {tasks.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No tasks found</p>
            ) : (
              tasks.slice(0, 20).map(task => (
                <div
                  key={task._id}
                  className="flex items-center justify-between p-4 rounded-lg bg-[#0a0e1a] border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate text-gray-200">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-400">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </p>
                      {task.assignee && (
                        <>
                          <span className="text-gray-600">•</span>
                          <p className="text-xs text-gray-400">Assigned to {task.assignee}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full border font-medium ${
                      task.status === 'done' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : task.status === 'doing'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                    }`}>
                      {task.status === 'todo' ? 'To Do' : task.status === 'doing' ? 'In Progress' : 'Done'}
                    </span>
                    {task.priority === 'high' && (
                      <span className="text-[10px] px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
                        High
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
