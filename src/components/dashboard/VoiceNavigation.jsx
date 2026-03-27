import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function VoiceNavigation() {
  const navigate = useNavigate();
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
        handleVoiceNavigation(transcript);
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

  const handleVoiceNavigation = (transcript) => {
    if (transcript.includes('dashboard') || transcript.includes('board')) {
      navigate('/dashboard');
      toast.success('Navigating to Dashboard');
    } else if (transcript.includes('analytics') || transcript.includes('stats')) {
      navigate('/dashboard/analytics');
      toast.success('Navigating to Analytics');
    } else if (transcript.includes('settings')) {
      navigate('/dashboard/settings');
      toast.success('Navigating to Settings');
    } else if (transcript.includes('home') || transcript.includes('landing')) {
      navigate('/');
      toast.success('Navigating to Home');
    } else {
      toast.info(`Heard: "${transcript}". Try saying "Go to Dashboard" or "Go to Analytics"`);
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
      toast.info('Listening... Say "Go to Dashboard" or "Go to Analytics"');
    }
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="fixed bottom-8 right-8 z-40"
    >
      <Button
        onClick={toggleListening}
        size="lg"
        className={cn(
          'h-14 w-14 rounded-full shadow-lg',
          isListening ? 'gradient-bg animate-pulse' : 'gradient-bg'
        )}
      >
        {isListening ? (
          <>
            <MicOff className="h-6 w-6 text-white" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-4 w-4 rounded-full bg-white" />
            </span>
          </>
        ) : (
          <Mic className="h-6 w-6 text-white" />
        )}
      </Button>
    </motion.div>
  );
}
