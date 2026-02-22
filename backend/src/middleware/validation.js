import { AppError } from './errorHandler.js';

// Validation helper functions
export const validateRequired = (fields, data) => {
  const missing = [];
  for (const field of fields) {
    if (!data[field] || data[field].toString().trim() === '') {
      missing.push(field);
    }
  }
  if (missing.length > 0) {
    throw new AppError(`Missing required fields: ${missing.join(', ')}`, 400);
  }
};

export const validateNumber = (value, fieldName, min = null, max = null) => {
  const num = Number(value);
  if (isNaN(num)) {
    throw new AppError(`${fieldName} must be a valid number`, 400);
  }
  if (min !== null && num < min) {
    throw new AppError(`${fieldName} must be at least ${min}`, 400);
  }
  if (max !== null && num > max) {
    throw new AppError(`${fieldName} must be at most ${max}`, 400);
  }
  return num;
};

export const validateRating = (rating) => {
  return validateNumber(rating, 'Rating', 1, 5);
};

export const validatePrice = (price) => {
  return validateNumber(price, 'Price', 0);
};

// Validate CSV/Excel data structure
export const validateImportData = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new AppError('No data found in file', 400);
  }

  const errors = [];
  
  data.forEach((row, index) => {
    const rowErrors = [];
    
    // Check required fields
    if (!row.product_name) rowErrors.push('product_name is required');
    if (!row.category_name) rowErrors.push('category_name is required');
    if (!row.price) rowErrors.push('price is required');
    if (!row.customer_name) rowErrors.push('customer_name is required');
    if (!row.rating) rowErrors.push('rating is required');
    
    // Validate data types
    if (row.price && isNaN(Number(row.price))) {
      rowErrors.push('price must be a number');
    }
    if (row.rating && (isNaN(Number(row.rating)) || Number(row.rating) < 1 || Number(row.rating) > 5)) {
      rowErrors.push('rating must be a number between 1 and 5');
    }
    
    if (rowErrors.length > 0) {
      errors.push(`Row ${index + 1}: ${rowErrors.join(', ')}`);
    }
  });
  
  if (errors.length > 0) {
    throw new AppError(`Validation errors:\n${errors.join('\n')}`, 400);
  }
  
  return true;
};

// File upload validation
export const validateFileUpload = (req, res, next) => {
  if (!req.file) {
    throw new AppError('Please upload a file', 400);
  }
  
  const allowedMimeTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  
  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    throw new AppError('Please upload a valid CSV or Excel file', 400);
  }
  
  next();
};
