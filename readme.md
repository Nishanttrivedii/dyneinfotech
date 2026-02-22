Product Ratings & Review Analytics Dashboard

This is a backend project I built to analyze product ratings and customer reviews. It’s made using Node.js, Express, and PostgreSQL.

The main idea was to create APIs that can:

Store products, categories, and reviews

Import data from CSV/Excel

Show analytics like top products, rating trends, etc.

What This Project Does

REST APIs built using Express

PostgreSQL database with proper relationships

Import reviews using CSV or Excel

Dashboard analytics (overall stats, trends, category-wise ratings)

Filtering, sorting and searching for products & reviews

Proper validation and error handling

It’s mainly focused on backend logic and analytics.

Tech Stack

Node.js

Express.js

PostgreSQL

multer (for file upload)

csv-parser & xlsx (for reading files)

dotenv

cors

How to Run This Project
1. Clone the repo
git clone <your-repo-url>
cd dyne-infotech-assignment
2. Install dependencies

Backend:

cd backend
npm install

Frontend (if needed):

cd ../frontend
npm install
3. Setup environment variables

Create a .env file inside backend:

PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=product_reviews
DB_USER=postgres
DB_PASSWORD=your_password
4. Create Database

Open PostgreSQL and run:

CREATE DATABASE product_reviews;
5. Setup Tables
npm run setup:db

This will:

Create tables (categories, products, reviews)

Add sample data

Running the Server

Development:

npm run dev

Production:

npm start

Backend runs on:

http://localhost:3000
Important API Endpoints

Health check:

GET /health

Dashboard analytics:

GET /api/analytics/dashboard

Category-wise ratings:

GET /api/analytics/categories/ratings

Top & worst products:

GET /api/analytics/products/top-worst

Import CSV/Excel:

POST /api/upload/import
Database Structure (Simple Overview)
Categories

id

name

description

created_at

Products

id

name

description

price

category_id

Reviews

id

product_id

customer_name

rating (1–5)

review_text

created_at

Products belong to categories.
Reviews belong to products.

Features I Focused On

Clean schema design with foreign keys

Transaction-based import (if something fails, rollback happens)

Flexible filtering for products and reviews

Analytics like:

Average rating

Total reviews

Category performance

Review trends over time

Sample Testing

There is a sample_import.csv file included.

You can test import using curl:

curl -X POST http://localhost:3000/api/upload/import \
  -F "file=@sample_import.csv"

Or use Postman / Thunder Client.

Why I Built This

This was an assignment project to demonstrate:

Backend API design

Database relationships

Real-world analytics queries

File handling

Proper error handling

Main focus was backend logic and clean structure.

Author

Nishant Trivedi