import pool from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// Get overall analytics dashboard
export const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const client = await pool.connect();
  
  try {
    // Get total counts
    const countsQuery = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM categories) as total_categories,
        (SELECT COUNT(*) FROM products) as total_products,
        (SELECT COUNT(*) FROM reviews) as total_reviews,
        (SELECT ROUND(AVG(rating)::numeric, 2) FROM reviews) as average_rating
    `);

    // Get rating distribution
    const ratingDistQuery = await client.query(`
      SELECT 
        rating,
        COUNT(*) as count,
        ROUND((COUNT(*)::numeric / (SELECT COUNT(*) FROM reviews) * 100), 2) as percentage
      FROM reviews
      GROUP BY rating
      ORDER BY rating DESC
    `);

    // Get top rated products
    const topProductsQuery = await client.query(`
      SELECT 
        p.id,
        p.name,
        p.price,
        c.name as category,
        ROUND(AVG(r.rating)::numeric, 2) as average_rating,
        COUNT(r.id) as review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN reviews r ON p.id = r.product_id
      GROUP BY p.id, p.name, p.price, c.name
      HAVING COUNT(r.id) > 0
      ORDER BY average_rating DESC, review_count DESC
      LIMIT 10
    `);

    // Get recent reviews
    const recentReviewsQuery = await client.query(`
      SELECT 
        r.id,
        r.customer_name,
        r.rating,
        r.review_text,
        r.created_at,
        p.name as product_name,
        c.name as category
      FROM reviews r
      JOIN products p ON r.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      ORDER BY r.created_at DESC
      LIMIT 10
    `);

    res.status(200).json({
      success: true,
      data: {
        summary: countsQuery.rows[0],
        ratingDistribution: ratingDistQuery.rows,
        topRatedProducts: topProductsQuery.rows,
        recentReviews: recentReviewsQuery.rows
      }
    });

  } finally {
    client.release();
  }
});

// Get category-wise rating distribution
export const getCategoryWiseRatings = asyncHandler(async (req, res) => {
  const result = await pool.query(`
    SELECT 
      c.id,
      c.name as category_name,
      COUNT(DISTINCT p.id) as product_count,
      COUNT(r.id) as review_count,
      ROUND(AVG(r.rating)::numeric, 2) as average_rating,
      ROUND(MIN(r.rating)::numeric, 2) as min_rating,
      ROUND(MAX(r.rating)::numeric, 2) as max_rating,
      ROUND(AVG(p.price)::numeric, 2) as average_price
    FROM categories c
    LEFT JOIN products p ON c.id = p.category_id
    LEFT JOIN reviews r ON p.id = r.product_id
    GROUP BY c.id, c.name
    ORDER BY average_rating DESC NULLS LAST
  `);

  res.status(200).json({
    success: true,
    count: result.rows.length,
    data: result.rows
  });
});

// Get review trends over time
export const getReviewTrends = asyncHandler(async (req, res) => {
  const { period = 'daily', days = 30 } = req.query;

  let dateFormat;
  switch (period) {
    case 'hourly':
      dateFormat = 'YYYY-MM-DD HH24:00:00';
      break;
    case 'weekly':
      dateFormat = 'IYYY-IW';
      break;
    case 'monthly':
      dateFormat = 'YYYY-MM';
      break;
    default:
      dateFormat = 'YYYY-MM-DD';
  }

  const result = await pool.query(`
    SELECT 
      TO_CHAR(created_at, $1) as period,
      COUNT(*) as review_count,
      ROUND(AVG(rating)::numeric, 2) as average_rating,
      COUNT(CASE WHEN rating >= 4 THEN 1 END) as positive_reviews,
      COUNT(CASE WHEN rating <= 2 THEN 1 END) as negative_reviews
    FROM reviews
    WHERE created_at >= NOW() - INTERVAL '${parseInt(days)} days'
    GROUP BY TO_CHAR(created_at, $1)
    ORDER BY period ASC
  `, [dateFormat]);

  res.status(200).json({
    success: true,
    period,
    days: parseInt(days),
    count: result.rows.length,
    data: result.rows
  });
});

// Get product performance details
export const getProductPerformance = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const client = await pool.connect();

  try {
    // Get product details with ratings
    const productQuery = await client.query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        c.name as category,
        COUNT(r.id) as total_reviews,
        ROUND(AVG(r.rating)::numeric, 2) as average_rating,
        COUNT(CASE WHEN r.rating = 5 THEN 1 END) as five_star,
        COUNT(CASE WHEN r.rating = 4 THEN 1 END) as four_star,
        COUNT(CASE WHEN r.rating = 3 THEN 1 END) as three_star,
        COUNT(CASE WHEN r.rating = 2 THEN 1 END) as two_star,
        COUNT(CASE WHEN r.rating = 1 THEN 1 END) as one_star
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN reviews r ON p.id = r.product_id
      WHERE p.id = $1
      GROUP BY p.id, p.name, p.description, p.price, c.name
    `, [productId]);

    if (productQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Get reviews for the product
    const reviewsQuery = await client.query(`
      SELECT 
        id,
        customer_name,
        rating,
        review_text,
        created_at
      FROM reviews
      WHERE product_id = $1
      ORDER BY created_at DESC
    `, [productId]);

    res.status(200).json({
      success: true,
      data: {
        product: productQuery.rows[0],
        reviews: reviewsQuery.rows
      }
    });

  } finally {
    client.release();
  }
});

