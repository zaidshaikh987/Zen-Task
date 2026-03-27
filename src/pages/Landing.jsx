import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Layers, Play, Zap, GripVertical, Target, Sparkles } from 'lucide-react';
import VoiceNavigation from '@/components/dashboard/VoiceNavigation';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background dark">
      <VoiceNavigation />
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg"
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg">
              <Layers className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-grotesk text-xl font-bold">ZenTasks</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/dashboard">
              <Button size="sm" className="gradient-bg text-primary-foreground hover:opacity-90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/50 px-4 py-2 text-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="text-muted-foreground">Now in public beta</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="font-grotesk text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            >
              <span className="gradient-text">Minimalist Project Management.</span>
              <br />
              <span className="text-foreground">Maximum Flow.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
            >
              Track daily goals for your small team without the clutter. A streamlined Kanban board that helps you focus on what matters.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-4"
            >
              <Link to="/dashboard">
                <Button size="lg" className="group gradient-bg text-primary-foreground hover:opacity-90">
                  Start Your Board
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="group">
                <Play className="mr-2 h-4 w-4" />
                See Demo
              </Button>
            </motion.div>

            {/* Mock Kanban Preview */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-20 w-full max-w-4xl"
            >
              <div className="glass-card rounded-xl p-6 shadow-2xl">
                <div className="grid grid-cols-3 gap-4">
                  {['To Do', 'Doing', 'Done'].map((col, i) => (
                    <div key={col} className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground">{col}</div>
                      <div className="space-y-2">
                        {Array.from({ length: 3 - i }).map((_, j) => (
                          <motion.div
                            key={j}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 + j * 0.1 }}
                            className="glass-card rounded-md p-3 text-xs"
                          >
                            Task {i * 3 + j + 1}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="font-grotesk text-3xl font-bold sm:text-4xl">
              Built for <span className="gradient-text">Focus</span>
            </h2>
            <p className="mt-4 text-muted-foreground">Everything you need, nothing you don't.</p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: GripVertical,
                title: 'Drag & Drop Simplicity',
                description: 'Effortlessly move tasks across columns. Our intuitive interface feels natural and responsive.'
              },
              {
                icon: Target,
                title: 'High/Low Priority Tracking',
                description: 'Focus on what matters most. Visual priority badges help you identify urgent tasks at a glance.'
              },
              {
                icon: Sparkles,
                title: 'AI Goal Breakdown',
                description: 'Let AI break down large goals into manageable tasks. Work smarter, not harder.'
              }
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group glass-card glass-card-hover rounded-xl p-6"
              >
                <div className="mb-4 inline-flex rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 p-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-grotesk text-xl font-semibold">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl"
          >
            <div className="absolute inset-0 gradient-bg opacity-90" />
            <div className="relative z-10 px-8 py-16 text-center sm:px-16 sm:py-20">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="mx-auto mb-6 inline-flex rounded-full bg-white/20 p-3"
              >
                <Zap className="h-8 w-8 text-white" />
              </motion.div>
              <h2 className="font-grotesk text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                Ready to hit your daily goals?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
                Join thousands of teams shipping faster with ZenTasks. Start free, no credit card required.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link to="/dashboard">
                  <Button size="lg" className="group bg-white text-primary hover:bg-white/90">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg">
                <Layers className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-grotesk text-xl font-bold">ZenTasks</span>
            </Link>
            <p className="text-sm text-muted-foreground">© 2024 ZenTasks. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
