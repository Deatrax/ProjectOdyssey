require('dotenv').config(); // Load .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // <--- CRITICAL FOR FRONTEND CONNECTION
const session = require('express-session');
const passport = require('passport');
require('./config/passport'); // Initialize Passport

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth'); 
const oauthRoutes = require('./routes/oauth'); // NEW - OAuth routes
const protectedRoutes = require("./routes/protected");
const aiRoutes = require("./routes/ai.routes");
const placeRoutes = require("./routes/placeRoutes");
const clusteringRoutes = require("./routes/clustering.routes");
const tripRoutes = require("./routes/tripRoutes");


const app = express();

// 1. Enable CORS (Allow localhost:3000 to talk to this server)
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000","http://113.11.100.133:55680"],
  credentials: true
}));

// 2. Session middleware (for OAuth flow)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000  // 24 hours
  }
}));

// 3. Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// 4. Body Parser (So we can read JSON)
app.use(express.json());

// 5. Connect Database
connectDB();

// 6. Mount Routes
app.use("/api/ai", aiRoutes);

// This means "server/src/routes/auth.js" becomes "http://localhost:PORT/api/auth/..."
app.use('/api/auth', authRoutes);
app.use('/api/auth', oauthRoutes); // NEW - Google OAuth routes
app.use('/api/user', protectedRoutes);
app.use('/api/ai', placeRoutes);
app.use('/api/clustering', clusteringRoutes);
app.use('/api/trips', tripRoutes);

// 7. Start Server
const PORT = process.env.PORT || 5001; // Defaults to 5001 if .env is missing
app.listen(PORT, () => {
   console.log(`✅ Server running on http://localhost:${PORT}`);
   console.log(`👉 Login Route: http://localhost:${PORT}/api/auth/login`);
   console.log(`👉 Signup Route: http://localhost:${PORT}/api/auth/signup`);
   console.log(`👉 Google OAuth: http://localhost:${PORT}/api/auth/google`);
});