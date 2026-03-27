import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Layers, LayoutDashboard, BarChart3, Settings, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Board', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Analytics', icon: BarChart3, path: '/dashboard/analytics' },
  { label: 'Admin', icon: Shield, path: '/dashboard/admin' },
  { label: 'Settings', icon: Settings, path: '/dashboard/settings' },
];

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-[#0a0e1a] overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 64 : 200 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col border-r border-white/5 bg-[#0d1117] h-full shrink-0"
      >
        {/* Logo */}
        <div className="flex h-14 items-center px-4 border-b border-white/5">
          <Link to="/dashboard" className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
              <Layers className="h-4 w-4 text-white" />
            </div>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-semibold text-sm whitespace-nowrap overflow-hidden"
              >
                ZenTasks
              </motion.span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 p-2 mt-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 h-9 transition-all text-sm font-normal",
                    sidebarCollapsed && "justify-center px-0",
                    isActive
                      ? "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/15"
                      : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="whitespace-nowrap overflow-hidden">
                      {item.label}
                    </span>
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="border-t border-white/5 p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(prev => !prev)}
            className="w-full justify-center text-gray-400 hover:text-gray-200 h-8"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Page Content */}
        <main className="flex-1 overflow-hidden p-6 bg-[#0a0e1a]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
