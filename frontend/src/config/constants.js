// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://product-reviews-backend.onrender.com';

export const API_ENDPOINTS = {
  ANALYTICS: {
    DASHBOARD: '/api/analytics/dashboard',
    CATEGORIES: '/api/analytics/categories',
    CATEGORY_RATINGS: '/api/analytics/categories/ratings',
    PRODUCTS: '/api/analytics/products',
    TOP_WORST: '/api/analytics/products/top-worst',
    REVIEWS: '/api/analytics/reviews',
    TRENDS: '/api/analytics/reviews/trends',
  },
  UPLOAD: {
    IMPORT: '/api/upload/import',
    TEMPLATE: '/api/upload/template',
  },
};
