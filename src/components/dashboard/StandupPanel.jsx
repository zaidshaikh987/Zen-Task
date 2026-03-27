import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useKanban } from '@/lib/KanbanContext';
import { mockAI } from '@/lib/mockAI';
import { X, Loader2, Users } from 'lucide-react';

export default function StandupPanel({ isOpen, onClose }) {
  const { tasks } = useKanban();
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  const generateStandup = async () => {
    setLoading(true);
    const result = await mockAI.generateStandup(tasks);
    setReport(result);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl"
        >
          <Card className="glass-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle className="font-grotesk">AI Standup Report</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {!report && !loading && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Generate an AI-powered standup report based on your current board state
                  </p>
                  <Button onClick={generateStandup} className="gradient-bg">
                    Generate Report
                  </Button>
                </div>
              )}

              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}

              {report && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground">Yesterday</h4>
                    <p className="text-sm">{report.yesterday}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground">Today</h4>
                    <p className="text-sm">{report.today}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground">Blockers</h4>
                    <p className="text-sm">{report.blockers}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground">Team Sentiment</h4>
                    <p className="text-sm">{report.team_sentiment}</p>
                  </div>
                  <Button onClick={generateStandup} variant="outline" className="w-full">
                    Regenerate
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
