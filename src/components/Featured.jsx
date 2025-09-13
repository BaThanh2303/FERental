import { 
  Typography, 
  Box, 
  Grid, 
  Container 
} from '@mui/material';
import scooter1Img from '../assets/images/scooter1.jpg';

// Featured Section
export const Featured = () => (
  <Box sx={{ py: 8, bgcolor: '#fff' }}>
    <Container maxWidth="lg">
      <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 6, textAlign: 'center', color: '#333' }}>
        Featured Electric Scooter
      </Typography>
      <Grid container spacing={6} alignItems="center">
        <Grid item xs={12} md={6}>
          <img 
            src={scooter1Img} 
            alt="Featured Electric Scooter" 
            style={{ width: '100%', height: 'auto', borderRadius: '12px' }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, color: '#333' }}>
            Ninebot 300 Series Electric Bike
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: '#666', lineHeight: 1.8 }}>
            The Ninebot 300 Series Electric Bike is a powerful and stylish electric scooter 
            that is perfect for commuting or cruising around town. With its advanced battery 
            technology and sleek design, it offers an eco-friendly and efficient way to travel.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            {[...Array(3)].map((_, i) => (
              <Box 
                key={i}
                sx={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: '50%', 
                  bgcolor: i === 0 ? '#ff6200' : '#e0e0e0' 
                }} 
              />
            ))}
          </Box>
        </Grid>
      </Grid>
    </Container>
  </Box>
);
