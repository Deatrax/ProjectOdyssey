require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const app = express();
app.use(express.json())

const PORT = process.env.PORT || 5001
connectDB();

app.listen(PORT, () => {
   console.log("Server started on PORT: " + PORT);
})



