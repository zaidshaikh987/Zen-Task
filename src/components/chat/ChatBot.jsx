import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X, Send, Loader2, Sparkles } from 'lucide-react';
import { chatAPI } from '@/lib/api';
import { mockAI } from '@/lib/mockAI';
import { useKanban } from '@/lib/KanbanContext';
import { toast } from 'sonner';

export default function ChatBot({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { tasks, useLocalStorage } = useKanban();

  useEffect(() => {
    if (!useLocalStorage) {
      loadHistory();
    }
  }, [useLocalStorage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadHistory = async () => {
    try {
      const response = await chatAPI.getHistory();
      const history = response.data.map(msg => [
        { text: msg.message, isUser: true },
        { text: msg.response, isUser: false }
      ]).flat();
      setMessages(history);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setLoading(true);

    try {
      const aiResponse = await mockAI.chat(userMessage, tasks);
      
      setMessages(prev => [...prev, { text: aiResponse, isUser: false }]);

      if (!useLocalStorage) {
        await chatAPI.sendMessage({
          message: userMessage,
          response: aiResponse,
          type: 'chat'
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to get response');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed bottom-24 right-6 z-50 w-96"
      >
        <Card className="bg-[#1a1f2e]/95 backdrop-blur-xl border-white/10 shadow-2xl shadow-purple-500/20">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">AI Agile Coach</h3>
                <p className="text-[10px] text-gray-400">Ask me about your tasks</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="h-96 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-sm text-gray-400 py-8">
                <p className="text-base">👋 Hi! I'm your AI Agile Coach.</p>
                <p className="mt-3 text-xs">Ask me about:</p>
                <ul className="mt-2 space-y-1.5 text-xs text-gray-500">
                  <li>• What to work on next</li>
                  <li>• How to prioritize tasks</li>
                  <li>• Your current progress</li>
                  <li>• Productivity tips</li>
                </ul>
              </div>
            )}

            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    msg.isUser
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
                      : 'bg-white/5 text-gray-200 border border-white/10'
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-cyan-500/50"
                disabled={loading}
              />
              <Button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                size="sm"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
