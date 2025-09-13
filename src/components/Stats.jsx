import { 
  Typography, 
  Box, 
  Grid, 
  Container 
} from '@mui/material';
import galleryImg from '../assets/images/gallery1.jpg';
import { statistics } from '../data.jsx';

// Stats Section
export const Stats = () => (
  <Box sx={{ 
    py: 8, 
    backgroundImage: `url(${galleryImg})`,
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
      backgroundColor: 'rgba(0,0,0,0.8)',
      zIndex: 1
    }
  }}>
    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
      <Grid container spacing={6} justifyContent="center">
        {statistics.map((stat, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" sx={{ 
                fontWeight: 'bold', 
                color: 'white', 
                mb: 1,
                fontSize: { xs: '2rem', md: '3rem' }
              }}>
                {stat.number}
              </Typography>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                {stat.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);
