require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const userRoutes = require('./routes/auth');
const playerRoutes = require('./routes/playerRoutes');

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Connect Database
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/players', playerRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
