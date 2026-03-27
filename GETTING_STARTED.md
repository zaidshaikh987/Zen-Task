# 🚀 Getting Started with ZenTasks

Welcome to ZenTasks! This guide will help you get up and running in minutes.

## 📦 What You've Got

A complete, production-ready Kanban board application with:
- ✅ Beautiful dark theme UI
- ✅ Drag & drop task management
- ✅ Analytics dashboard
- ✅ Mock AI features
- ✅ Local storage persistence
- ✅ Fully responsive design
- ✅ No backend required!

## ⚡ Quick Start (2 Minutes)

### Step 1: Install Dependencies
```bash
npm install
```
*This will take about 1-2 minutes*

### Step 2: Start the App
```bash
npm run dev
```
*The app will start on http://localhost:5173*

### Step 3: Open in Browser
Navigate to: **http://localhost:5173**

**That's it!** 🎉 You're now running ZenTasks!

## 🎯 First Steps

### 1. Explore the Landing Page
- Beautiful hero section
- Feature highlights
- Call-to-action buttons

### 2. Go to the Dashboard
- Click "Get Started" or "Start Your Board"
- You'll see 5 demo tasks already loaded

### 3. Try Drag & Drop
- Click and drag a task from "To Do" to "Doing"
- Watch the smooth animation
- See the confetti when you complete a high-priority task!

### 4. Create Your First Task
- Click the "+" button in the top bar
- Fill in the task details
- Try the "Magic Breakdown" feature (AI mock)
- Click "Create Task"

### 5. Check Analytics
- Click "Analytics" in the sidebar
- See your task distribution
- View completion rates
- Track high-priority tasks

### 6. Customize Settings
- Click "Settings" in the sidebar
- Update your profile
- Explore preferences

## 📚 Documentation Guide

We've created comprehensive documentation for you:

### For Getting Started
1. **QUICKSTART.md** - 2-minute setup guide
2. **GETTING_STARTED.md** - This file (you are here!)
3. **INSTALL.md** - Detailed installation for all platforms

### For Understanding the Project
4. **README.md** - Main documentation
5. **PROJECT_SUMMARY.md** - Complete project overview
6. **FEATURES.md** - All features explained

### For Development
7. **SETUP.md** - Development setup
8. **CHANGELOG.md** - Version history
9. **LICENSE** - MIT License

## 🎨 Customization

### Change Colors
Edit `src/index.css`:
```css
:root {
  --primary: 187 92% 43%;    /* Cyan */
  --accent: 271 91% 65%;     /* Purple */
  --destructive: 347 77% 60%; /* Red */
}
```

### Modify Demo Tasks
Edit `src/lib/KanbanContext.jsx`:
```javascript
const initialTasks = [
  // Your custom demo tasks here
];
```

### Customize AI Responses
Edit `src/lib/mockAI.js`:
```javascript
export const mockAI = {
  breakdownTask: async (taskTitle) => {
    // Your custom logic
  },
  // ... more functions
};
```

