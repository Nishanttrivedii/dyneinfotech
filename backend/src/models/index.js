import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Step 1: Create connection to PostgreSQL
const sequelize = new Sequelize(
  process.env.DB_NAME,      // database name
  process.env.DB_USER,      // username
  process.env.DB_PASSWORD,  // password
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    logging: false  // Turn off SQL logs (less noise in console)
  }
);

// Step 2: Test if connection works
sequelize.authenticate()
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.error('❌ Connection failed:', err));

// Step 3: Export so other files can use it
export default sequelize;
