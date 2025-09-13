import { 
  Typography, 
  Box, 
  Grid, 
  Button, 
  Container 
} from '@mui/material';
import scooter1Img from '../assets/images/scooter1.jpg';

// Rent Experience Section
export const RentExperience = () => (
  <Box sx={{ py: 8, bgcolor: '#e8f5e8' }}>
    <Container maxWidth="lg">
      <Grid container spacing={6} alignItems="center">
        <Grid item xs={12} md={6}>
          <Box sx={{ textAlign: 'center' }}>
            <img 
              src={scooter1Img} 
              alt="Mobile app interface" 
              style={{ width: '100%', height: 'auto', borderRadius: '12px' }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 4, color: '#333' }}>
            Rent Faster, Better Experience
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: '#ff6200',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  1
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Easy to Use App
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: '#ff6200',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  2
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Secure Payment and Data
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: '#ff6200',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  3
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Wide GPS Support
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              sx={{ 
                bgcolor: '#333', 
                color: 'white',
                px: 3,
                py: 1.5,
                '&:hover': { bgcolor: '#555' }
              }}
            >
              Google Play
            </Button>
            <Button 
              variant="contained" 
              sx={{ 
                bgcolor: '#333', 
                color: 'white',
                px: 3,
                py: 1.5,
                '&:hover': { bgcolor: '#555' }
              }}
            >
              Apple Store
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  </Box>
);
