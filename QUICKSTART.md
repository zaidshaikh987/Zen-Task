# ⚡ ZenTasks Quick Start

Get up and running in under 2 minutes!

## 📋 Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)

Check your versions:
```bash
node --version  # Should be v18 or higher
npm --version   # Should be v8 or higher
```

## 🚀 Installation

### Step 1: Install Dependencies
```bash
npm install
```

This will install all required packages (~2 minutes).

### Step 2: Start the App
```bash
npm run dev
```

You should see:
```
VITE v6.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 3: Open in Browser
Open `http://localhost:5173` in your browser.

**That's it!** 🎉 You should see the ZenTasks landing page.

## 🎯 First Steps

1. **Click "Get Started"** or **"Start Your Board"**
2. You'll see a Kanban board with 5 demo tasks
3. **Try dragging a task** from "To Do" to "Doing"
4. **Click the "+" button** to create a new task
5. **Explore Analytics** in the sidebar

## 📱 What You Can Do

### Create Tasks
- Click the "+" button in the top bar
- Fill in title, description, priority, and assignee
- Tasks are automatically saved to localStorage

### Manage Tasks
- **Drag & Drop**: Move tasks between columns
- **Edit**: Click on a task to edit it
- **Delete**: Drag to trash or use the delete button
- **Priority**: Mark tasks as high/low priority

### View Analytics
- Click "Analytics" in the sidebar
- See task distribution charts
- Track completion rates
- Monitor high-priority tasks

### Customize Settings
- Click "Settings" in the sidebar
- Update your profile
- Manage preferences

## 💾 Data Storage

All your tasks are stored in your browser's localStorage:
- ✅ No backend required
- ✅ No account needed
- ✅ Works offline
- ✅ Data persists across sessions

### Reset Data
To start fresh:
1. Open browser console (F12)
2. Type: `localStorage.clear()`
3. Refresh the page

## 🎨 Customization

### Change Theme Colors
Edit `src/index.css`:
```css
:root {
  --primary: 187 92% 43%;    /* Cyan - change this */
  --accent: 271 91% 65%;     /* Purple - change this */
  --destructive: 347 77% 60%; /* Red - change this */
}
```

### Modify Demo Tasks
Edit `src/lib/KanbanContext.jsx`:
```javascript
const initialTasks = [
  {
    id: '1',
    title: 'Your custom task',
    description: 'Task description',
    status: 'todo',
    priority: 'high',
    assignee: 'Your Name',
    // ...
  },
  // Add more tasks
];
```

## 🏗️ Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder. Deploy this folder to any static hosting service.

## 🚀 Deploy

### Vercel (Easiest)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

### GitHub Pages
1. Build: `npm run build`
2. Push `dist` folder to `gh-pages` branch
3. Enable GitHub Pages in repo settings

## 🐛 Common Issues

### Port Already in Use
```bash
# Kill the process on port 5173
npx kill-port 5173

# Or use a different port
npm run dev -- --port 3000
```

### Dependencies Not Installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Styles Not Loading
```bash
# Restart the dev server
# Press Ctrl+C to stop
npm run dev
```

### Tasks Not Saving
- Check if localStorage is enabled in your browser
- Try a different browser
- Clear browser cache

## 📚 Learn More

- [Full README](./README.md) - Complete documentation
- [Setup Guide](./SETUP.md) - Detailed setup instructions
- [Source Code](./src) - Explore the codebase

## 🎓 Key Concepts

### Components
- `src/components/kanban/Board.jsx` - Main Kanban board
- `src/components/dashboard/DashboardLayout.jsx` - Layout wrapper
- `src/components/ui/` - Reusable UI components

### State Management
- `src/lib/KanbanContext.jsx` - Global state with React Context
- Uses localStorage for persistence
- No external state library needed

### Styling
- Tailwind CSS for utility classes
- Custom CSS variables for theming
- Glassmorphism effects
- Framer Motion for animations

## 🎯 Next Steps

1. ✅ Complete quick start
2. 🎨 Customize the theme
3. 📝 Add your own tasks
4. 📊 Explore analytics
5. 🚀 Deploy to production
6. 🎉 Share with your team!

## 💡 Tips

- Use **Cmd/Ctrl + K** for command palette (coming soon)
- Press **N** to create a new task (coming soon)
- Press **F** for focus mode (coming soon)
- Drag tasks to the trash to delete them

## 🤝 Need Help?

- Check the [README](./README.md)
- Review the code comments
- Open an issue on GitHub

---

**Enjoy using ZenTasks!** 🎯

Made with ❤️ for productive teams
