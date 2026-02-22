import fs from 'fs';
import csv from 'csv-parser';
import xlsx from 'xlsx';
import pool from '../config/database.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import { validateImportData } from '../middleware/validation.js';

// Parse CSV file
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};

// Parse Excel file
const parseExcel = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet);
  return data;
};

// Import data from CSV/Excel
export const importData = asyncHandler(async (req, res) => {
  const file = req.file;
  
  if (!file) {
    throw new AppError('Please upload a file', 400);
  }

  const filePath = file.path;
  let data = [];

  try {
    // Parse file based on type
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      data = await parseCSV(filePath);
    } else if (
      file.mimetype === 'application/vnd.ms-excel' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.originalname.endsWith('.xlsx') ||
      file.originalname.endsWith('.xls')
    ) {
      data = parseExcel(filePath);
    } else {
      throw new AppError('Unsupported file format. Please upload CSV or Excel file.', 400);
    }

    // Validate data structure
    validateImportData(data);

    // Process and insert data
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      let categoriesAdded = 0;
      let productsAdded = 0;
      let reviewsAdded = 0;

      // Track categories and products to avoid duplicates
      const categoryMap = new Map();
      const productMap = new Map();

      for (const row of data) {
        // Insert or get category
        let categoryId = categoryMap.get(row.category_name);
        
        if (!categoryId) {
          const categoryResult = await client.query(
            `INSERT INTO categories (name, description) 
             VALUES ($1, $2) 
             ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
             RETURNING id`,
            [row.category_name, row.category_description || null]
          );
          categoryId = categoryResult.rows[0].id;
          categoryMap.set(row.category_name, categoryId);
          categoriesAdded++;
        }

        // Insert or get product
        const productKey = `${row.product_name}_${categoryId}`;
        let productId = productMap.get(productKey);

        if (!productId) {
          const productResult = await client.query(
            `INSERT INTO products (name, description, price, category_id) 
             VALUES ($1, $2, $3, $4) 
             RETURNING id`,
            [
              row.product_name,
              row.product_description || null,
              Number(row.price),
              categoryId
            ]
          );
          productId = productResult.rows[0].id;
          productMap.set(productKey, productId);
          productsAdded++;
        }

        // Insert review
        await client.query(
          `INSERT INTO reviews (product_id, customer_name, rating, review_text) 
           VALUES ($1, $2, $3, $4)`,
          [
            productId,
            row.customer_name,
            Number(row.rating),
            row.review_text || null
          ]
        );
        reviewsAdded++;
      }

      await client.query('COMMIT');

      // Delete uploaded file
      fs.unlinkSync(filePath);

      res.status(200).json({
        success: true,
        message: 'Data imported successfully',
        data: {
          totalRows: data.length,
          categoriesAdded,
          productsAdded,
          reviewsAdded
        }
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    // Clean up file on error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
});

// Get import template information
export const getImportTemplate = asyncHandler(async (req, res) => {
  const template = {
    requiredColumns: [
      'product_name',
      'category_name',
      'price',
      'customer_name',
      'rating'
    ],
    optionalColumns: [
      'product_description',
      'category_description',
      'review_text'
    ],
    sampleData: [
      {
        product_name: 'iPhone 15 Pro',
        product_description: 'Latest Apple smartphone',
        category_name: 'Electronics',
        category_description: 'Electronic devices',
        price: 999.99,
        customer_name: 'John Doe',
        rating: 5,
        review_text: 'Amazing phone!'
      },
      {
        product_name: 'Nike Running Shoes',
        product_description: 'Comfortable sports shoes',
        category_name: 'Sports',
        category_description: 'Sports equipment',
        price: 89.99,
        customer_name: 'Jane Smith',
        rating: 4,
        review_text: 'Great shoes for running!'
      }
    ],
    validationRules: {
      product_name: 'Required, max 200 characters',
      category_name: 'Required, max 100 characters',
      price: 'Required, must be a positive number',
      customer_name: 'Required, max 100 characters',
      rating: 'Required, must be integer between 1 and 5',
      review_text: 'Optional, text',
      product_description: 'Optional, text',
      category_description: 'Optional, text'
    }
  };

  res.status(200).json({
    success: true,
    data: template
  });
});
