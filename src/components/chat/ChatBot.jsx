import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { chatAPI } from '@/lib/api';
import { mockAI } from '@/lib/mockAI';
import { useKanban } from '@/lib/KanbanContext';
import { toast } from 'sonner';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { tasks, useLocalStorage } = useKanban();

  useEffect(() => {
    if (isOpen && !useLocalStorage) {
      loadHistory();
    }
  }, [isOpen, useLocalStorage]);

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
      // Get AI response
      const aiResponse = await mockAI.chat(userMessage, tasks);
      
      setMessages(prev => [...prev, { text: aiResponse, isUser: false }]);

      // Save to database if online
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
    <>
      {/* Chat Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-8 left-8 z-40"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg gradient-bg"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <MessageCircle className="h-6 w-6 text-white" />
          )}
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-8 z-40 w-96"
          >
            <Card className="glass-card border-border shadow-2xl">
              <div className="p-4 border-b border-border">
                <h3 className="font-grotesk font-semibold">AI Agile Coach</h3>
                <p className="text-xs text-muted-foreground">Ask me about your tasks</p>
              </div>

              <div className="h-96 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground py-8">
                    <p>👋 Hi! I'm your AI Agile Coach.</p>
                    <p className="mt-2">Ask me about:</p>
                    <ul className="mt-2 space-y-1 text-xs">
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
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-3 py-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    className="glass-card"
                    disabled={loading}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    size="sm"
                    className="gradient-bg"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
