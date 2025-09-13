import { useState } from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Button, 
  Container, 
  Card,
  CardContent,
  CardMedia,
  Tabs,
  Tab
} from '@mui/material';
import scooter1Img from '../assets/images/scooter1.jpg';
import { fleetData } from '../data.jsx';

// Fleet Section
export const Fleet = () => {
  const [tabValue, setTabValue] = useState(0);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ py: 8, bgcolor: '#f8f9fa' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center', color: '#333' }}>
          Our Renting Fleet
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Scooter" />
            <Tab label="Bike" />
            <Tab label="E-Bike" />
          </Tabs>
        </Box>

        <Grid container spacing={4}>
          {fleetData.filter(vehicle => {
            if (tabValue === 0) return vehicle.type === 'Scooter';
            if (tabValue === 1) return vehicle.type === 'Bike';
            if (tabValue === 2) return vehicle.type === 'E-Bike';
            return true;
          }).map((vehicle) => (
            <Grid item xs={12} md={6} key={vehicle.id}>
              <Card sx={{ height: '100%', boxShadow: 3 }}>
                <CardMedia
                  component="img"
                  height="250"
                  image={scooter1Img}
                  alt={vehicle.name}
                />
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {vehicle.name}
                  </Typography>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Engine: {vehicle.engine}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Fuel Tank: {vehicle.fuelTank}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Max Speed: {vehicle.maxSpeed}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Weight: {vehicle.weight}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Button 
                    fullWidth
                    variant="contained" 
                    sx={{ 
                      bgcolor: '#ff6200', 
                      color: 'white',
                      py: 1.5,
                      '&:hover': { bgcolor: '#e55a00' }
                    }}
                  >
                    Book now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
