import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

export default function TrashZone({ isVisible }) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="flex items-center gap-2 px-6 py-4 rounded-xl bg-destructive/20 border-2 border-destructive/50 backdrop-blur-sm">
        <Trash2 className="h-5 w-5 text-destructive" />
        <span className="text-sm font-medium text-destructive">Drop here to delete</span>
      </div>
    </motion.div>
  );
}
