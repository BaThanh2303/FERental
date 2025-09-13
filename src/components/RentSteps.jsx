import { 
  Typography, 
  Box, 
  Grid, 
  Button, 
  Container, 
  Card,
  CardContent
} from '@mui/material';
import scooter1Img from '../assets/images/scooter1.jpg';

// Rent Steps Section
export const RentSteps = () => (
  <Box sx={{ py: 8, bgcolor: '#f8f9fa' }}>
    <Container maxWidth="lg">
      <Grid container spacing={6} alignItems="center">
        <Grid item xs={12} md={6}>
          <Box sx={{ textAlign: 'center' }}>
            <img 
              src={scooter1Img} 
              alt="Person riding scooter" 
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 4, color: '#333' }}>
            It's Really Easier To Rent
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ p: 2, textAlign: 'center', border: '2px solid #e0e0e0' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Choose your bike or scooter
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Select from our wide range of well-maintained vehicles
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card sx={{ p: 2, textAlign: 'center', border: '2px solid #e0e0e0' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Choose your bike or scooter
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pick your preferred location and time
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card sx={{ p: 2, textAlign: 'center', border: '2px solid #e0e0e0' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Ride ready to go
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start your adventure with our easy-to-use vehicles
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button 
              variant="contained" 
              sx={{ 
                bgcolor: '#ff6200', 
                color: 'white',
                px: 4,
                py: 2,
                '&:hover': { bgcolor: '#e55a00' }
              }}
            >
              See Our Fleet
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  </Box>
);
