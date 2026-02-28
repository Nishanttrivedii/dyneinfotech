-- This is for learning - you can run this directly in pgAdmin or DBeaver

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Let's add a comment to understand what this table does
COMMENT ON TABLE categories IS 'Stores product categories like Electronics, Clothing, etc.';

-- Sample data for testing
INSERT INTO categories (name, description) VALUES 
('Electronics', 'Electronic devices and gadgets'),
('Clothing', 'Apparel and fashion items'),
('Books', 'Physical and digital books');