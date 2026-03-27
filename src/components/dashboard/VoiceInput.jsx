import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { useKanban } from '@/lib/KanbanContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function VoiceInput() {
  const { createTask } = useKanban();
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = () => {
        toast.error('Voice recognition error. Please try again.');
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const handleVoiceCommand = (transcript) => {
    // Parse voice commands like "add high priority task fix login bug"
    const addTaskMatch = transcript.match(/add\s+(high|low)?\s*priority\s+task\s+(.+)/i);
    
    if (addTaskMatch) {
      const priority = addTaskMatch[1] ? addTaskMatch[1].toLowerCase() : 'low';
      const title = addTaskMatch[2].trim();
      
      createTask({
        title: title.charAt(0).toUpperCase() + title.slice(1),
        description: '',
        status: 'todo',
        priority: priority,
        assignee: null,
      });
      
      toast.success(`Task created: ${title}`);
    } else {
      toast.info(`Heard: "${transcript}". Try saying "Add high priority task [task name]"`);
    }
  };

  const toggleListening = () => {
    if (!recognition) {
      toast.error('Voice recognition not supported in this browser');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      toast.info('Listening... Say "Add high priority task [task name]"');
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleListening}
      className={cn(
        'relative',
        isListening && 'text-primary'
      )}
    >
      {isListening ? (
        <>
          <MicOff className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
          </span>
        </>
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
}
