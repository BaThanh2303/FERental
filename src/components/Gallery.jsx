import { 
  Typography, 
  Box, 
  Grid, 
  Container 
} from '@mui/material';
import galleryImg from '../assets/images/gallery1.jpg';

// Gallery Section
export const Gallery = () => (
  <Box sx={{ py: 8, bgcolor: '#fff' }}>
    <Container maxWidth="lg">
      <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 6, textAlign: 'center', color: '#333' }}>
        Share your experience
      </Typography>
      <Grid container spacing={2}>
        {[...Array(8)].map((_, i) => (
          <Grid item xs={6} sm={4} md={3} key={i}>
            <img 
              src={galleryImg} 
              alt={`gallery-${i}`} 
              style={{ 
                width: '100%', 
                height: '200px', 
                objectFit: 'cover', 
                borderRadius: '8px' 
              }} 
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);
