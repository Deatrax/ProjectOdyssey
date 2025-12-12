require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth'); 
const protectedRoutes = require("./routes/protected");

const app = express();
app.use(express.json());


// Connect mongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', protectedRoutes);

// Connect PORT
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
   console.log("Server started on PORT: " + PORT);
})



