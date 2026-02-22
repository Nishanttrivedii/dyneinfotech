import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box } from '@mui/material';

function CategoryRatingsChart({ categoryRatings }) {
  const data = categoryRatings.map(cat => ({
    name: cat.category_name,
    rating: parseFloat(cat.average_rating),
    reviews: parseInt(cat.review_count),
  }));

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
          <YAxis domain={[0, 5]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="rating" fill="#ff9800" name="Average Rating" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default CategoryRatingsChart;
