import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box } from '@mui/material';

function ProductsByCategoryChart({ categories }) {
  const data = categories.map(cat => ({
    name: cat.category_name,
    products: parseInt(cat.product_count),
  }));

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="products" fill="#1976d2" name="Number of Products" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default ProductsByCategoryChart;
