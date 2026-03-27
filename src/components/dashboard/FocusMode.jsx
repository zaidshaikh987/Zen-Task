import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useKanban } from '@/lib/KanbanContext';
import { X, Play, Pause, SkipForward } from 'lucide-react';
import confetti from 'canvas-confetti';

const POMODORO_DURATION = 25 * 60; // 25 minutes in seconds

export default function FocusMode({ isOpen, onClose }) {
  const { tasks, updateTask } = useKanban();
  const [timeLeft, setTimeLeft] = useState(POMODORO_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [focusTask, setFocusTask] = useState(null);

  useEffect(() => {
    if (isOpen && !focusTask) {
      // Find highest priority task in "doing"
      const doingTasks = tasks.filter(t => t.status === 'doing');
      const highPriority = doingTasks.find(t => t.priority === 'high') || doingTasks[0];
      setFocusTask(highPriority);
    }
  }, [isOpen, tasks, focusTask]);

  useEffect(() => {
    if (!isRunning || !isOpen) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isOpen]);

  const handleComplete = () => {
    if (focusTask) {
      updateTask(focusTask.id, { status: 'done' });
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#a855f7', '#3b82f6', '#f43f5e'],
      });
    }
    onClose();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((POMODORO_DURATION - timeLeft) / POMODORO_DURATION) * 100;

  if (!isOpen || !focusTask) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white"
        >
          <X className="h-5 w-5" />
        </Button>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-8 max-w-2xl"
        >
          <div className="space-y-2">
            <h2 className="font-grotesk text-4xl font-bold text-white">Focus Mode</h2>
            <p className="text-white/60">One task at a time</p>
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="relative w-64 h-64 mx-auto"
          >
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 120}`}
                strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-6xl font-bold font-grotesk text-white">{formatTime(timeLeft)}</p>
                <p className="text-sm text-white/60 mt-2">Pomodoro Timer</p>
              </div>
            </div>
          </motion.div>

          <div className="glass-card p-6 rounded-xl border border-white/10">
            <h3 className="font-semibold text-white mb-2">{focusTask.title}</h3>
            {focusTask.description && (
              <p className="text-sm text-white/60">{focusTask.description}</p>
            )}
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button
              onClick={() => setIsRunning(!isRunning)}
              size="lg"
              className="gradient-bg text-white"
            >
              {isRunning ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
              {isRunning ? 'Pause' : 'Start'}
            </Button>
            <Button
              onClick={handleComplete}
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <SkipForward className="h-5 w-5 mr-2" />
              Complete Now
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
