import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Chip,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Collapse,
  Rating,
  Divider,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp, Star } from '@mui/icons-material';
import { fetchProducts, fetchReviews } from '../store/slices/productsSlice';
import { fetchCategories } from '../store/slices/analyticsSlice';

function ProductRow({ product, categories }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { reviews, reviewsLoading } = useSelector((state) => state.products);

  const handleToggle = () => {
    if (!open && (!reviews[product.id] || reviews[product.id].length === 0)) {
      dispatch(fetchReviews(product.id));
    }
    setOpen(!open);
  };

  const productReviews = reviews[product.id] || [];

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton size="small" onClick={handleToggle}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {product.name}
        </TableCell>
        <TableCell>{product.category_name}</TableCell>
        <TableCell align="right">${parseFloat(product.price).toFixed(2)}</TableCell>
        <TableCell align="right">
          {product.discount_percentage ? `${product.discount_percentage}%` : 'N/A'}
        </TableCell>
        <TableCell align="center">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
            <Star sx={{ fontSize: 16, color: 'warning.main' }} />
            {product.average_rating || 'N/A'}
          </Box>
        </TableCell>
        <TableCell align="center">{product.review_count || 0}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="h6" gutterBottom component="div">
                Reviews
              </Typography>
              {reviewsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : productReviews.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No reviews available for this product.
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {productReviews.map((review) => (
                    <Paper key={review.id} elevation={1} sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Rating value={review.rating} readOnly size="small" />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(review.review_date).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Typography variant="body2">{review.review_text}</Typography>
                    </Paper>
                  ))}
                </Box>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function ProductsTable() {
  const dispatch = useDispatch();
  const { products, loading, error, totalCount } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.analytics);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minRating: '',
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const params = {
      page: page + 1,
      limit: rowsPerPage,
      ...filters,
    };
    dispatch(fetchProducts(params));
  }, [dispatch, page, rowsPerPage, filters]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(0);
  };

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      {/* Filters */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Search Products"
              variant="outlined"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Enter product name..."
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                label="Category"
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories?.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.category_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Minimum Rating</InputLabel>
              <Select
                value={filters.minRating}
                label="Minimum Rating"
                onChange={(e) => handleFilterChange('minRating', e.target.value)}
              >
                <MenuItem value="">All Ratings</MenuItem>
                <MenuItem value="4">4+ Stars</MenuItem>
                <MenuItem value="3">3+ Stars</MenuItem>
                <MenuItem value="2">2+ Stars</MenuItem>
                <MenuItem value="1">1+ Stars</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Summary */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {products.length} of {totalCount} products
        </Typography>
      </Box>

      {/* Products Table */}
      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell width={50} />
                <TableCell>
                  <strong>Product Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Category</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Price</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Discount</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Rating</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Reviews</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                    <Typography variant="body2" color="text.secondary">
                      No products found. Try adjusting your filters.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <ProductRow key={product.id} product={product} categories={categories} />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

export default ProductsTable;
