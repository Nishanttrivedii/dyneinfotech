# Product Ratings and Review Analytics Dashboard

A comprehensive backend API for analyzing product ratings, reviews, and customer feedback trends built with Node.js, Express, and PostgreSQL.

## 🚀 Features

- ✅ RESTful API with Node.js & Express
- ✅ PostgreSQL database with optimized schema
- ✅ CSV/Excel file import for bulk data upload
- ✅ Comprehensive analytics endpoints:
  - Dashboard overview with key metrics
  - Category-wise rating distribution
  - Product performance analysis
  - Review trends over time
  - Review engagement metrics
  - Top and worst performing products
- ✅ Advanced filtering, sorting, and search
- ✅ Proper error handling and validation
- ✅ Sample data included for testing

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd "dyne infotech assignment"
```

### 2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Configure environment variables
Create or edit the `.env` file in the `backend` directory:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=product_reviews
DB_USER=postgres
DB_PASSWORD=your_password_here
```

### 4. Create PostgreSQL database
Open pgAdmin or psql and create the database:
```sql
CREATE DATABASE product_reviews;
```

### 5. Setup database tables and sample data
```bash
cd backend
npm run setup:db
```

This command will:
- Create all necessary tables (categories, products, reviews)
- Set up foreign key relationships
- Insert sample data for testing

## 🏃 Running the Application

### Backend (Development mode with auto-reload)
```bash
cd backend
npm run dev
```

### Backend (Production mode)
```bash
cd backend
npm start
```

Backend server will start on: `http://localhost:3000`

### Frontend (Development mode)
```bash
cd frontend
npm run dev
```

Frontend will start on: `http://localhost:5173`

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Quick Start Endpoints

#### 1. Check API Health
```
GET /health
```

#### 2. Get API Documentation
```
GET /
```

#### 3. View Dashboard Analytics
```
GET /api/analytics/dashboard
```

#### 4. Import Data from CSV/Excel
```
POST /api/upload/import
Content-Type: multipart/form-data
Body: { file: your_file.csv }
```

### Complete API Reference

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for detailed documentation of all endpoints.

## 📊 Available Analytics Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analytics/dashboard` | GET | Overall dashboard analytics |
| `/api/analytics/categories` | GET | All categories with stats |
| `/api/analytics/categories/ratings` | GET | Category-wise ratings |
| `/api/analytics/products` | GET | Products with filters |
| `/api/analytics/products/top-worst` | GET | Top & worst products |
| `/api/analytics/products/:id/performance` | GET | Product details |
| `/api/analytics/reviews` | GET | Reviews with filters |
| `/api/analytics/reviews/trends` | GET | Review trends over time |
| `/api/analytics/reviews/engagement` | GET | Engagement metrics |

## 📁 Project Structure

```
dyne infotech assignment/
├── src/
│   ├── config/
│   │   └── database.js          # Database connection
│   ├── controllers/
│   │   ├── analyticsController.js  # Analytics logic
│   │   └── uploadController.js     # File upload logic
│   ├── middleware/
│   │   ├── errorHandler.js      # Error handling
│   │   └── validation.js        # Input validation
│   ├── models/
│   │   ├── schema.js            # Database schema
│   │   └── setup.js             # Database setup script
│   ├── routes/
│   │   ├── analyticsRoutes.js   # Analytics routes
│   │   └── uploadRoutes.js      # Upload routes
│   └── index.js                 # Main server file
├── uploads/                     # Temporary file storage
├── .env                         # Environment variables
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies
├── sample_import.csv            # Sample CSV for testing
├── API_DOCUMENTATION.md         # Complete API docs
└── readme.md                    # This file
```

## 🧪 Testing the API

### Using the Sample CSV
A sample CSV file is provided in `sample_import.csv`. You can use it to test the import functionality:

```bash
# Using curl
curl -X POST http://localhost:3000/api/upload/import \
  -F "file=@sample_import.csv"
```

### Using Thunder Client (VS Code Extension)
1. Install Thunder Client extension
2. Create a new request
3. Method: POST
4. URL: `http://localhost:3000/api/upload/import`
5. Body: Form data, add field `file`, type File, select CSV

### Using Postman
1. Create POST request to `http://localhost:3000/api/upload/import`
2. Select Body → form-data
3. Add key `file`, change type to File
4. Upload your CSV/Excel file

## 📊 Database Schema

### Categories
- `id` - Unique identifier
- `name` - Category name (unique)
- `description` - Category description
- `created_at` - Timestamp

### Products
- `id` - Unique identifier
- `name` - Product name
- `description` - Product description
- `price` - Product price
- `category_id` - Foreign key to categories
- `created_at` - Timestamp

### Reviews
- `id` - Unique identifier
- `product_id` - Foreign key to products
- `customer_name` - Reviewer name
- `rating` - Rating (1-5 stars)
- `review_text` - Review content
- `created_at` - Timestamp

## 🎯 Key Features Implemented

### 1. Data Import
- Support for CSV and Excel files
- Automatic duplicate handling
- Data validation before import
- Transaction-based import (all or nothing)

### 2. Analytics
- Real-time dashboard metrics
- Category-wise analysis
- Product performance tracking
- Review trends and patterns
- Engagement metrics

### 3. Filtering & Search
- Filter products by category, rating, price
- Search in product names and descriptions
- Sort by multiple fields
- Flexible query parameters

### 4. Error Handling
- Comprehensive error messages
- Validation for all inputs
- Database transaction rollback on errors
- Graceful error responses

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **File Processing**: 
  - multer (file uploads)
  - csv-parser (CSV parsing)
  - xlsx (Excel parsing)
- **Environment**: dotenv
- **CORS**: cors middleware

## 📝 Scripts

```bash
npm start        # Start production server
npm run dev      # Start development server with auto-reload
npm run setup:db # Setup database tables and sample data
```

## 🤝 Contributing

This is an assignment project. For any questions or improvements, please reach out.

## 📄 License

ISC

## 👨‍💻 Author

Nishant Trivedi

---

**Built with ❤️ using Node.js, Express, and PostgreSQL**