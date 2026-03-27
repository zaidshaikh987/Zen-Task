// Mock AI responses for demo purposes
export const mockAI = {
  // AI Task Breakdown
  breakdownTask: async (taskTitle) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const breakdowns = {
      default: [
        'Research and gather requirements',
        'Create initial design or plan',
        'Implement core functionality',
        'Test and refine the solution'
      ],
      design: [
        'Create wireframes and mockups',
        'Design color scheme and typography',
        'Build component library',
        'Get stakeholder feedback'
      ],
      development: [
        'Set up project structure',
        'Implement core features',
        'Write unit tests',
        'Code review and refactoring'
      ],
      testing: [
        'Write test cases',
        'Perform manual testing',
        'Set up automated tests',
        'Document test results'
      ]
    };

    const lowerTitle = taskTitle.toLowerCase();
    let subtasks;

    if (lowerTitle.includes('design') || lowerTitle.includes('ui') || lowerTitle.includes('mockup')) {
      subtasks = breakdowns.design;
    } else if (lowerTitle.includes('test') || lowerTitle.includes('qa')) {
      subtasks = breakdowns.testing;
    } else if (lowerTitle.includes('develop') || lowerTitle.includes('build') || lowerTitle.includes('implement')) {
      subtasks = breakdowns.development;
    } else {
      subtasks = breakdowns.default;
    }

    return { subtasks };
  },

  // AI Agile Coach
  chat: async (message, tasks) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('what') && lowerMessage.includes('next')) {
      const highPriorityTodo = tasks.find(t => t.status === 'todo' && t.priority === 'high');
      if (highPriorityTodo) {
        return `I'd recommend starting with "${highPriorityTodo.title}" - it's high priority and in your To Do column. Focus on one task at a time for maximum productivity!`;
      }
      return "Start with your highest priority tasks in the To Do column. Break them down into smaller chunks if needed!";
    }

    if (lowerMessage.includes('priorit')) {
      const todoCount = tasks.filter(t => t.status === 'todo').length;
      const highPriorityCount = tasks.filter(t => t.priority === 'high').length;
      return `You have ${todoCount} tasks in To Do, with ${highPriorityCount} marked as high priority. Focus on high-priority items first, and consider breaking down large tasks into smaller, manageable pieces.`;
    }

    if (lowerMessage.includes('doing') || lowerMessage.includes('progress')) {
      const doingCount = tasks.filter(t => t.status === 'doing').length;
      if (doingCount > 3) {
        return `You have ${doingCount} tasks in progress. That's quite a lot! Try to limit WIP (Work In Progress) to 2-3 tasks to maintain focus and finish things faster.`;
      }
      return `You have ${doingCount} tasks in progress. Good job keeping your WIP manageable! Remember to move completed tasks to Done.`;
    }

    if (lowerMessage.includes('done') || lowerMessage.includes('complete')) {
      const doneCount = tasks.filter(t => t.status === 'done').length;
      const totalCount = tasks.length;
      const percentage = Math.round((doneCount / totalCount) * 100);
      return `Great progress! You've completed ${doneCount} out of ${totalCount} tasks (${percentage}%). Keep up the momentum! 🎉`;
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
      return "I'm here to help you stay productive! Ask me about:\n• What to work on next\n• How to prioritize tasks\n• Your current progress\n• Tips for better workflow";
    }

    // Default response
    return "I'm your Agile Coach! I can help you prioritize tasks, suggest what to work on next, and keep your board organized. What would you like to know?";
  },

  // AI Standup Report
  generateStandup: async (tasks) => {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const doneTasks = tasks.filter(t => t.status === 'done');
    const doingTasks = tasks.filter(t => t.status === 'doing');
    const todoTasks = tasks.filter(t => t.status === 'todo');
    const highPriorityTodo = todoTasks.filter(t => t.priority === 'high');

    // Check for old doing tasks (potential blockers)
    const now = Date.now();
    const oldDoingTasks = doingTasks.filter(t => {
      const updated = new Date(t.updated_date).getTime();
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

    return {
      yesterday,
      today,
      blockers,
      team_sentiment
    };
  },

  // AI Sort Tasks
  sortTasks: async (tasks) => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Sort by: high priority first, then by creation date (oldest first)
    const sorted = [...tasks].sort((a, b) => {
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (a.priority !== 'high' && b.priority === 'high') return 1;
      return new Date(a.created_date) - new Date(b.created_date);
    });

    const ordered_ids = sorted.map(t => t.id);
    const reason = 'Sorted by priority (high first) and age (oldest first) to focus on urgent and overdue tasks.';

    return { ordered_ids, reason };
  }
};