## 🔧 Available Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Check for errors
npm run lint:fix     # Fix errors automatically
```

## 📱 Features to Try

### Drag & Drop
1. Click and hold a task card
2. Drag it to another column
3. Release to drop
4. Watch the smooth animation!

### Priority System
1. Create a task
2. Set priority to "High"
3. Notice the red badge and pulse animation
4. Complete it to see confetti! 🎉

### Mock AI Features
1. **Task Breakdown**: Click "Magic Breakdown" when creating a task
2. **AI Chat**: (Coming soon in Phase 1)
3. **AI Standup**: (Coming soon in Phase 1)
4. **AI Sort**: (Coming soon in Phase 1)

### Analytics
1. Go to Analytics page
2. See task distribution chart
3. View completion rate
4. Track metrics in real-time

## 💾 Data Storage

### How It Works
- All tasks are stored in your browser's localStorage
- Data persists across page refreshes
- No backend or database needed
- Works completely offline

### View Your Data
```javascript
// Open browser console (F12)
localStorage.getItem('zentasks_tasks')
```

### Clear Your Data
```javascript
// Open browser console (F12)
localStorage.clear()
location.reload()
```

### Export Your Data
```javascript
// Open browser console (F12)
const data = localStorage.getItem('zentasks_tasks');
console.log(data); // Copy this to save
```

### Import Your Data
```javascript
// Open browser console (F12)
localStorage.setItem('zentasks_tasks', 'your_data_here');
location.reload();
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```
Output will be in `dist/` folder.

### Deploy Options

#### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

#### GitHub Pages
```bash
npm run build
# Upload dist/ folder to gh-pages branch
```

#### Any Static Host
Just upload the `dist/` folder to:
- AWS S3
- Google Cloud Storage
- Azure Static Web Apps
- Cloudflare Pages
- Or any web server

## 🎓 Learning Path

### Beginner
1. ✅ Complete quick start
2. ✅ Create and manage tasks
3. ✅ Explore all pages
4. ✅ Try all features

### Intermediate
1. 📖 Read the full README
2. 🎨 Customize colors and theme
3. 📝 Modify demo tasks
4. 🚀 Deploy to production

### Advanced
1. 💻 Study the source code
2. 🔧 Add new features
3. 🎨 Create custom components
4. 🤝 Contribute back

## 🎯 Use Cases

### Personal
- Daily task management
- Goal tracking
- Habit building
- Learning roadmap

### Team
- Sprint planning
- Bug tracking
- Feature development
- Content calendar

### Business
- Product roadmap
- Sales pipeline
- Customer support
- Marketing campaigns

## 💡 Tips & Tricks

### Productivity Tips
1. **Start with high-priority tasks** - They have visual emphasis
2. **Limit WIP** - Don't have too many tasks in "Doing"
3. **Complete tasks daily** - Move them to "Done" for satisfaction
4. **Use descriptions** - Add details and sub-tasks
5. **Assign tasks** - Know who's responsible

### UI Tips
1. **Drag from anywhere** - Click anywhere on the card to drag
2. **Hover for actions** - Hover to see edit and drag handles
3. **Collapse sidebar** - Click the arrow for more space
4. **Check analytics** - Track your progress regularly
5. **Celebrate wins** - Complete high-priority tasks for confetti!

### Development Tips
1. **Hot reload** - Changes appear instantly
2. **Console logs** - Check browser console for debugging
3. **React DevTools** - Install for better debugging
4. **ESLint** - Fix errors as you code
5. **Git commits** - Commit often with clear messages

## 🐛 Troubleshooting

### App Won't Start
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Port Already in Use
```bash
# Use different port
npm run dev -- --port 3000
```

### Tasks Not Saving
- Check if localStorage is enabled
- Try a different browser
- Clear browser cache

### Styles Not Loading
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Restart dev server

## 📞 Get Help

### Documentation
- Check the README.md
- Review FEATURES.md
- Read INSTALL.md

### Community
- Open an issue on GitHub
- Check existing issues
- Join discussions

### Self-Help
- Read error messages carefully
- Check browser console (F12)
- Search the error online
- Review the code comments

## 🎉 What's Next?

### Immediate
1. ✅ Complete this guide
2. ✅ Create your first task
3. ✅ Explore all features
4. ✅ Customize the theme

### Short Term
1. 📝 Add your real tasks
2. 🎨 Customize to your needs
3. 📊 Track your progress
4. 🚀 Deploy to production

### Long Term
1. 💻 Learn from the code
2. 🔧 Add new features
3. 🤝 Contribute back
4. 🌟 Share with others

## 🌟 Success Checklist

- [ ] Installed dependencies
- [ ] Started dev server
- [ ] Opened in browser
- [ ] Explored landing page
- [ ] Viewed dashboard
- [ ] Dragged a task
- [ ] Created a task
- [ ] Checked analytics
- [ ] Visited settings
- [ ] Customized colors
- [ ] Built for production
- [ ] Deployed online

## 🎊 Congratulations!

You're now ready to use ZenTasks! 🎯

**Remember:**
- All data is stored locally
- No backend required
- Works offline
- Free forever
- Open source

**Enjoy your productivity journey!** 🚀

---

Need more help? Check out:
- [README.md](./README.md) - Full documentation
- [FEATURES.md](./FEATURES.md) - Complete feature list
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Project overview

Made with ❤️ for productive teams everywhere
