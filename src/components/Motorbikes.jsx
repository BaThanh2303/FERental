import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Box, 
  Grid, 
  Button, 
  Container, 
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Visibility,
  Share,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  DirectionsCar
} from '@mui/icons-material';
import { getAllVehicles } from '../api.jsx';

// Motorbikes Section with Horizontal Slider
export const Motorbikes = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const scrollContainerRef = useRef(null);
  
  // Load vehicles from API
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setLoading(true);
        const vehiclesData = await getAllVehicles();
        setVehicles(vehiclesData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadVehicles();
  }, []);

  const nextSlide = () => {
    const newIndex = (currentIndex + 1) % vehicles.length;
    setCurrentIndex(newIndex);
    scrollToSlide(newIndex);
  };
  
  const prevSlide = () => {
    const newIndex = (currentIndex - 1 + vehicles.length) % vehicles.length;
    setCurrentIndex(newIndex);
    scrollToSlide(newIndex);
  };

  const scrollToSlide = (index) => {
    if (scrollContainerRef.current) {
      const cardWidth = 350; // Fixed card width
      const gap = 24; // Gap between cards (3 * 8px = 24px)
      const scrollPosition = index * (cardWidth + gap);
      
      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleRentNow = (vehicle) => {
    // Prepare vehicle data for checkout
    const vehicleData = {
      id: vehicle.vehicleId,
      name: `${vehicle.type} ${vehicle.code}`,
      make: vehicle.type,
      model: vehicle.code,
      year: new Date().getFullYear(),
      image: vehicle.imageUrl,
      imageUrl: vehicle.imageUrl,
      licensePlate: vehicle.licensePlate,
      stationName: vehicle.station?.name || 'Unknown Station',
      batteryLevel: vehicle.batteryLevel,
      status: vehicle.status
    };

    // Navigate to checkout page with vehicle data
    navigate('/checkout', { state: { vehicle: vehicleData } });
  };

  return (
    <Box sx={{ py: 8, bgcolor: '#000000' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="overline" sx={{ 
            color: '#ff0000', 
            fontWeight: 'bold',
            fontSize: '1rem',
            mb: 2,
            display: 'block',
            fontFamily: 'Consolas, monospace'
          }}>
            ELECTRIC BIKES
          </Typography>
          <Typography variant="h3" sx={{ 
            fontWeight: 'bold', 
            mb: 4, 
            color: 'white',
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontFamily: 'Consolas, monospace'
          }}>
            PREMIUM ELECTRIC MOTORBIKES
          </Typography>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#ff0000' }} />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 4, bgcolor: 'rgba(244,67,54,0.1)', color: '#f44336' }}>
            {error}
          </Alert>
        )}

        {/* No Vehicles State */}
        {!loading && !error && vehicles.length === 0 && (
          <Alert severity="info" sx={{ mb: 4, bgcolor: 'rgba(33,150,243,0.1)', color: '#2196f3' }}>
            Không có xe nào khả dụng tại thời điểm này.
          </Alert>
        )}

        {/* Navigation Dots */}
        {!loading && !error && vehicles.length > 0 && (
          <Box sx={{display: 'flex', justifyContent: 'center', mb: 4, gap: 1 }}>
            {vehicles.map((_, index) => (
              <Box
                key={index}
                onClick={() => scrollToSlide(index)}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: index === currentIndex ? '#ff0000' : '#333',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': { bgcolor: index === currentIndex ? '#ff0000' : '#666' }
                }}
              />
            ))}
          </Box>
        )}

        {/* Slider Container */}
        <Box sx={{ position: 'relative' }}>
          {/* Navigation Buttons */}
          <IconButton
            onClick={prevSlide}
            sx={{
              position: 'absolute',
              left: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              bgcolor: '#ff0000',
              color: 'white',
              '&:hover': { bgcolor: '#cc0000' },
              display: { xs: 'none', md: 'flex' }
            }}
          >
            <ChevronLeft />
          </IconButton>

          <IconButton
            onClick={nextSlide}
            sx={{
              position: 'absolute',
              right: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              bgcolor: '#ff0000',
              color: 'white',
              '&:hover': { bgcolor: '#cc0000' },
              display: { xs: 'none', md: 'flex' }
            }}
          >
            <ChevronRight />
          </IconButton>

          {/* Cards Container */}
          {!loading && !error && vehicles.length > 0 && (
            <Box
              ref={scrollContainerRef}
              sx={{
                display: 'flex',
                gap: 3,
                overflowX: 'auto',
                scrollBehavior: 'smooth',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
                pb: 2
              }}
            >
              {vehicles.map((vehicle, index) => (
              <Card 
                key={vehicle.vehicleId}
                sx={{ 
                  minWidth: 350,
                  maxWidth: 350,
                  height: '3', 
                  bgcolor: '#111', 
                  border: index === currentIndex ? '2px solid #ff0000' : '1px solid #333',
                  '&:hover': { 
                    borderColor: '#ff0000',
                    transform: 'translateY(-5px)',
                    transition: 'all 0.3s ease'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="250"
                    image={vehicle.imageUrl}
                    alt={`${vehicle.type} ${vehicle.code}`}
                  />
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 16, 
                    right: 16,
                    display: 'flex',
                    gap: 1
                  }}>
                    <IconButton sx={{ 
                      bgcolor: 'rgba(0,0,0,0.7)', 
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.9)' }
                    }}>
                      <Visibility />
                    </IconButton>
                    <IconButton sx={{ 
                      bgcolor: 'rgba(0,0,0,0.7)', 
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.9)' }
                    }}>
                      <Share />
                    </IconButton>
                    <IconButton sx={{ 
                      bgcolor: 'rgba(0,0,0,0.7)', 
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.9)' }
                    }}>
                      <ShoppingCart />
                    </IconButton>
                  </Box>
                  <Chip 
                    label={vehicle.status} 
                    sx={{ 
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      bgcolor: vehicle.status === 'AVAILABLE' ? '#4caf50' : '#ff9800',
                      color: 'white',
                      fontWeight: 'bold',
                      fontFamily: 'Consolas, monospace'
                    }}
                  />
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    color: 'white',
                    fontFamily: 'Consolas, monospace'
                  }}>
                    {vehicle.type} {vehicle.code}
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: '#ccc', fontFamily: 'Consolas, monospace' }}>
                        Type: <span style={{ color: 'white' }}>{vehicle.type}</span>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: '#ccc', fontFamily: 'Consolas, monospace' }}>
                        Code: <span style={{ color: 'white' }}>{vehicle.code}</span>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: '#ccc', fontFamily: 'Consolas, monospace' }}>
                        License: <span style={{ color: 'white' }}>{vehicle.licensePlate}</span>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: '#ccc', fontFamily: 'Consolas, monospace' }}>
                        Battery: <span style={{ color: 'white' }}>{vehicle.batteryLevel}%</span>
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" sx={{ color: '#ccc', fontFamily: 'Consolas, monospace' }}>
                        Station: <span style={{ color: 'white' }}>{vehicle.station?.name || 'Unknown'}</span>
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* Battery Level Indicator */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ color: '#ccc', mb: 1, fontFamily: 'Consolas, monospace' }}>
                      Battery Level:
                    </Typography>
                    <Box sx={{ 
                      width: '100%', 
                      height: 8, 
                      bgcolor: '#333', 
                      borderRadius: 4,
                      overflow: 'hidden'
                    }}>
                      <Box sx={{ 
                        width: `${vehicle.batteryLevel}%`, 
                        height: '100%', 
                        bgcolor: vehicle.batteryLevel > 50 ? '#4caf50' : vehicle.batteryLevel > 20 ? '#ff9800' : '#f44336',
                        transition: 'width 0.3s ease'
                      }} />
                    </Box>
                  </Box>
                  
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold', 
                    mb: 3,
                    color: '#ff0000',
                    textAlign: 'center',
                    fontFamily: 'Consolas, monospace'
                  }}>
                    Available for Rent
                  </Typography>
                  
                  <Button 
                    fullWidth
                    variant="contained" 
                    onClick={() => handleRentNow(vehicle)}
                    startIcon={<DirectionsCar />}
                    disabled={vehicle.status !== 'AVAILABLE'}
                    sx={{ 
                      bgcolor: vehicle.status === 'AVAILABLE' ? '#ff0000' : '#666', 
                      color: 'white',
                      py: 1.5,
                      fontWeight: 'bold',
                      textTransform: 'none',
                      fontFamily: 'Consolas, monospace',
                      '&:hover': { bgcolor: vehicle.status === 'AVAILABLE' ? '#cc0000' : '#666' }
                    }}
                  >
                    {vehicle.status === 'AVAILABLE' ? 'RENT NOW' : 'NOT AVAILABLE'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {/* Mobile Navigation */}
        {!loading && !error && vehicles.length > 0 && (
          <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mt: 4, gap: 2 }}>
            <Button
              variant="outlined"
              onClick={prevSlide}
              startIcon={<ChevronLeft />}
              sx={{
                borderColor: '#ff0000',
                color: '#ff0000',
                fontFamily: 'Consolas, monospace',
                '&:hover': { borderColor: '#cc0000', bgcolor: 'rgba(255,0,0,0.1)' }
              }}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              onClick={nextSlide}
              endIcon={<ChevronRight />}
              sx={{
                borderColor: '#ff0000',
                color: '#ff0000',
                fontFamily: 'Consolas, monospace',
                '&:hover': { borderColor: '#cc0000', bgcolor: 'rgba(255,0,0,0.1)' }
              }}
            >
              Next
            </Button>
          </Box>
        )}
        </Box>
      </Container>
    </Box>
  );
};
