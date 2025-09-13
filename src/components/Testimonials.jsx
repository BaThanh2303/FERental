import { 
  Typography, 
  Box, 
  Grid, 
  Container, 
  Card,
  CardContent,
  Avatar
} from '@mui/material';
import { testimonialsData } from '../data.jsx';

// Testimonials Section
export const Testimonials = () => (
  <Box sx={{ 
    py: 8, 
    backgroundImage: 'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      zIndex: 1
    }
  }}>
    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="overline" sx={{ 
          color: '#ff0000', 
          fontWeight: 'bold',
          fontSize: '1rem',
          mb: 2,
          display: 'block'
        }}>
          TESTIMONIALS
        </Typography>
        <Typography variant="h3" sx={{ 
          fontWeight: 'bold', 
          mb: 4, 
          color: 'white',
          fontSize: { xs: '2rem', md: '2.5rem' }
        }}>
          WHAT CLIENTS SAY ABOUT US
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        {testimonialsData.map((testimonial) => (
          <Grid item xs={12} md={6} key={testimonial.id}>
            <Card sx={{ 
              p: 4, 
              bgcolor: 'rgba(255,255,255,0.1)', 
              color: 'white',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              position: 'relative'
            }}>
              <Box sx={{
                position: 'absolute',
                top: 20,
                right: 20,
                fontSize: '4rem',
                color: '#ff0000',
                opacity: 0.3
              }}>
                "
              </Box>
              <CardContent sx={{ p: 0 }}>
                <Typography variant="body1" sx={{ 
                  mb: 4, 
                  fontStyle: 'italic',
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  position: 'relative',
                  zIndex: 2
                }}>
                  {testimonial.text}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar 
                    src={testimonial.image} 
                    sx={{ width: 60, height: 60 }}
                  />
                  <Box>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 'bold',
                      color: 'white'
                    }}>
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#ccc'
                    }}>
                      {testimonial.role}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);
