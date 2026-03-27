import express from 'express';
import Task from '../models/Task.js';

const router = express.Router();

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId || 'default-user';
    const tasks = await Task.find({ userId }).sort({ order: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get tasks by status
router.get('/status/:status', async (req, res) => {
  try {
    const userId = req.query.userId || 'default-user';
    const tasks = await Task.find({ 
      userId, 
      status: req.params.status 
    }).sort({ order: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create task
router.post('/', async (req, res) => {
  try {
    const userId = req.body.userId || 'default-user';
    const task = new Task({
      ...req.body,
      userId
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully', task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk update (for reordering)
router.post('/bulk-update', async (req, res) => {
  try {
    const { updates } = req.body; // Array of { id, order, status }
    const promises = updates.map(update => 
      Task.findByIdAndUpdate(update.id, { 
        order: update.order,
        status: update.status 
      })
    );
    await Promise.all(promises);
    res.json({ message: 'Tasks updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get analytics
router.get('/analytics/stats', async (req, res) => {
  try {
    const userId = req.query.userId || 'default-user';
    
    const [total, todo, doing, done, highPriority] = await Promise.all([
      Task.countDocuments({ userId }),
      Task.countDocuments({ userId, status: 'todo' }),
      Task.countDocuments({ userId, status: 'doing' }),
      Task.countDocuments({ userId, status: 'done' }),
      Task.countDocuments({ userId, priority: 'high' })
    ]);

    res.json({
      total,
      todo,
      doing,
      done,
      highPriority,
      completionRate: total > 0 ? Math.round((done / total) * 100) : 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
