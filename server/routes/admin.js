import express from 'express';
import Task from '../models/Task.js';
import User from '../models/User.js';

const router = express.Router();

// Get all users (admin only)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all tasks (admin only)
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get system stats
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalTasks, completedTasks, highPriorityTasks] = await Promise.all([
      User.countDocuments(),
      Task.countDocuments(),
      Task.countDocuments({ status: 'done' }),
      Task.countDocuments({ priority: 'high' })
    ]);

    res.json({
      totalUsers,
      totalTasks,
      completedTasks,
      highPriorityTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user (admin only)
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Also delete user's tasks
    await Task.deleteMany({ userId: req.params.id });
    res.json({ message: 'User and associated tasks deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
