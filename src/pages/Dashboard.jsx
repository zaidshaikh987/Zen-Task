import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Board from '@/components/kanban/Board';
import { Button } from '@/components/ui/button';
import { Plus, Search, Users, Target, Flame } from 'lucide-react';
import { useKanban } from '@/lib/KanbanContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import VoiceInput from '@/components/dashboard/VoiceInput';
import FocusMode from '@/components/dashboard/FocusMode';
import StandupPanel from '@/components/dashboard/StandupPanel';
import KeyboardShortcuts from '@/components/dashboard/KeyboardShortcuts';
import CursorPresence from '@/components/dashboard/CursorPresence';

export default function Dashboard() {
  const { createTask, tasks } = useKanban();
  const [open, setOpen] = useState(false);
  const [focusModeOpen, setFocusModeOpen] = useState(false);
  const [standupOpen, setStandupOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'low',
    status: 'todo',
  });

  const remaining = tasks.filter(t => t.status !== 'done').length;
  const doneCount = tasks.filter(t => t.status === 'done').length;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      if (e.key === 'n' || e.key === 'N') {
        setOpen(true);
      } else if (e.key === 'f' || e.key === 'F') {
        setFocusModeOpen(true);
      } else if (e.key === 's' || e.key === 'S') {
        setStandupOpen(true);
      } else if (e.key === '?') {
        setShortcutsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    createTask(formData);
    setFormData({ title: '', description: '', priority: 'low', status: 'todo' });
    setOpen(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col h-full"
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-xl font-semibold text-cyan-400">Your Board</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Drag tasks between columns to update their status</p>
            </div>
            
            {/* Task Counter */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/20">
              <Flame className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-400">{remaining} tasks remaining today</span>
              <span className="text-xs text-muted-foreground">({doneCount} done)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-9 w-48 h-9 bg-background/50 border-border/50"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] bg-muted rounded border border-border">
                ⌘K
              </kbd>
            </div>

            <VoiceInput />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStandupOpen(true)}
              className="h-9"
            >
              <Users className="h-4 w-4 mr-2" />
              Standup
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFocusModeOpen(true)}
              className="h-9"
            >
              <Target className="h-4 w-4 mr-2" />
              Focus
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-9 bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-border">
                <DialogHeader>
                  <DialogTitle className="font-grotesk">Create New Task</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter task title"
                      className="glass-card"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter task description"
                      className="glass-card"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                      <SelectTrigger className="glass-card">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger className="glass-card">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="doing">Doing</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full gradient-bg text-primary-foreground">
                    Create Task
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-emerald-500/10">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-emerald-400">Live</span>
            </div>

            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
              MZ
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <Board />
        </div>
      </motion.div>

      <CursorPresence />
      <FocusMode isOpen={focusModeOpen} onClose={() => setFocusModeOpen(false)} />
      <StandupPanel isOpen={standupOpen} onClose={() => setStandupOpen(false)} />
      <KeyboardShortcuts isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </>
  );
}
