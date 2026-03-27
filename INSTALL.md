# 💻 ZenTasks Installation Guide

Complete installation instructions for all platforms.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)
- [Platform-Specific](#platform-specific)

## 🔧 Prerequisites

### Required Software

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Includes npm automatically

2. **Git** (optional, for cloning)
   - Download from: https://git-scm.com/

### Check Your Installation

```bash
# Check Node.js version
node --version
# Should output: v18.x.x or higher

# Check npm version
npm --version
# Should output: v8.x.x or higher

# Check Git version (optional)
git --version
# Should output: git version 2.x.x
```

## 🚀 Installation

### Method 1: Download ZIP (Easiest)

1. **Download the project**
   - Download as ZIP file
   - Extract to your desired location

2. **Open terminal in project folder**
   ```bash
   cd path/to/zentasks-kanban
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the app**
   ```bash
   npm run dev
   ```

5. **Open browser**
   - Navigate to: `http://localhost:5173`

### Method 2: Git Clone (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zentasks-kanban
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the app**
   ```bash
   npm run dev
   ```

4. **Open browser**
   - Navigate to: `http://localhost:5173`

## ✅ Verification

### Check Installation Success

After running `npm run dev`, you should see:

```
VITE v6.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

### Test the Application

1. Open `http://localhost:5173` in your browser
2. You should see the ZenTasks landing page
3. Click "Get Started" or "Start Your Board"
4. You should see a Kanban board with demo tasks
5. Try dragging a task between columns

If all steps work, installation is successful! ✅

## 🐛 Troubleshooting

### Common Issues

#### Issue: "node: command not found"

**Solution**: Install Node.js
```bash
# Download from https://nodejs.org/
# Or use a package manager:

# macOS (Homebrew)
brew install node

# Windows (Chocolatey)
choco install nodejs

# Linux (Ubuntu/Debian)
sudo apt update
sudo apt install nodejs npm
```

#### Issue: "npm: command not found"

**Solution**: npm comes with Node.js, reinstall Node.js

#### Issue: "Port 5173 is already in use"

**Solution 1**: Kill the process
```bash
# Find and kill the process
npx kill-port 5173
```

**Solution 2**: Use a different port
```bash
npm run dev -- --port 3000
```

#### Issue: "Cannot find module"

**Solution**: Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Issue: "Permission denied"

**Solution**: Fix npm permissions
```bash
# macOS/Linux
sudo chown -R $USER ~/.npm
sudo chown -R $USER /usr/local/lib/node_modules

# Or use nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

#### Issue: "EACCES: permission denied"

**Solution**: Don't use sudo with npm
```bash
# Instead of: sudo npm install
# Use: npm install

# If still having issues, use nvm
```

#### Issue: "Styles not loading"

**Solution**: Clear cache and rebuild
```bash
# Stop the dev server (Ctrl+C)
rm -rf node_modules/.vite
npm run dev
```

#### Issue: "Tasks not saving"

**Solution**: Check localStorage
```bash
# Open browser console (F12)
# Type: localStorage.getItem('zentasks_tasks')
# Should show your tasks

# If null, check if localStorage is enabled
# Try a different browser
```

## 💻 Platform-Specific Instructions

### Windows

#### Using Command Prompt
```cmd
cd C:\path\to\zentasks-kanban
npm install
npm run dev
```

#### Using PowerShell
```powershell
cd C:\path\to\zentasks-kanban
npm install
npm run dev
```

#### Using Git Bash
```bash
cd /c/path/to/zentasks-kanban
npm install
npm run dev
```

#### Common Windows Issues

**Issue**: Scripts disabled in PowerShell

**Solution**: Enable scripts
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Issue**: Path with spaces

**Solution**: Use quotes
```cmd
cd "C:\Users\Your Name\Documents\zentasks-kanban"
```

### macOS

#### Using Terminal
```bash
cd ~/path/to/zentasks-kanban
npm install
npm run dev
```

#### Using Homebrew (Recommended)
```bash
# Install Node.js
brew install node

# Verify installation
node --version
npm --version

# Install project
cd ~/path/to/zentasks-kanban
npm install
npm run dev
```

#### Common macOS Issues

**Issue**: Permission errors

**Solution**: Use nvm
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal, then:
nvm install 18
nvm use 18
```

### Linux

#### Ubuntu/Debian
```bash
# Install Node.js
sudo apt update
sudo apt install nodejs npm

# Verify installation
node --version
npm --version

# Install project
cd ~/path/to/zentasks-kanban
npm install
npm run dev
```

#### Fedora/RHEL
```bash
# Install Node.js
sudo dnf install nodejs npm

# Verify installation
node --version
npm --version

# Install project
cd ~/path/to/zentasks-kanban
npm install
npm run dev
```

#### Arch Linux
```bash
# Install Node.js
sudo pacman -S nodejs npm

# Verify installation
node --version
npm --version

# Install project
cd ~/path/to/zentasks-kanban
npm install
npm run dev
```

#### Common Linux Issues

**Issue**: Old Node.js version

**Solution**: Use NodeSource
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version
```

## 🔄 Updating

### Update Dependencies
```bash
# Check for updates
npm outdated

# Update all dependencies
npm update

# Update specific package
npm update package-name
```

### Update Node.js
```bash
# Using nvm (recommended)
nvm install 18
nvm use 18

# Or download latest from nodejs.org
```

## 🏗️ Building for Production

### Create Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Output Location
```
dist/
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── index.html
```

## 🚀 Deployment

### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Deploy to GitHub Pages
```bash
# Build
npm run build

# Deploy dist folder to gh-pages branch
# Or use gh-pages package:
npm install -g gh-pages
gh-pages -d dist
```

## 📊 System Requirements

### Minimum Requirements
- **OS**: Windows 10, macOS 10.15, or Linux
- **RAM**: 4GB
- **Disk**: 500MB free space
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Recommended Requirements
- **OS**: Latest version
- **RAM**: 8GB or more
- **Disk**: 1GB free space
- **Browser**: Latest version
- **Internet**: For initial npm install only

## 🎯 Next Steps

After successful installation:

1. ✅ Read the [QUICKSTART.md](./QUICKSTART.md)
2. ✅ Explore the [FEATURES.md](./FEATURES.md)
3. ✅ Check the [README.md](./README.md)
4. ✅ Start using ZenTasks!

## 💡 Tips

- Use **nvm** for managing Node.js versions
- Use **VS Code** for editing (recommended)
- Install **ESLint extension** for code quality
- Use **Git** for version control
- Keep **Node.js updated** for security

## 🆘 Still Having Issues?

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the error message carefully
3. Search for the error online
4. Check GitHub issues
5. Ask for help in discussions

## 📚 Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [npm Documentation](https://docs.npmjs.com/)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

---

**Installation complete!** 🎉

Now you're ready to use ZenTasks. Happy task managing!
