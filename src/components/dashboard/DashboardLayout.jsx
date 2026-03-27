import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Settings, Plus, Search, Users, Mic, Video, Circle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useKanban } from '@/lib/KanbanContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import VoiceInput from './VoiceInput';
import StandupPanel from './StandupPanel';
import FocusMode from './FocusMode';
import KeyboardShortcuts from './KeyboardShortcuts';
import ChatBot from '@/components/chat/ChatBot';

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { tasks, createTask } = useKanban();
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [showStandup, setShowStandup] = useState(false);
  const [showFocus, setShowFocus] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showChatBot, setShowChatBot] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'low',
    assignee: '',
  });

  const sidebarLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Board' },
    { to: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];
  
  const isActiveBoard = location.pathname === '/dashboard';

  const handleSubmit = (e) => {
    e.preventDefault();
    createTask(newTask);
    setNewTask({
      title: '',
      description: '',
      status: 'todo',
      priority: 'low',
      assignee: '',
    });
    setIsNewTaskOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#0a0e1a] text-gray-100 overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-56 bg-[#0d1117] border-r border-white/5 flex flex-col"
      >
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">Z</span>
            </div>
            <h1 className="text-xl font-bold text-white">
              ZenTasks
            </h1>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link key={link.to} to={link.to}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm',
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="font-medium">{link.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 bg-[#0d1117]/80 backdrop-blur-sm border-b border-white/5 flex items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className={cn(
                  'text-sm font-medium transition-colors',
                  !isActiveBoard ? 'text-gray-500 hover:text-gray-300' : 'text-white'
                )}
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className={cn(
                  'text-sm font-medium transition-colors pb-3',
                  isActiveBoard ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500 hover:text-gray-300'
                )}
              >
                Active Board
              </button>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/20">
              <span className="text-amber-400 font-medium text-xs">⚡ {tasks.filter(t => t.status !== 'done').length} tasks remaining today</span>
              <span className="text-gray-600 text-xs">({tasks.filter(t => t.status === 'done').length}/{tasks.length} done)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
              <Input
                placeholder="Search..."
                className="pl-9 pr-12 h-8 w-48 bg-white/5 border-white/10 focus:border-cyan-500/50 text-xs"
              />
              <kbd className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] bg-white/5 border border-white/10 rounded">
                ⌘K
              </kbd>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowStandup(true)}
              className="h-8 text-xs text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10"
            >
              <Users className="h-3.5 w-3.5 mr-1.5" />
              Standup
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFocus(true)}
              className="h-8 text-xs text-gray-400 hover:text-purple-400 hover:bg-purple-500/10"
            >
              <Circle className="h-3.5 w-3.5 mr-1.5" />
              Focus
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowVoiceInput(true)}
              className="h-8 w-8 p-0 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10"
            >
              <Mic className="h-3.5 w-3.5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10"
            >
              <Video className="h-3.5 w-3.5" />
            </Button>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-medium text-emerald-400">Live</span>
            </div>

            <Dialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
              <DialogTrigger asChild>
                <Button className="h-8 text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1a1f2e] border-white/10">
                <DialogHeader>
                  <DialogTitle className="text-white">Create New Task</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-gray-300">Title</Label>
                    <Input
                      id="title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="Enter task title"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-gray-300">Description</Label>
                    <Textarea
                      id="description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="Enter task description"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="status" className="text-gray-300">Status</Label>
                      <Select value={newTask.status} onValueChange={(value) => setNewTask({ ...newTask, status: value })}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1f2e] border-white/10">
                          <SelectItem value="todo">To Do</SelectItem>
                          <SelectItem value="doing">Doing</SelectItem>
                          <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority" className="text-gray-300">Priority</Label>
                      <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value })}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1f2e] border-white/10">
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="assignee" className="text-gray-300">Assignee</Label>
                    <Input
                      id="assignee"
                      value={newTask.assignee}
                      onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="Enter assignee name"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                    Create Task
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Avatar className="h-7 w-7 border-2 border-cyan-500/30 cursor-pointer">
              <AvatarFallback className="bg-gradient-to-br from-cyan-500/30 to-blue-500/30 text-cyan-300 text-[10px] font-medium">
                MZ
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-hidden bg-[#0a0e1a]">
          <Outlet />
        </main>
      </div>

      <VoiceInput isOpen={showVoiceInput} onClose={() => setShowVoiceInput(false)} />
      <StandupPanel isOpen={showStandup} onClose={() => setShowStandup(false)} />
      <FocusMode isOpen={showFocus} onClose={() => setShowFocus(false)} />
      <KeyboardShortcuts
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
        onNewTask={() => setIsNewTaskOpen(true)}
        onFocus={() => setShowFocus(true)}
        onStandup={() => setShowStandup(true)}
      />
      
      {/* Floating Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowChatBot(!showChatBot)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg shadow-purple-500/30 flex items-center justify-center z-50 hover:shadow-purple-500/50 transition-shadow"
      >
        <MessageSquare className="h-6 w-6 text-white" />
      </motion.button>
      
      {showChatBot && <ChatBot onClose={() => setShowChatBot(false)} />}
    </div>
  );
}
