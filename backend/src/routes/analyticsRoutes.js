import express from 'express';
import {
  getDashboardAnalytics,
  getCategoryWiseRatings,
  getReviewTrends,
  getProductPerformance,
  getTopAndWorstProducts,
  getReviewEngagement,
  getProducts,
  getCategories,
  getReviews
} from '../controllers/analyticsController.js';

const router = express.Router();

// Dashboard & Overview
router.get('/dashboard', getDashboardAnalytics);

// Category Analytics
router.get('/categories', getCategories);
router.get('/categories/ratings', getCategoryWiseRatings);

// Product Analytics
router.get('/products', getProducts);
router.get('/products/top-worst', getTopAndWorstProducts);
router.get('/products/:productId/performance', getProductPerformance);

// Review Analytics
router.get('/reviews', getReviews);
router.get('/reviews/trends', getReviewTrends);
router.get('/reviews/engagement', getReviewEngagement);

export default router;
