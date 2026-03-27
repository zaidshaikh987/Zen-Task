# 🚀 ZenTasks Setup Guide

## Quick Setup (3 steps)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to: `http://localhost:5173`

That's it! 🎉

## What You Get

- ✅ Fully functional Kanban board
- ✅ Drag & drop task management
- ✅ Priority system with visual indicators
- ✅ Mock AI features (task breakdown, chat, standup)
- ✅ Analytics dashboard with charts
- ✅ Settings page
- ✅ Beautiful dark theme with glassmorphism
- ✅ Smooth animations
- ✅ Local storage persistence
- ✅ Responsive design

## Demo Data

The app comes with 5 demo tasks pre-loaded:
- 2 in "To Do"
- 2 in "Doing"  
- 1 in "Done"

You can delete these and add your own tasks immediately.

## Key Features to Try

1. **Drag Tasks**: Click and drag tasks between columns
2. **Create Task**: Click the "+" button in the top bar
3. **High Priority**: Mark tasks as high priority to see pulse animation
4. **Analytics**: Click "Analytics" in sidebar to see charts
5. **Settings**: Customize your profile in Settings

## Data Storage

All tasks are stored in your browser's localStorage:
- Data persists across page refreshes
- No backend required
- No account needed
- Works offline

To reset data:
```javascript
// In browser console
localStorage.clear()
location.reload()
```

## Customization

### Change Colors
Edit `src/index.css`:
```css
:root {
  --primary: 187 92% 43%;  /* Change this */
  --accent: 271 91% 65%;   /* And this */
}
```

### Change Demo Tasks
Edit `src/lib/KanbanContext.jsx`:
```javascript
const initialTasks = [
  // Add your own demo tasks here
];
```

### Disable Mock AI
The mock AI responses are in `src/lib/mockAI.js`. You can:
- Modify the responses
- Connect to a real AI API
- Remove AI features entirely

## Build for Production

```bash
npm run build
```

Output will be in `dist/` folder.

## Deploy

### Vercel (Recommended)
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
1. Update `vite.config.js`:
```javascript
export default defineConfig({
  base: '/your-repo-name/',
  // ... rest of config
})
```
2. Build: `npm run build`
3. Deploy `dist` folder to gh-pages branch

## Troubleshooting

### Port 5173 already in use
```bash
# Kill the process
npx kill-port 5173

# Or use a different port
npm run dev -- --port 3000
```

### Module not found errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Styles not loading
```bash
# Rebuild Tailwind
npm run build
```

## Next Steps

1. ✅ Complete setup
2. 🎨 Customize colors and branding
3. 📝 Add your own tasks
4. 🚀 Deploy to production
5. 🎉 Share with your team!

## Need Help?

- Check the main [README.md](./README.md)
- Open an issue on GitHub
- Review the code comments

---

Happy task managing! 🎯
