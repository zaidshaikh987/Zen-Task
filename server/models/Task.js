import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['todo', 'doing', 'done'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'high'],
    default: 'low'
  },
  assignee: {
    type: String,
    default: null
  },
  order: {
    type: Number,
    default: 0
  },
  userId: {
    type: String,
    default: 'default-user' // For demo purposes
  }
}, {
  timestamps: true
});

// Index for faster queries
taskSchema.index({ userId: 1, status: 1, order: 1 });

const Task = mongoose.model('Task', taskSchema);

export default Task;
