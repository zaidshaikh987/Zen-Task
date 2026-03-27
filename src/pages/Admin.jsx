import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { adminAPI } from '@/lib/api';
import { Users, ListTodo, CheckCircle2, TrendingUp, Trash2, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-cyan-400">Admin Dashboard</h1>
          <p className="text-xs text-gray-400 mt-1">System overview and management</p>
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
            { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
            { label: 'Total Tasks', value: stats.totalTasks, icon: ListTodo, color: 'text-amber-400', bg: 'bg-amber-500/10' },
            { label: 'Completed', value: stats.completedTasks, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'High Priority', value: stats.highPriorityTasks, icon: TrendingUp, color: 'text-rose-400', bg: 'bg-rose-500/10' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-[#161b26] border-white/5">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">{stat.label}</p>
                      <p className="text-3xl font-bold font-grotesk mt-1 text-gray-200">{stat.value}</p>
                    </div>
                    <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Users Table */}
      <Card className="bg-[#161b26] border-white/5">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-200">Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {users.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No users found</p>
            ) : (
              users.map(user => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#0a0e1a] hover:bg-[#0d1117] transition-colors border border-white/5"
                >
                  <div>
                    <p className="font-medium text-sm text-gray-200">{user.username}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
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
      <Card className="bg-[#161b26] border-white/5">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-200">Recent Tasks ({tasks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {tasks.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No tasks found</p>
            ) : (
              tasks.slice(0, 20).map(task => (
                <div
                  key={task._id}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#0a0e1a] border border-white/5"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate text-gray-200">{task.title}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-1 rounded border ${
                      task.status === 'done' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : task.status === 'doing'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                    }`}>
                      {task.status}
                    </span>
                    {task.priority === 'high' && (
                      <span className="text-[10px] px-2 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
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
