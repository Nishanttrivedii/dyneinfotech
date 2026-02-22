import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import { CloudUpload, CheckCircle, Error as ErrorIcon, Info } from '@mui/icons-material';
import { uploadFile, clearUploadState, fetchTemplate } from '../store/slices/uploadSlice';
import { useEffect } from 'react';

function FileUpload() {
  const dispatch = useDispatch();
  const { uploading, uploadSuccess, uploadResult, template, error } = useSelector(
    (state) => state.upload
  );
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    dispatch(fetchTemplate());
  }, [dispatch]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      dispatch(clearUploadState());
    }
  }, [dispatch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    multiple: false,
  });

  const handleUpload = () => {
    if (selectedFile) {
      dispatch(uploadFile(selectedFile));
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    dispatch(clearUploadState());
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CloudUpload /> Import Products & Reviews Data
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Upload CSV or Excel files to import product and review data into the system.
        </Typography>

        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : 'grey.300',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            bgcolor: isDragActive ? 'action.hover' : 'background.paper',
            transition: 'all 0.3s',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'action.hover',
            },
          }}
        >
          <input {...getInputProps()} />
          <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          {isDragActive ? (
            <Typography>Drop the file here...</Typography>
          ) : (
            <Box>
              <Typography variant="h6" gutterBottom>
                Drag & drop a file here, or click to select
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Supported formats: CSV, XLS, XLSX (Max 5MB)
              </Typography>
            </Box>
          )}
        </Box>

        {selectedFile && (
          <Box sx={{ mt: 3 }}>
            <Chip
              label={`Selected: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(2)} KB)`}
              onDelete={handleClear}
              color="primary"
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload File'}
              </Button>
              <Button variant="outlined" onClick={handleClear} disabled={uploading}>
                Clear
              </Button>
            </Box>
          </Box>
        )}

        {uploadSuccess && uploadResult && (
          <Alert severity="success" icon={<CheckCircle />} sx={{ mt: 3 }}>
            <Typography variant="subtitle2">Data imported successfully!</Typography>
            <Typography variant="body2">
              • Categories added: {uploadResult.categoriesAdded}
              <br />
              • Products added: {uploadResult.productsAdded}
              <br />
              • Reviews added: {uploadResult.reviewsAdded}
              <br />• Total rows processed: {uploadResult.totalRows}
            </Typography>
          </Alert>
        )}

        {error && (
          <Alert severity="error" icon={<ErrorIcon />} sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}
      </Paper>

      {template && (
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Info /> File Template Information
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Required Columns:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {template.requiredColumns?.map((col) => (
                <Chip key={col} label={col} color="error" size="small" />
              ))}
            </Box>

            <Typography variant="subtitle2" gutterBottom>
              Optional Columns:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {template.optionalColumns?.map((col) => (
                <Chip key={col} label={col} color="default" size="small" />
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              Validation Rules:
            </Typography>
            <List dense>
              {Object.entries(template.validationRules || {}).map(([key, value]) => (
                <ListItem key={key}>
                  <ListItemText
                    primary={key}
                    secondary={value}
                    primaryTypographyProps={{ fontWeight: 'bold' }}
                  />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              Sample Data Format:
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mt: 1, bgcolor: 'grey.50', overflow: 'auto' }}>
              <pre style={{ margin: 0, fontSize: '12px' }}>
                {JSON.stringify(template.sampleData?.[0], null, 2)}
              </pre>
            </Paper>
          </Box>
        </Paper>
      )}
    </Box>
  );
}

export default FileUpload;
