import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../config/constants';

const API_URL = `${API_BASE_URL}/api`;

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.minRating) params.append('minRating', filters.minRating);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.search) params.append('search', filters.search);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.order) params.append('order', filters.order);

      const response = await axios.get(`${API_URL}/analytics/products?${params}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch products');
    }
  }
);

export const fetchReviews = createAsyncThunk(
  'products/fetchReviews',
  async ({ productId, rating, limit = 50 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (productId) params.append('productId', productId);
      if (rating) params.append('rating', rating);
      if (limit) params.append('limit', limit);

      const response = await axios.get(`${API_URL}/analytics/reviews?${params}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch reviews');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    reviews: [],
    filters: {
      category: '',
      minRating: '',
      maxPrice: '',
      search: '',
      sortBy: 'name',
      order: 'ASC',
    },
    reviewFilters: {
      productId: '',
      rating: '',
      limit: 50,
    },
    loading: false,
    error: null,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setReviewFilters: (state, action) => {
      state.reviewFilters = { ...state.reviewFilters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: '',
        minRating: '',
        maxPrice: '',
        search: '',
        sortBy: 'name',
        order: 'ASC',
      };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, setReviewFilters, clearFilters, clearError } = productsSlice.actions;
export default productsSlice.reducer;
