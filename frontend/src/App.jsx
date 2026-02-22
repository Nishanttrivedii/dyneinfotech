import { useState } from 'react';
import { Box, Container, AppBar, Toolbar, Typography, Tabs, Tab } from '@mui/material';
import { Dashboard, Upload, TableView } from '@mui/icons-material';
import DashboardView from './components/DashboardView';
import ProductsTable from './components/ProductsTable';
import FileUpload from './components/FileUpload';

function App() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Dashboard sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Product Analytics Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="dashboard tabs">
            <Tab icon={<Dashboard />} label="Dashboard" />
            <Tab icon={<TableView />} label="Products & Reviews" />
            <Tab icon={<Upload />} label="Import Data" />
          </Tabs>
        </Box>

        <Box>
          {currentTab === 0 && <DashboardView />}
          {currentTab === 1 && <ProductsTable />}
          {currentTab === 2 && <FileUpload />}
        </Box>
      </Container>
    </Box>
  );
}

export default App;
