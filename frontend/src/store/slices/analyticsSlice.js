import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Async thunks
export const fetchDashboard = createAsyncThunk(
  'analytics/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/analytics/dashboard`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch dashboard');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'analytics/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/analytics/categories`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch categories');
    }
  }
);

export const fetchCategoryRatings = createAsyncThunk(
  'analytics/fetchCategoryRatings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/analytics/categories/ratings`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch category ratings');
    }
  }
);

export const fetchReviewTrends = createAsyncThunk(
  'analytics/fetchReviewTrends',
  async ({ period = 'daily', days = 30 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/analytics/reviews/trends?period=${period}&days=${days}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch trends');
    }
  }
);

export const fetchTopWorstProducts = createAsyncThunk(
  'analytics/fetchTopWorstProducts',
  async (limit = 5, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/analytics/products/top-worst?limit=${limit}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch products');
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    dashboard: null,
    categories: [],
    categoryRatings: [],
    reviewTrends: [],
    topWorstProducts: { topProducts: [], worstProducts: [] },
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Category Ratings
      .addCase(fetchCategoryRatings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategoryRatings.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryRatings = action.payload;
      })
      .addCase(fetchCategoryRatings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Review Trends
      .addCase(fetchReviewTrends.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReviewTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.reviewTrends = action.payload;
      })
      .addCase(fetchReviewTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Top/Worst Products
      .addCase(fetchTopWorstProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTopWorstProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.topWorstProducts = action.payload;
      })
      .addCase(fetchTopWorstProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = analyticsSlice.actions;
export default analyticsSlice.reducer;
