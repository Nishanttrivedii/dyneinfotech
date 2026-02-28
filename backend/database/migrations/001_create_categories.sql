-- Migration: Create categories table
-- This will be run automatically by our migration script

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add table comment for documentation
COMMENT ON TABLE categories IS 'Stores product categories like Electronics, Clothing, Books, etc.';

-- Add column comments
COMMENT ON COLUMN categories.id IS 'Unique identifier for category';
COMMENT ON COLUMN categories.name IS 'Category name - must be unique';
COMMENT ON COLUMN categories.description IS 'Optional description of the category';
