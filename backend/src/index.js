import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./models/index.js";
import Category from "./models/Category.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    // Test database connection
    await sequelize.authenticate();
    
    res.json({
      status: "healthy",
      database: "connected",
      timestamp: new Date()
    });
  } catch (err) {
    res.status(500).json({
      status: "unhealthy",
      database: "disconnected",
      error: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  
  // Sync database (creates tables if they don't exist)
  try {
    await sequelize.sync({ alter: true });  // force: true drops and recreates tables
    console.log('✅ Database tables created fresh');
  } catch (err) {
    console.error('❌ Database sync failed:', err);
  }
});