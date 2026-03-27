import express from 'express';
import ChatMessage from '../models/ChatMessage.js';
import Task from '../models/Task.js';

const router = express.Router();

// Save chat message
router.post('/', async (req, res) => {
  try {
    const { userId, message, response, type } = req.body;
    const chatMessage = new ChatMessage({
      userId: userId || 'default-user',
      message,
      response,
      type: type || 'chat'
    });
    await chatMessage.save();
    res.status(201).json(chatMessage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get chat history
router.get('/history', async (req, res) => {
  try {
    const userId = req.query.userId || 'default-user';
    const limit = parseInt(req.query.limit) || 50;
    
    const messages = await ChatMessage.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit);
    
    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate standup report
router.post('/standup', async (req, res) => {
  try {
    const userId = req.body.userId || 'default-user';
    const tasks = await Task.find({ userId });

    const doneTasks = tasks.filter(t => t.status === 'done');
    const doingTasks = tasks.filter(t => t.status === 'doing');
    const todoTasks = tasks.filter(t => t.status === 'todo');
    const highPriorityTodo = todoTasks.filter(t => t.priority === 'high');

    // Check for old doing tasks
    const now = Date.now();
    const oldDoingTasks = doingTasks.filter(t => {
      const updated = new Date(t.updatedAt).getTime();
      const hoursSince = (now - updated) / (1000 * 60 * 60);
      return hoursSince > 24;
    });

    const yesterday = doneTasks.length > 0
      ? `Completed ${doneTasks.length} task${doneTasks.length !== 1 ? 's' : ''}: ${doneTasks.slice(0, 3).map(t => `"${t.title}"`).join(', ')}${doneTasks.length > 3 ? '...' : ''}`
      : 'No tasks were completed recently.';

    const today = doingTasks.length > 0
      ? `Currently working on ${doingTasks.length} task${doingTasks.length !== 1 ? 's' : ''}: ${doingTasks.map(t => `"${t.title}"`).join(', ')}. ${highPriorityTodo.length > 0 ? `${highPriorityTodo.length} high-priority task${highPriorityTodo.length !== 1 ? 's' : ''} waiting in backlog.` : ''}`
      : `No tasks in progress. ${highPriorityTodo.length > 0 ? `Ready to start ${highPriorityTodo.length} high-priority task${highPriorityTodo.length !== 1 ? 's' : ''}.` : 'Ready to pick up new work.'}`;

    const blockers = oldDoingTasks.length > 0
      ? `${oldDoingTasks.length} task${oldDoingTasks.length !== 1 ? 's have' : ' has'} been in progress for over 24 hours: ${oldDoingTasks.map(t => `"${t.title}"`).join(', ')}. May need attention.`
      : 'No apparent blockers. All in-progress tasks are moving forward.';

    const completionRate = tasks.length > 0 ? Math.round((doneTasks.length / tasks.length) * 100) : 0;
    const team_sentiment = completionRate > 70
      ? 'Team velocity is strong! Great momentum on task completion.'
      : completionRate > 40
      ? 'Steady progress. Consider focusing on completing in-progress tasks before starting new ones.'
      : 'Lots of work in progress. Focus on finishing tasks to improve flow.';

    const report = {
      yesterday,
      today,
      blockers,
      team_sentiment
    };

    // Save to chat history
    const chatMessage = new ChatMessage({
      userId,
      message: 'Generate standup report',
      response: JSON.stringify(report),
      type: 'standup'
    });
    await chatMessage.save();

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
