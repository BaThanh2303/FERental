import { 
  Typography, 
  Box, 
  Grid, 
  Container 
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import galleryImg from '../assets/images/gallery1.jpg';
import { features } from '../data.jsx';

// Company Section
export const CompanySection = () => (
  <Box sx={{ py: 8, bgcolor: '#fff' }}>
    <Container maxWidth="lg">
      <Grid container spacing={6} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3, color: '#333' }}>
            Renroll - The company
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, color: '#666' }}>
            The company to offer the best scooter & bike rental services.
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: '#666', lineHeight: 1.8 }}>
            We provide high-quality scooters and bikes for rent with excellent customer service. 
            Our mission is to make urban mobility accessible, affordable, and enjoyable for everyone.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <img 
                src={galleryImg} 
                alt="Couple on scooter" 
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
              />
            </Grid>
            <Grid item xs={6}>
              <img 
                src={galleryImg} 
                alt="Woman with helmet" 
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
              />
            </Grid>
            <Grid item xs={12}>
              <img 
                src={galleryImg} 
                alt="Woman riding scooter" 
                style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center', color: '#333' }}>
          Renting Service Features
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CheckCircle sx={{ color: '#00a650', fontSize: 24 }} />
                <Typography variant="body1">{feature}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  </Box>
);
