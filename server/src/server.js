require('dotenv').config(); // Load .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // <--- CRITICAL FOR FRONTEND CONNECTION
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth'); 
const protectedRoutes = require("./routes/protected");
const aiRoutes = require("./routes/ai.routes");
const placeRoutes = require("./routes/placeRoutes");


const app = express();

// 1. Enable CORS (Allow localhost:3000 to talk to this server)
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000","http://113.11.100.133:55680"],
  credentials: true
}));


// 2. Body Parser (So we can read JSON)
app.use(express.json());

// 3. Connect Database
connectDB();

// 4. Mount Routes
app.use("/api/ai", aiRoutes);


// This means "server/src/routes/auth.js" becomes "http://localhost:PORT/api/auth/..."
app.use('/api/auth', authRoutes);
app.use('/api/user', protectedRoutes);
app.use('/api/ai', placeRoutes);

// 5. Start Server
const PORT = process.env.PORT || 5001; // Defaults to 5001 if .env is missing
app.listen(PORT, () => {
   console.log(`✅ Server running on http://localhost:${PORT}`);
   console.log(`👉 Login Route: http://localhost:${PORT}/api/auth/login`);
   console.log(`👉 Signup Route: http://localhost:${PORT}/api/auth/signup`);
});