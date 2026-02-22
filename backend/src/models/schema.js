import pool from '../config/database.js';

// SQL queries to create tables
const createTablesSQL = `
  -- Drop tables if they exist (for fresh start)
  DROP TABLE IF EXISTS reviews CASCADE;
  DROP TABLE IF EXISTS products CASCADE;
  DROP TABLE IF EXISTS categories CASCADE;

  -- Create categories table
  CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Create products table
  CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    category_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
  );

  -- Create reviews table
  CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  );

  -- Create indexes for better query performance
  CREATE INDEX idx_products_category ON products(category_id);
  CREATE INDEX idx_reviews_product ON reviews(product_id);
  CREATE INDEX idx_reviews_rating ON reviews(rating);
  CREATE INDEX idx_reviews_created_at ON reviews(created_at);
`;

// Function to initialize database
export const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing database...');
    
    // Execute the SQL
    await pool.query(createTablesSQL);
    
    console.log('✅ Database tables created successfully!');
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    throw error;
  }
};

// Function to insert sample data
export const insertSampleData = async () => {
  try {
    console.log('🔄 Inserting sample data...');

    // Insert categories
    await pool.query(`
      INSERT INTO categories (name, description) VALUES
        ('Electronics', 'Electronic devices and gadgets'),
        ('Clothing', 'Fashion and apparel items'),
        ('Books', 'Books and literature'),
        ('Home & Kitchen', 'Home appliances and kitchen items'),
        ('Sports', 'Sports equipment and accessories')
      ON CONFLICT (name) DO NOTHING;
    `);

    // Insert products
    await pool.query(`
      INSERT INTO products (name, description, price, category_id) VALUES
        ('iPhone 15 Pro', 'Latest Apple smartphone with A17 chip and titanium design', 999.99, 1),
        ('Samsung Galaxy S24', 'Flagship Android phone with AI features', 899.99, 1),
        ('MacBook Pro', 'Powerful laptop for professionals with M3 chip', 1999.99, 1),
        ('Sony WH-1000XM5', 'Premium noise-cancelling headphones', 399.99, 1),
        ('Nike Running Shoes', 'Comfortable sports shoes for daily running', 89.99, 2),
        ('Levi Jeans', 'Classic denim jeans with perfect fit', 59.99, 2),
        ('Adidas T-Shirt', 'Breathable sports t-shirt', 29.99, 2),
        ('The Great Gatsby', 'Classic American novel by F. Scott Fitzgerald', 12.99, 3),
        ('Atomic Habits', 'Self-help book about building good habits', 16.99, 3),
        ('Blender Pro', 'High-speed kitchen blender with multiple settings', 149.99, 4),
        ('Air Fryer', 'Healthy cooking with hot air circulation', 89.99, 4),
        ('Yoga Mat', 'Non-slip exercise mat for yoga and fitness', 29.99, 5),
        ('Dumbbells Set', 'Adjustable dumbbells for home workout', 149.99, 5);
    `);

    // Insert reviews
    await pool.query(`
      INSERT INTO reviews (product_id, customer_name, rating, review_text, created_at) VALUES
        (1, 'John Doe', 5, 'Amazing phone! Camera quality is superb and battery life excellent.', NOW() - INTERVAL '10 days'),
        (1, 'Jane Smith', 4, 'Great phone but a bit expensive. Worth it though!', NOW() - INTERVAL '8 days'),
        (1, 'Mike Johnson', 5, 'Best iPhone yet! Love the new features and titanium build.', NOW() - INTERVAL '5 days'),
        (1, 'Sarah Wilson', 3, 'Good phone but not much different from iPhone 14 Pro', NOW() - INTERVAL '3 days'),
        (2, 'Tom Brown', 4, 'Solid Android phone with great battery life and display.', NOW() - INTERVAL '12 days'),
        (2, 'Emma Davis', 5, 'Best Samsung phone ever! AI features are incredible.', NOW() - INTERVAL '7 days'),
        (2, 'Chris Lee', 4, 'Great value for money. Highly recommended!', NOW() - INTERVAL '4 days'),
        (3, 'Emily Wilson', 5, 'Perfect for my work. Fast, reliable and beautiful display.', NOW() - INTERVAL '15 days'),
        (3, 'Robert Green', 5, 'Best laptop I have ever owned. M3 chip is blazing fast!', NOW() - INTERVAL '9 days'),
        (3, 'Lisa Black', 4, 'Excellent laptop but quite pricey.', NOW() - INTERVAL '6 days'),
        (4, 'David White', 5, 'Best noise cancelling headphones. Comfort and sound quality are top-notch.', NOW() - INTERVAL '11 days'),
        (4, 'Anna Taylor', 4, 'Great headphones but a bit heavy for long use.', NOW() - INTERVAL '5 days'),
        (5, 'Mark Anderson', 5, 'Very comfortable for long runs! Great cushioning.', NOW() - INTERVAL '14 days'),
        (5, 'Jennifer Moore', 4, 'Good running shoes. Sizing runs a bit small.', NOW() - INTERVAL '8 days'),
        (6, 'Paul Martinez', 4, 'Good quality jeans, fits well and comfortable.', NOW() - INTERVAL '10 days'),
        (6, 'Maria Garcia', 5, 'Perfect fit! Best jeans I have bought.', NOW() - INTERVAL '6 days'),
        (7, 'Kevin Rodriguez', 3, 'Decent t-shirt but fabric could be better.', NOW() - INTERVAL '7 days'),
        (8, 'Laura Hernandez', 5, 'Timeless classic. Must read! Beautiful prose.', NOW() - INTERVAL '16 days'),
        (8, 'James Lopez', 5, 'One of the best novels ever written.', NOW() - INTERVAL '12 days'),
        (9, 'Susan Hill', 5, 'Life-changing book! Highly recommended for everyone.', NOW() - INTERVAL '9 days'),
        (9, 'Richard Scott', 4, 'Great insights on habit formation. Very practical.', NOW() - INTERVAL '5 days'),
        (10, 'Patricia Young', 4, 'Works great for smoothies and soups. A bit noisy.', NOW() - INTERVAL '13 days'),
        (10, 'Daniel King', 5, 'Powerful blender! Makes smoothies in seconds.', NOW() - INTERVAL '7 days'),
        (11, 'Linda Wright', 5, 'Love this air fryer! Healthier cooking made easy.', NOW() - INTERVAL '11 days'),
        (11, 'Joseph Turner', 4, 'Good air fryer but takes longer than expected.', NOW() - INTERVAL '6 days'),
        (12, 'Barbara Adams', 5, 'Perfect yoga mat! Great grip and cushioning.', NOW() - INTERVAL '10 days'),
        (12, 'Charles Baker', 4, 'Good quality mat. Slightly thin but works well.', NOW() - INTERVAL '4 days'),
        (13, 'Nancy Nelson', 5, 'Excellent dumbbells! Very sturdy and easy to adjust.', NOW() - INTERVAL '8 days'),
        (13, 'Steven Carter', 4, 'Good value but adjustment mechanism could be smoother.', NOW() - INTERVAL '3 days');
    `);

    console.log('✅ Sample data inserted successfully!');
  } catch (error) {
    console.error('❌ Error inserting sample data:', error.message);
    throw error;
  }
};
