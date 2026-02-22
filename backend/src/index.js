import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/database.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route - API documentation
app.get("/", (req, res) => {
  res.json({ 
    success: true,
    message: 'Welcome to Product Reviews & Analytics API!',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      upload: {
        template: 'GET /api/upload/template',
        import: 'POST /api/upload/import (multipart/form-data with file)'
      },
      analytics: {
        dashboard: 'GET /api/analytics/dashboard',
        categories: 'GET /api/analytics/categories',
        categoryRatings: 'GET /api/analytics/categories/ratings',
        products: 'GET /api/analytics/products?category=&minRating=&maxPrice=&search=&sortBy=&order=',
        topWorstProducts: 'GET /api/analytics/products/top-worst?limit=5',
        productPerformance: 'GET /api/analytics/products/:id/performance',
        reviews: 'GET /api/analytics/reviews?productId=&rating=&limit=',
        reviewTrends: 'GET /api/analytics/reviews/trends?period=daily&days=30',
        reviewEngagement: 'GET /api/analytics/reviews/engagement'
      }
    }
  });
});

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      success: true,
      status: "healthy",
      database: "connected",
      timestamp: result.rows[0].now
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: "unhealthy",
      database: "disconnected",
      error: err.message
    });
  }
});

// API Routes
app.use("/api/upload", uploadRoutes);
app.use("/api/analytics", analyticsRoutes);

// 404 handler - must be after all routes
app.use(notFound);

// Global error handler - must be last
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 API Documentation: http://localhost:${PORT}/`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
  console.log(`${'='.repeat(50)}\n`);
});