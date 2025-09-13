import { 
  Typography, 
  Box, 
  Grid, 
  Button, 
  Container 
} from '@mui/material';
import scooter1Img from '../assets/images/scooter1.jpg';

// Flexibility Section
export const Flexibility = () => (
  <Box sx={{ py: 8, bgcolor: '#fff' }}>
    <Container maxWidth="lg">
      <Grid container spacing={6} alignItems="center">
        <Grid item xs={12} md={6}>
          <Box sx={{ textAlign: 'center' }}>
            <img 
              src={scooter1Img} 
              alt="Couple riding scooter" 
              style={{ width: '100%', height: 'auto', borderRadius: '12px' }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 4, color: '#333' }}>
            Flexibility, Agility & Freedom
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, color: '#666' }}>
            Get Free Helmets
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: '#666', lineHeight: 1.8 }}>
            Experience the freedom of urban mobility with our flexible rental options. 
            All rentals include free helmets for your safety and peace of mind.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button 
              variant="outlined" 
              sx={{ 
                borderColor: '#ff6200', 
                color: '#ff6200',
                px: 3,
                py: 1.5,
                '&:hover': { borderColor: '#e55a00', color: '#e55a00' }
              }}
            >
              Scooter
            </Button>
            <Button 
              variant="outlined" 
              sx={{ 
                borderColor: '#ff6200', 
                color: '#ff6200',
                px: 3,
                py: 1.5,
                '&:hover': { borderColor: '#e55a00', color: '#e55a00' }
              }}
            >
              Bike
            </Button>
            <Button 
              variant="outlined" 
              sx={{ 
                borderColor: '#ff6200', 
                color: '#ff6200',
                px: 3,
                py: 1.5,
                '&:hover': { borderColor: '#e55a00', color: '#e55a00' }
              }}
            >
              E-Bike
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  </Box>
);
