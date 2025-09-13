import { 
  Typography, 
  Box, 
  Grid, 
  Button, 
  Container 
} from '@mui/material';

// CTA Section
export const CTA = () => (
  <Box sx={{ py: 6, bgcolor: '#ff6200', color: '#fff' }}>
    <Container maxWidth="lg">
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={8}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            Call us today to book your scooter or bike
          </Typography>
        </Grid>
        <Grid item xs={12} md={2}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            7-234-567-8901
          </Typography>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button 
            fullWidth
            variant="contained" 
            sx={{ 
              bgcolor: 'white', 
              color: '#ff6200',
              py: 2,
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#f5f5f5' }
            }}
          >
            Book Now
          </Button>
        </Grid>
      </Grid>
    </Container>
  </Box>
);
