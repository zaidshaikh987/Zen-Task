import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAKE_USERS = [
  { id: 1, name: 'Alex', color: '#06b6d4' },
  { id: 2, name: 'Jordan', color: '#a855f7' },
  { id: 3, name: 'Sam', color: '#f43f5e' },
];

export default function CursorPresence() {
  const [cursors, setCursors] = useState([]);

  useEffect(() => {
    const updateCursors = () => {
      setCursors(
        FAKE_USERS.map(user => ({
          ...user,
          x: Math.random() * (window.innerWidth - 200) + 100,
          y: Math.random() * (window.innerHeight - 200) + 100,
        }))
      );
    };

    updateCursors();
    const interval = setInterval(updateCursors, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {cursors.map(cursor => (
        <motion.div
          key={cursor.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1, x: cursor.x, y: cursor.y }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          className="fixed pointer-events-none z-50"
          style={{ left: 0, top: 0 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M5.65376 12.3673L8.84496 15.5585L12.9316 8.29736L5.65376 12.3673Z"
              fill={cursor.color}
            />
          </svg>
          <div
            className="ml-4 -mt-2 px-2 py-1 rounded text-xs font-medium text-white whitespace-nowrap"
            style={{ backgroundColor: cursor.color }}
          >
            {cursor.name}
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
