import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box } from '@mui/material';

function RatingDistributionChart({ distribution }) {
  const data = distribution.map(item => ({
    rating: `${item.rating} ⭐`,
    count: parseInt(item.count),
  }));

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="rating" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#9c27b0" name="Number of Reviews" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default RatingDistributionChart;
