import { 
  Typography, 
  Box, 
  Grid, 
  Container 
} from '@mui/material';
import scooter1Img from '../assets/images/scooter1.jpg';
import { whyChooseUs } from '../data.jsx';

// Why Choose Section
export const WhyChoose = () => (
  <Box sx={{ py: 8, bgcolor: '#f8f9fa' }}>
    <Container maxWidth="lg">
      <Grid container spacing={6} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 4, color: '#333' }}>
            Why Choose Renroll
          </Typography>
          <Grid container spacing={3}>
            {whyChooseUs.map((reason, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'white', 
                  borderRadius: 2, 
                  boxShadow: 1,
                  textAlign: 'center'
                }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {reason}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ textAlign: 'center' }}>
            <img 
              src={scooter1Img} 
              alt="Woman riding vintage scooter" 
              style={{ width: '100%', height: 'auto', borderRadius: '12px' }}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  </Box>
);
