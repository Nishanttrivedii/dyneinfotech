import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../config/constants';

const API_URL = `${API_BASE_URL}/api`;

export const uploadFile = createAsyncThunk(
  'upload/uploadFile',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_URL}/upload/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to upload file');
    }
  }
);

export const fetchTemplate = createAsyncThunk(
  'upload/fetchTemplate',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/upload/template`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch template');
    }
  }
);

const uploadSlice = createSlice({
  name: 'upload',
  initialState: {
    uploading: false,
    uploadSuccess: false,
    uploadResult: null,
    template: null,
    error: null,
  },
  reducers: {
    clearUploadState: (state) => {
      state.uploading = false;
      state.uploadSuccess = false;
      state.uploadResult = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFile.pending, (state) => {
        state.uploading = true;
        state.uploadSuccess = false;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.uploading = false;
        state.uploadSuccess = true;
        state.uploadResult = action.payload.data;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.uploading = false;
        state.uploadSuccess = false;
        state.error = action.payload;
      })
      .addCase(fetchTemplate.fulfilled, (state, action) => {
        state.template = action.payload;
      });
  },
});

export const { clearUploadState, clearError } = uploadSlice.actions;
export default uploadSlice.reducer;