// Get top and worst performing products
export const getTopAndWorstProducts = asyncHandler(async (req, res) => {
  const { limit = 5 } = req.query;

  const client = await pool.connect();

  try {
    // Top products
    const topQuery = await client.query(`
      SELECT 
        p.id,
        p.name,
        p.price,
        c.name as category,
        ROUND(AVG(r.rating)::numeric, 2) as average_rating,
        COUNT(r.id) as review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN reviews r ON p.id = r.product_id
      GROUP BY p.id, p.name, p.price, c.name
      HAVING COUNT(r.id) >= 2
      ORDER BY average_rating DESC, review_count DESC
      LIMIT $1
    `, [parseInt(limit)]);

    // Worst products
    const worstQuery = await client.query(`
      SELECT 
        p.id,
        p.name,
        p.price,
        c.name as category,
        ROUND(AVG(r.rating)::numeric, 2) as average_rating,
        COUNT(r.id) as review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN reviews r ON p.id = r.product_id
      GROUP BY p.id, p.name, p.price, c.name
      HAVING COUNT(r.id) >= 2
      ORDER BY average_rating ASC, review_count DESC
      LIMIT $1
    `, [parseInt(limit)]);

    res.status(200).json({
      success: true,
      data: {
        topProducts: topQuery.rows,
        worstProducts: worstQuery.rows
      }
    });

  } finally {
    client.release();
  }
});

// Get review engagement metrics
export const getReviewEngagement = asyncHandler(async (req, res) => {
  const result = await pool.query(`
    SELECT 
      COUNT(*) as total_reviews,
      COUNT(CASE WHEN review_text IS NOT NULL AND LENGTH(review_text) > 0 THEN 1 END) as reviews_with_text,
      ROUND((COUNT(CASE WHEN review_text IS NOT NULL AND LENGTH(review_text) > 0 THEN 1 END)::numeric / COUNT(*) * 100), 2) as text_percentage,
      ROUND(AVG(LENGTH(review_text))::numeric, 0) as average_review_length,
      COUNT(CASE WHEN rating >= 4 THEN 1 END) as positive_reviews,
      COUNT(CASE WHEN rating = 3 THEN 1 END) as neutral_reviews,
      COUNT(CASE WHEN rating <= 2 THEN 1 END) as negative_reviews,
      ROUND((COUNT(CASE WHEN rating >= 4 THEN 1 END)::numeric / COUNT(*) * 100), 2) as positive_percentage,
      ROUND((COUNT(CASE WHEN rating <= 2 THEN 1 END)::numeric / COUNT(*) * 100), 2) as negative_percentage
    FROM reviews
  `);

  // Most active reviewers
  const activeReviewers = await pool.query(`
    SELECT 
      customer_name,
      COUNT(*) as review_count,
      ROUND(AVG(rating)::numeric, 2) as average_rating
    FROM reviews
    GROUP BY customer_name
    HAVING COUNT(*) > 1
    ORDER BY review_count DESC
    LIMIT 10
  `);

  res.status(200).json({
    success: true,
    data: {
      engagement: result.rows[0],
      mostActiveReviewers: activeReviewers.rows
    }
  });
});

