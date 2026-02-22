import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import {
  Star,
  Category,
  Inventory,
  RateReview,
} from '@mui/icons-material';
import {
  fetchDashboard,
  fetchCategories,
  fetchCategoryRatings,
  fetchTopWorstProducts,
} from '../store/slices/analyticsSlice';
import ProductsByCategoryChart from './charts/ProductsByCategoryChart';
import TopReviewedProductsChart from './charts/TopReviewedProductsChart';
import CategoryRatingsChart from './charts/CategoryRatingsChart';
import RatingDistributionChart from './charts/RatingDistributionChart';

function DashboardView() {
  const dispatch = useDispatch();
  const { dashboard, categoryRatings, topWorstProducts, loading, error } = useSelector(
    (state) => state.analytics
  );

  useEffect(() => {
    dispatch(fetchDashboard());
    dispatch(fetchCategories());
    dispatch(fetchCategoryRatings());
    dispatch(fetchTopWorstProducts(10));
  }, [dispatch]);

  if (loading && !dashboard) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const { summary, ratingDistribution, topRatedProducts } = dashboard || {};

  return (
    <Box>
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ height: '100%', bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {summary?.total_categories || 0}
                  </Typography>
                  <Typography variant="body2">Categories</Typography>
                </Box>
                <Category sx={{ fontSize: 48, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ height: '100%', bgcolor: 'success.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {summary?.total_products || 0}
                  </Typography>
                  <Typography variant="body2">Products</Typography>
                </Box>
                <Inventory sx={{ fontSize: 48, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ height: '100%', bgcolor: 'warning.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {summary?.total_reviews || 0}
                  </Typography>
                  <Typography variant="body2">Reviews</Typography>
                </Box>
                <RateReview sx={{ fontSize: 48, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ height: '100%', bgcolor: 'secondary.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {summary?.average_rating || 0} <Star sx={{ fontSize: 24, mb: -0.5 }} />
                  </Typography>
                  <Typography variant="body2">Average Rating</Typography>
                </Box>
                <Star sx={{ fontSize: 48, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Products by Category
            </Typography>
            <ProductsByCategoryChart categories={categoryRatings || []} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Top Reviewed Products
            </Typography>
            <TopReviewedProductsChart products={topRatedProducts || []} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Rating Distribution
            </Typography>
            <RatingDistributionChart distribution={ratingDistribution || []} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Category-wise Average Rating
            </Typography>
            <CategoryRatingsChart categoryRatings={categoryRatings || []} />
          </Paper>
        </Grid>

        {/* Top Rated Products Table */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Top Rated Products
            </Typography>
            <Box sx={{ overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
                      Product
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
                      Category
                    </th>
                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #ddd' }}>
                      Price
                    </th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>
                      Rating
                    </th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>
                      Reviews
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topRatedProducts?.slice(0, 10).map((product, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px' }}>{product.name}</td>
                      <td style={{ padding: '12px' }}>{product.category}</td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        ${parseFloat(product.price).toFixed(2)}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5 }}>
                          <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                          {product.average_rating}
                        </Box>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>{product.review_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashboardView;
