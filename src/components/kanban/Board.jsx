import { useCallback, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useKanban } from '@/lib/KanbanContext';
import { motion } from 'framer-motion';
import { Circle, Loader2, CheckCircle2, GripVertical, Clock, Sparkles, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { mockAI } from '@/lib/mockAI';
import { toast } from 'sonner';
import TrashZone from '@/components/dashboard/TrashZone';

const WIP_LIMIT = 3;

const statusConfig = {
  todo: {
    label: 'To Do',
    icon: Circle,
    color: 'text-cyan-400',
    dotColor: 'bg-cyan-400',
    bgAccent: 'bg-cyan-500/5 border-cyan-500/20',
  },
  doing: {
    label: 'Doing',
    icon: Loader2,
    color: 'text-amber-400',
    dotColor: 'bg-amber-400',
    bgAccent: 'bg-amber-500/5 border-amber-500/20',
  },
  done: {
    label: 'Done',
    icon: CheckCircle2,
    color: 'text-emerald-400',
    dotColor: 'bg-emerald-400',
    bgAccent: 'bg-emerald-500/5 border-emerald-500/20',
  },
};

function TaskCard({ task, isDragging, dragHandleProps }) {
  // Calculate overdue decay effect
  const getDecayStyle = () => {
    if (task.status !== 'doing') return {};
    const created = new Date(task.created_date || task.updated_date || Date.now());
    const hoursOld = (Date.now() - created.getTime()) / (1000 * 60 * 60);
    const decayRatio = Math.min(Math.max((hoursOld - 2) / 22, 0), 1);
    if (decayRatio === 0) return {};
    return {
      boxShadow: `inset 0 0 0 1px rgba(244,63,94,${decayRatio * 0.6}), 0 0 ${decayRatio * 20}px rgba(244,63,94,${decayRatio * 0.15})`,
    };
  };

  const timeAgo = task.created_date
    ? formatDistanceToNow(new Date(task.created_date), { addSuffix: false })
    : null;
  
  // Get border gradient based on status
  const getBorderClass = () => {
    if (task.priority === 'high') return 'border-rose-500/40';
    if (task.status === 'todo') return 'border-cyan-500/30';
    if (task.status === 'doing') return 'border-amber-500/30';
    return 'border-emerald-500/30';
  };
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: isDragging ? 2 : 0,
        scale: isDragging ? 1.04 : 1,
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: isDragging ? 1.04 : 1.015 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={getDecayStyle()}
      className={cn(
        'rounded-lg p-4 cursor-pointer group transition-all duration-200',
        'bg-gradient-to-br from-[#1a1f2e]/90 to-[#161b26]/90 backdrop-blur-sm',
        'border-2',
        getBorderClass(),
        isDragging && 'shadow-2xl ring-2 ring-cyan-500/50 z-50',
        !isDragging && 'hover:from-[#1e2332] hover:to-[#1a1f2e]',
        task.status === 'done' && 'opacity-60'
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <div
            {...(dragHandleProps || {})}
            className="mt-0.5 text-gray-600 opacity-0 group-hover:opacity-60 transition-opacity shrink-0 cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={cn(
              'font-medium text-sm leading-snug text-gray-100',
              task.status === 'done' && 'line-through text-gray-500'
            )}>
              {task.title}
            </h4>
            {task.description && (
              <p className="mt-2 text-xs text-gray-400 line-clamp-2 whitespace-pre-line">
                {task.description}
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="secondary"
            className={cn(
              'text-[10px] px-2 py-0.5 font-medium rounded-full',
              task.priority === 'high'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
            )}
          >
            {task.priority === 'high' ? 'High' : 'Low'}
          </Badge>
          
          {timeAgo && (
            <span className="flex items-center gap-1 text-[10px] text-gray-500">
              <Clock className="h-2.5 w-2.5" />
              {timeAgo}
            </span>
          )}
          
          {task.assignee && (
            <div className="h-5 w-5 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center shrink-0 border border-cyan-500/40">
              <span className="text-[9px] font-medium text-cyan-300">
                {task.assignee[0]}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <span className={cn(
            'text-[10px] px-2 py-0.5 rounded-full border font-medium',
            task.status === 'todo' && 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30',
            task.status === 'doing' && 'text-amber-300 bg-amber-500/10 border-amber-500/30',
            task.status === 'done' && 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30'
          )}>
            {task.status === 'todo' ? 'To Do' : task.status === 'doing' ? 'In Progress' : 'Done'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function Column({ status }) {
  const { getTasksByStatus, updateTask } = useKanban();
  const tasks = getTasksByStatus(status);
  const config = statusConfig[status];
  const wipExceeded = status === 'doing' && tasks.length > WIP_LIMIT;
  const [sorting, setSorting] = useState(false);

  const handleAISort = async () => {
    if (tasks.length < 2) {
      toast.info('Need at least 2 tasks to sort');
      return;
    }

    setSorting(true);
    const result = await mockAI.sortTasks(tasks);
    setSorting(false);

    if (result?.ordered_ids?.length) {
      result.ordered_ids.forEach((id, index) => {
        updateTask(id, { order: index });
      });
      toast.success(`AI sorted! ${result.reason}`);
    } else {
      toast.error('AI sort failed. Try again.');
    }
  };

  return (
    <div className="flex flex-col min-h-0 flex-1 min-w-[320px]">
      <motion.div
        animate={wipExceeded ? { x: [0, -4, 4, -4, 4, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="mb-4 flex items-center justify-between px-1"
      >
        <div className="flex items-center gap-2">
          <span className={cn('h-2 w-2 rounded-full', config.dotColor)} />
          <h3 className={cn(
            'font-medium text-sm',
            wipExceeded ? 'text-amber-400' : config.color
          )}>
            {config.label}
          </h3>
          <span className={cn(
            'rounded-full px-2 py-0.5 text-[10px] font-medium',
            wipExceeded
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              : 'bg-white/5 text-gray-400 border border-white/10'
          )}>
            {tasks.length}
          </span>
          {wipExceeded && (
            <span className="flex items-center gap-1 text-[10px] text-amber-400 font-medium">
              <AlertTriangle className="h-3 w-3" />
              WIP Limit!
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {tasks.length >= 2 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAISort}
              disabled={sorting}
              className="h-6 px-2 text-[10px] text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10"
            >
              {sorting ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : (
                <Sparkles className="h-3 w-3 mr-1" />
              )}
              AI Sort
            </Button>
          )}
        </div>
      </motion.div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              'flex-1 rounded-xl p-3 space-y-3 min-h-[400px] transition-all duration-200',
              'bg-[#0d1117]/50 backdrop-blur-sm',
              snapshot.isDraggingOver
                ? 'ring-2 ring-cyan-500/30 bg-cyan-500/5'
                : wipExceeded
                ? 'ring-2 ring-amber-500/30 bg-amber-500/5'
                : 'ring-1 ring-white/5'
            )}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={provided.draggableProps.style}
                  >
                    <TaskCard
                      task={task}
                      isDragging={snapshot.isDragging}
                      dragHandleProps={provided.dragHandleProps}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default function Board() {
  const { moveTask, deleteTask, getTasksByStatus } = useKanban();
  const [isDragging, setIsDragging] = useState(false);

  const onDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const onDragEnd = useCallback((result) => {
    setIsDragging(false);
    const { destination, source, draggableId } = result;

    if (!destination) return;

    // Check if dropped in trash zone
    if (destination.droppableId === 'trash') {
      deleteTask(draggableId);
      toast.success('Task deleted');
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const taskId = draggableId;
    const newStatus = destination.droppableId;
    const destTasks = getTasksByStatus(newStatus).filter(t => t.id !== taskId);

    let newOrder = 0;
    if (destTasks.length === 0) {
      newOrder = 0;
    } else if (destination.index === 0) {
      newOrder = (destTasks[0]?.order || 0) - 1;
    } else if (destination.index >= destTasks.length) {
      newOrder = (destTasks[destTasks.length - 1]?.order || 0) + 1;
    } else {
      const before = destTasks[destination.index - 1]?.order || 0;
      const after = destTasks[destination.index]?.order || 0;
      newOrder = (before + after) / 2;
    }

    moveTask(taskId, newStatus, newOrder);
  }, [moveTask, deleteTask, getTasksByStatus]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="relative flex gap-4 h-full overflow-x-auto pb-4"
    >
      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <Column status="todo" />
        <Column status="doing" />
        <Column status="done" />
        
        {/* Trash Zone Droppable */}
        <Droppable droppableId="trash">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ display: 'none' }}
            >
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      <TrashZone isVisible={isDragging} />
    </motion.div>
  );
}