// Get all products with filters
export const getProducts = asyncHandler(async (req, res) => {
  const { category, minRating, maxPrice, search, sortBy = 'name', order = 'ASC' } = req.query;

  let query = `
    SELECT 
      p.id,
      p.name,
      p.description,
      p.price,
      c.name as category,
      c.id as category_id,
      COUNT(r.id) as review_count,
      ROUND(AVG(r.rating)::numeric, 2) as average_rating
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN reviews r ON p.id = r.product_id
    WHERE 1=1
  `;

  const params = [];
  let paramCount = 1;

  if (category) {
    query += ` AND c.name ILIKE $${paramCount}`;
    params.push(`%${category}%`);
    paramCount++;
  }

  if (maxPrice) {
    query += ` AND p.price <= $${paramCount}`;
    params.push(parseFloat(maxPrice));
    paramCount++;
  }

  if (search) {
    query += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
    params.push(`%${search}%`);
    paramCount++;
  }

  query += ` GROUP BY p.id, p.name, p.description, p.price, c.name, c.id`;

  if (minRating) {
    query += ` HAVING AVG(r.rating) >= $${paramCount}`;
    params.push(parseFloat(minRating));
    paramCount++;
  }

  const validSortColumns = ['name', 'price', 'average_rating', 'review_count'];
  const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'name';
  const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  
  query += ` ORDER BY ${sortColumn} ${sortOrder} NULLS LAST`;

  const result = await pool.query(query, params);

  res.status(200).json({
    success: true,
    count: result.rows.length,
    data: result.rows
  });
});

// Get all categories
export const getCategories = asyncHandler(async (req, res) => {
  const result = await pool.query(`
    SELECT 
      c.id,
      c.name,
      COUNT(p.id) as product_count,
      COUNT(r.id) as review_count,
      ROUND(AVG(r.rating)::numeric, 2) as average_rating
    FROM categories c
    LEFT JOIN products p ON c.id = p.category_id
    LEFT JOIN reviews r ON p.id = r.product_id
    GROUP BY c.id, c.name
    ORDER BY c.name
  `);

  res.status(200).json({
    success: true,
    count: result.rows.length,
    data: result.rows
  });
});

// Get all reviews with filters
export const getReviews = asyncHandler(async (req, res) => {
  const { productId, rating, limit = 50 } = req.query;

  let query = `
    SELECT 
      r.id,
      r.customer_name,
      r.rating,
      r.review_text,
      r.created_at,
      p.name as product_name,
      p.id as product_id,
      c.name as category
    FROM reviews r
    JOIN products p ON r.product_id = p.id
    JOIN categories c ON p.category_id = c.id
    WHERE 1=1
  `;

  const params = [];
  let paramCount = 1;

  if (productId) {
    query += ` AND r.product_id = $${paramCount}`;
    params.push(parseInt(productId));
    paramCount++;
  }

  if (rating) {
    query += ` AND r.rating = $${paramCount}`;
    params.push(parseInt(rating));
    paramCount++;
  }

  query += ` ORDER BY r.created_at DESC LIMIT $${paramCount}`;
  params.push(parseInt(limit));

  const result = await pool.query(query, params);

  res.status(200).json({
    success: true,
    count: result.rows.length,
    data: result.rows
  });
});
