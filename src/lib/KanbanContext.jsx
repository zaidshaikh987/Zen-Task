import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { tasksAPI } from './api';

const KanbanContext = createContext(null);

// Initial demo tasks (used as fallback if API fails)
const initialTasks = [
  {
    id: '1',
    title: 'Setup CI/CD pipeline',
    description: 'GitHub Actions for automated deployments',
    status: 'todo',
    priority: 'high',
    assignee: 'Alex',
    order: 0,
    created_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Integrate payment system',
    description: 'Stripe integration for premium features',
    status: 'todo',
    priority: 'high',
    assignee: 'Sara',
    order: 1,
    created_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Build a voice navigation bot',
    description: 'AI speech and comprehension and low user drag browser principle',
    status: 'todo',
    priority: 'high',
    assignee: 'Marco',
    order: 2,
    created_date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updated_date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: 'Implement auth flow',
    description: 'OAuth login with Google and GitHub providers',
    status: 'doing',
    priority: 'high',
    assignee: 'Alex',
    order: 0,
    created_date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updated_date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    title: 'Build API endpoints',
    description: 'REST endpoints for task CRUD operations',
    status: 'doing',
    priority: 'low',
    assignee: 'Sara',
    order: 1,
    created_date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    updated_date: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    title: 'Setup database schema',
    description: 'Define tables for users, tasks, and teams',
    status: 'done',
    priority: 'high',
    assignee: 'Marco',
    order: 0,
    created_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '7',
    title: 'Design hero section',
    description: 'Create responsive hero with gradient backgrounds and animations',
    status: 'done',
    priority: 'high',
    assignee: 'Alex',
    order: 1,
    created_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function KanbanProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useLocalStorage, setUseLocalStorage] = useState(false);
  const userId = 'default-user'; // For demo purposes

  // Load tasks from API or localStorage
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const response = await tasksAPI.getAll(userId);
      const apiTasks = response.data.map(task => ({
        ...task,
        id: task._id,
        created_date: task.createdAt,
        updated_date: task.updatedAt,
      }));
      
      if (apiTasks.length === 0) {
        // If no tasks in DB, create initial demo tasks
        await Promise.all(initialTasks.map(task => 
          tasksAPI.create({ ...task, userId })
        ));
        await loadTasks(); // Reload after creating demo tasks
      } else {
        setTasks(apiTasks);
        setUseLocalStorage(false);
      }
    } catch (error) {
      console.error('Failed to load tasks from API, using localStorage:', error);
      // Fallback to localStorage
      const saved = localStorage.getItem('zentasks_tasks');
      setTasks(saved ? JSON.parse(saved) : initialTasks);
      setUseLocalStorage(true);
      toast.error('Using offline mode. Start the server for full features.');
    } finally {
      setIsLoading(false);
    }
  };

  // Save to localStorage when in offline mode
  useEffect(() => {
    if (useLocalStorage && tasks.length > 0) {
      localStorage.setItem('zentasks_tasks', JSON.stringify(tasks));
    }
  }, [tasks, useLocalStorage]);

  const createTask = useCallback(async (taskData) => {
    try {
      if (useLocalStorage) {
        // Offline mode
        const tasksInColumn = tasks.filter(t => t.status === taskData.status);
        const maxOrder = tasksInColumn.reduce((max, t) => Math.max(max, t.order || 0), 0);
        
        const newTask = {
          id: Date.now().toString(),
          ...taskData,
          order: maxOrder + 1,
          created_date: new Date().toISOString(),
          updated_date: new Date().toISOString(),
        };

        setTasks(prev => [...prev, newTask]);
        toast.success('Task created (offline)');
      } else {
        // Online mode
        const response = await tasksAPI.create({ ...taskData, userId });
        const newTask = {
          ...response.data,
          id: response.data._id,
          created_date: response.data.createdAt,
          updated_date: response.data.updatedAt,
        };
        setTasks(prev => [...prev, newTask]);
        toast.success('Task created!');
      }
    } catch (error) {
      console.error('Failed to create task:', error);
      toast.error('Failed to create task');
    }
  }, [tasks, userId, useLocalStorage]);

  const updateTask = useCallback(async (taskId, data) => {
    try {
      if (useLocalStorage) {
        // Offline mode
        setTasks(prev => prev.map(t => {
          if (t.id === taskId) {
            const updated = { ...t, ...data, updated_date: new Date().toISOString() };
            
            if (data.status === 'done' && t.status !== 'done' && t.priority === 'high') {
              confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#06b6d4', '#a855f7', '#3b82f6', '#f43f5e'],
              });
              toast.success('Task completed! 🎉');
            } else if (data.status === 'done' && t.status !== 'done') {
              toast.success('Task completed! 🎉');
            }
            
            return updated;
          }
          return t;
        }));
      } else {
        // Online mode
        const response = await tasksAPI.update(taskId, data);
        const updatedTask = {
          ...response.data,
          id: response.data._id,
          created_date: response.data.createdAt,
          updated_date: response.data.updatedAt,
        };
        
        setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
        
        const oldTask = tasks.find(t => t.id === taskId);
        if (data.status === 'done' && oldTask?.status !== 'done' && oldTask?.priority === 'high') {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#06b6d4', '#a855f7', '#3b82f6', '#f43f5e'],
          });
          toast.success('Task completed! 🎉');
        } else if (data.status === 'done' && oldTask?.status !== 'done') {
          toast.success('Task completed! 🎉');
        }
      }
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error('Failed to update task');
    }
  }, [tasks, useLocalStorage]);

  const deleteTask = useCallback(async (taskId) => {
    try {
      if (useLocalStorage) {
        setTasks(prev => prev.filter(t => t.id !== taskId));
        toast.success('Task deleted (offline)');
      } else {
        await tasksAPI.delete(taskId);
        setTasks(prev => prev.filter(t => t.id !== taskId));
        toast.success('Task deleted');
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task');
    }
  }, [useLocalStorage]);

  const moveTask = useCallback((taskId, newStatus, newOrder) => {
    updateTask(taskId, { status: newStatus, order: newOrder });
  }, [updateTask]);

  const getTasksByStatus = useCallback((status) => {
    return tasks
      .filter(t => t.status === status)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [tasks]);

  return (
    <KanbanContext.Provider
      value={{
        tasks,
        isLoading,
        useLocalStorage,
        moveTask,
        createTask,
        updateTask,
        deleteTask,
        getTasksByStatus,
        refreshTasks: loadTasks,
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
}

export function useKanban() {
  const context = useContext(KanbanContext);
  if (!context) throw new Error('useKanban must be used within a KanbanProvider');
  return context;
}
