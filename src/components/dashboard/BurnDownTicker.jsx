import { useKanban } from '@/lib/KanbanContext';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BurnDownTicker() {
  const { tasks } = useKanban();
  const remaining = tasks.filter(t => t.status !== 'done').length;

  // Calculate urgency based on time of day
  const hour = new Date().getHours();
  const urgency = hour < 12 ? 'low' : hour < 17 ? 'medium' : 'high';

  const urgencyColors = {
    low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    high: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium',
        urgencyColors[urgency]
      )}
    >
      <Flame className="h-4 w-4" />
      <span>{remaining} tasks remaining today</span>
    </motion.div>
  );
}
