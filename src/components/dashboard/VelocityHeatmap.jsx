import { useKanban } from '@/lib/KanbanContext';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function VelocityHeatmap() {
  const { tasks } = useKanban();

  // Generate last 12 weeks of data
  const weeks = 12;
  const daysPerWeek = 7;
  const today = new Date();
  
  const heatmapData = [];
  for (let week = weeks - 1; week >= 0; week--) {
    const weekData = [];
    for (let day = 0; day < daysPerWeek; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (week * 7 + (6 - day)));
      
      // Count tasks completed on this day
      const completedOnDay = tasks.filter(t => {
        if (t.status !== 'done' || !t.updated_date) return false;
        const taskDate = new Date(t.updated_date);
        return taskDate.toDateString() === date.toDateString();
      }).length;
      
      weekData.push({
        date: date.toISOString(),
        count: completedOnDay,
      });
    }
    heatmapData.push(weekData);
  }

  const getIntensityClass = (count) => {
    if (count === 0) return 'bg-muted/30';
    if (count === 1) return 'bg-emerald-500/30';
    if (count === 2) return 'bg-emerald-500/50';
    if (count === 3) return 'bg-emerald-500/70';
    return 'bg-emerald-500';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-grotesk text-sm font-semibold">Team Velocity</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map(i => (
              <div
                key={i}
                className={cn('h-3 w-3 rounded-sm', getIntensityClass(i))}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
      
      <div className="flex gap-1 overflow-x-auto pb-2">
        {heatmapData.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day, dayIndex) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (weekIndex * 7 + dayIndex) * 0.01 }}
                className={cn(
                  'h-3 w-3 rounded-sm transition-all hover:ring-2 hover:ring-primary cursor-pointer',
                  getIntensityClass(day.count)
                )}
                title={`${new Date(day.date).toLocaleDateString()}: ${day.count} tasks`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
