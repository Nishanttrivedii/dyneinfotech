import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../src/config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  try {
    console.log('🚀 Starting migrations...\n');

    // Create migrations tracking table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Migrations tracking table ready\n');

    // Read all migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    
    // Check if migrations directory exists
    if (!fs.existsSync(migrationsDir)) {
      console.log('📁 Creating migrations directory...');
      fs.mkdirSync(migrationsDir, { recursive: true });
    }

    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    if (files.length === 0) {
      console.log('⚠️  No migration files found in database/migrations/');
      process.exit(0);
    }

    // Run each migration
    for (const file of files) {
      // Check if already executed
      const result = await pool.query(
        'SELECT * FROM migrations WHERE name = $1',
        [file]
      );

      if (result.rows.length === 0) {
        console.log(`▶️  Running migration: ${file}`);
        
        // Read and execute the SQL file
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        await pool.query(sql);
        
        // Record that migration was executed
        await pool.query(
          'INSERT INTO migrations (name) VALUES ($1)',
          [file]
        );
        
        console.log(`✅ Completed: ${file}\n`);
      } else {
        console.log(`⏭️  Skipped (already executed): ${file}\n`);
      }
    }

    console.log('🎉 All migrations completed successfully!');
    await pool.end();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    await pool.end();
    process.exit(1);
  }
}

runMigrations();