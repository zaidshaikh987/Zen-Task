import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useKanban } from '@/lib/KanbanContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CheckCircle2, Circle, Loader2, TrendingUp } from 'lucide-react';
import VelocityHeatmap from '@/components/dashboard/VelocityHeatmap';

const COLORS = ['hsl(var(--muted-foreground))', 'hsl(var(--primary))', 'hsl(142 71% 45%)'];

export default function Analytics() {
  const { tasks } = useKanban();

  const todoCount = tasks.filter(t => t.status === 'todo').length;
  const doingCount = tasks.filter(t => t.status === 'doing').length;
  const doneCount = tasks.filter(t => t.status === 'done').length;
  const highPriorityCount = tasks.filter(t => t.priority === 'high').length;

  const statusData = [
    { name: 'To Do', value: todoCount },
    { name: 'Doing', value: doingCount },
    { name: 'Done', value: doneCount },
  ];

  const completionRate = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

  const stats = [
    { label: 'Total Tasks', value: tasks.length, icon: Circle, color: 'text-muted-foreground' },
    { label: 'In Progress', value: doingCount, icon: Loader2, color: 'text-primary' },
    { label: 'Completed', value: doneCount, icon: CheckCircle2, color: 'text-emerald-500' },
    { label: 'High Priority', value: highPriorityCount, icon: TrendingUp, color: 'text-destructive' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h1 className="font-grotesk text-2xl font-bold gradient-text">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Track your team's progress</p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="glass-card border-border">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold font-grotesk mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg bg-muted/50 ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="font-grotesk text-lg">Task Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData}>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="font-grotesk text-lg">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      innerRadius={70}
                      outerRadius={95}
                      paddingAngle={5}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <p className="text-3xl font-bold font-grotesk">{completionRate}%</p>
                    <p className="text-xs text-muted-foreground">Complete</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Velocity Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="glass-card border-border">
          <CardHeader>
            <CardTitle className="font-grotesk text-lg">Team Velocity Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <VelocityHeatmap />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
