import { DataTypes } from 'sequelize';
import sequelize from './index.js';

// Define the Category model
const Category = sequelize.define('Category', {
  // Column 1: id (auto-generated)
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  // Column 2: name (required, unique)
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  
  // Column 3: description (optional)
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'categories',
  timestamps: true,  // Adds createdAt and updatedAt automatically
  underscored: true  // Uses snake_case (created_at instead of createdAt)
});

export default Category;
