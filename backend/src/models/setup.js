import { initializeDatabase, insertSampleData } from './schema.js';
import pool from '../config/database.js';

// Main setup function
const setupDatabase = async () => {
  try {
    console.log('🚀 Starting database setup...\n');

    // Step 1: Create tables
    await initializeDatabase();

    // Step 2: Insert sample data
    await insertSampleData();

    console.log('\n🎉 Database setup completed successfully!');
    console.log('📊 You can now start using the API.\n');

    // Close pool
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database setup failed:', error);
    process.exit(1);
  }
};

// Run setup
setupDatabase();
