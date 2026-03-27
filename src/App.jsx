import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { KanbanProvider } from '@/lib/KanbanContext';
import Landing from '@/pages/Landing';
import Dashboard from '@/pages/Dashboard';
import Analytics from '@/pages/Analytics';
import Settings from '@/pages/Settings';
import Admin from '@/pages/Admin';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ChatBot from '@/components/chat/ChatBot';

function App() {
  return (
    <KanbanProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/analytics" element={<Analytics />} />
            <Route path="/dashboard/settings" element={<Settings />} />
            <Route path="/dashboard/admin" element={<Admin />} />
          </Route>
        </Routes>
        <ChatBot />
      </Router>
      <Toaster
        position="bottom-right"
        toastOptions={{ className: 'glass-card border border-border' }}
      />
    </KanbanProvider>
  )
}

export default App
