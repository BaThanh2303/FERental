import { 
  Typography, 
  Box, 
  Grid, 
  Container 
} from '@mui/material';
import heroImg from '../assets/images/hero.jpg';
import { pricingIncludes } from '../data.jsx';

// Pricing Section
export const Pricing = () => (
  <Box sx={{ 
    py: 8, 
    backgroundImage: `url(${heroImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      zIndex: 1
    }
  }}>
    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
      <Typography variant="h3" sx={{ 
        fontWeight: 'bold', 
        mb: 6, 
        textAlign: 'center', 
        color: 'white' 
      }}>
        Our Pricing Includes
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {pricingIncludes.map((item, index) => (
          <Grid item xs={6} sm={4} md={2} key={index}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: '#ff6200',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: 'white',
                fontSize: '2rem'
              }}>
                {item.icon === 'helmet' && '🪖'}
                {item.icon === 'insurance' && '🛡️'}
                {item.icon === 'assistance' && '🆘'}
                {item.icon === 'kilometers' && '🛣️'}
                {item.icon === 'gps' && '📍'}
                {item.icon === 'support' && '📞'}
              </Box>
              <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
                {item.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);
