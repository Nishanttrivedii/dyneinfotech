# Product Analytics Dashboard - Frontend

React-based frontend for the Product Analytics Dashboard built with Material-UI, Redux Toolkit, and Recharts.

## Tech Stack

- **React 18.2.0** - UI library
- **Vite 5.0.8** - Build tool and dev server
- **Material-UI 5.15.0** - Component library
- **Redux Toolkit 2.0.1** - State management
- **Recharts 2.10.3** - Chart library
- **Axios 1.6.2** - HTTP client
- **react-dropzone** - File upload component

## Prerequisites

- Node.js v18 or higher
- npm or yarn
- Backend API running on http://localhost:3000

## Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

## Development

```bash
# Start development server (runs on http://localhost:5173)
npm run dev
```

The development server includes:
- Hot Module Replacement (HMR)
- Automatic proxy to backend API at http://localhost:3000/api
- Fast refresh for React components

## Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── charts/
│   │   │   ├── ProductsByCategoryChart.jsx
│   │   │   ├── TopReviewedProductsChart.jsx
│   │   │   ├── CategoryRatingsChart.jsx
│   │   │   └── RatingDistributionChart.jsx
│   │   ├── DashboardView.jsx
│   │   ├── ProductsTable.jsx
│   │   └── FileUpload.jsx
│   ├── store/
│   │   ├── slices/
│   │   │   ├── analyticsSlice.js
│   │   │   ├── uploadSlice.js
│   │   │   └── productsSlice.js
│   │   └── store.js
│   ├── App.jsx
│   ├── main.jsx
│   ├── theme.js
│   └── index.css
├── index.html
├── vite.config.js
└── package.json
```

## Features

### Dashboard Tab
- Summary cards showing:
  - Total categories
  - Total products
  - Total reviews
  - Average rating
- Four interactive charts:
  - Products by Category (Bar Chart)
  - Top Reviewed Products (Bar Chart)
  - Rating Distribution (Histogram)
  - Category-wise Average Rating (Bar Chart)
- Top Rated Products table

### Products & Reviews Tab
- Products table with expandable rows to view reviews
- Filters:
  - Search by product name
  - Filter by category
  - Filter by minimum rating
- Pagination (5, 10, 25, 50 items per page)
- Review display with star ratings and dates

### Import Data Tab
- Drag-and-drop file upload
- Support for CSV, XLS, and XLSX files
- Upload progress indicator
- Success/error messages
- Template download functionality

## API Integration

The frontend communicates with the backend API through Redux Toolkit's `createAsyncThunk`. All API calls are proxied through Vite's dev server:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api

API endpoints used:
- `GET /api/analytics/dashboard` - Dashboard summary
- `GET /api/analytics/categories` - Categories list
- `GET /api/analytics/categories/ratings` - Category ratings
- `GET /api/analytics/products/top-worst` - Top/worst products
- `GET /api/analytics/products` - Products with filters
- `GET /api/analytics/products/:id/reviews` - Product reviews
- `POST /api/upload` - File upload
- `GET /api/upload/template` - Download template

## State Management

Redux slices:
- **analyticsSlice** - Dashboard data, categories, ratings, trends
- **productsSlice** - Products list, reviews, filters
- **uploadSlice** - File upload status, template

## Customization

### Theme
Edit `src/theme.js` to customize colors and styles:
```javascript
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    // ... more options
  },
});
```

### API URL
If backend is on a different port, update `vite.config.js`:
```javascript
server: {
  proxy: {
    '/api': 'http://localhost:YOUR_PORT'
  }
}
```

## Troubleshooting

### Backend Connection Issues
- Ensure backend server is running on port 3000
- Check CORS configuration in backend
- Verify proxy configuration in vite.config.js

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Clear Vite cache
npm run build -- --force
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
