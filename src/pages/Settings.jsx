import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Palette, User } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const [fullName, setFullName] = useState('Demo User');

  const handleSaveProfile = () => {
    toast.success('Profile updated!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-2xl"
    >
      <div>
        <h1 className="font-grotesk text-2xl font-bold gradient-text">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your preferences</p>
      </div>

      {/* Profile */}
      <Card className="glass-card border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted/50">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="font-grotesk text-lg">Profile</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="bg-muted/50 border-border"
              placeholder="Your full name"
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              value="demo@zentasks.app"
              disabled
              className="bg-muted/30 border-border text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
          </div>
          <Button
            onClick={handleSaveProfile}
            className="gradient-bg text-primary-foreground hover:opacity-90"
          >
            Save Profile
          </Button>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="glass-card border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted/50">
              <Palette className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle className="font-grotesk text-lg">Appearance</CardTitle>
              <CardDescription>Customize the look and feel</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Dark Mode</p>
              <p className="text-xs text-muted-foreground">ZenTasks is optimized for dark mode</p>
            </div>
            <div className="text-xs text-muted-foreground">Always On</div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="glass-card border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted/50">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="font-grotesk text-lg">Notifications</CardTitle>
              <CardDescription>Manage notification preferences</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Browser Notifications</p>
              <p className="text-xs text-muted-foreground">Get notified about task updates</p>
            </div>
            <div className="text-xs text-muted-foreground">Enabled</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
