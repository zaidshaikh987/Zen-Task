# 🚀 Quick Start - MongoDB Backend

## Step 1: Update Your MongoDB Password

Open `.env` file and replace `pass123` with your actual MongoDB password:

```env
MONGODB_URI=mongodb+srv://zaidshaikh98848:YOUR_ACTUAL_PASSWORD@cluster0.kgiff2o.mongodb.net/zentasks?retryWrites=true&w=majority&appName=Cluster0
```

## Step 2: Start the Backend Server

Open a terminal and run:

```bash
npm run server:dev
```

You should see:
```
✅ Connected to MongoDB Atlas
📊 Database: zentasks
🚀 Server running on http://localhost:5000
```

## Step 3: Start the Frontend (in another terminal)

```bash
npm run dev
```

## OR Start Both Together

```bash
npm start
```

## Verify Connection

1. Backend: http://localhost:5000/api/health
2. Frontend: http://localhost:5173
3. Admin Dashboard: http://localhost:5173/dashboard/admin

## Troubleshooting

### "MongoDB connection error"
- Check your password in `.env`
- Ensure your IP is whitelisted in MongoDB Atlas
- Go to MongoDB Atlas → Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)

### "Port 5000 already in use"
- Change PORT in `.env` to 5001
- Or kill the process: `npx kill-port 5000`

### Admin page shows "Server Not Running"
- Make sure backend is running: `npm run server:dev`
- Check http://localhost:5000/api/health in browser

## MongoDB Atlas Setup

1. Go to https://cloud.mongodb.com
2. Sign in with your account
3. Go to "Network Access"
4. Click "Add IP Address"
5. Click "Allow Access from Anywhere"
6. Click "Confirm"

Now your server should connect!
