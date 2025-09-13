import { 
  Typography, 
  Box, 
  Grid, 
  Button, 
  Container 
} from '@mui/material';

// Final CTA Section
export const FinalCTA = () => (
  <Box sx={{ py: 6, bgcolor: '#00a650', color: '#fff' }}>
    <Container maxWidth="lg">
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={8}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            Are you looking for an affordable Bikes and Scooters Rental Service?
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Button 
            fullWidth
            variant="contained" 
            sx={{ 
              bgcolor: '#ff6200', 
              color: 'white',
              py: 2,
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#e55a00' }
            }}
          >
            Book Now
          </Button>
        </Grid>
      </Grid>
    </Container>
  </Box>
);
