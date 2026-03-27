import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: 'default-user'
  },
  message: {
    type: String,
    required: true
  },
  response: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['chat', 'standup', 'breakdown'],
    default: 'chat'
  }
}, {
  timestamps: true
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;
