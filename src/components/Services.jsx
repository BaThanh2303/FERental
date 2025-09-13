import { 
  Typography, 
  Box, 
  Grid, 
  Button, 
  Container, 
  Card,
  CardContent
} from '@mui/material';
import { servicesData } from '../data.jsx';

// Services Section
export const Services = () => (
  <Box sx={{ py: 8, bgcolor: '#000000' }}>
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6,width:'100%' }}>
        <Box>
          <Typography variant="overline" sx={{ 
            color: '#ff0000', 
            fontWeight: 'bold',
            fontSize: '1rem',
            mb: 1,
            display: 'block'
          }}>
            OUR SERVICES
          </Typography>
          <Typography variant="h3" sx={{ 
            fontWeight: 'bold', 
            color: 'white',
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}>
            THE SERVICES WE PROVIDE
          </Typography>
        </Box>
        <Button 
          variant="text" 
          sx={{ 
            color: '#ff0000',
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 'bold',
            '&:hover': { color: '#cc0000' }
          }}
        >
          VIEW OUR SERVICES
        </Button>
      </Box>
      
      <Box>
        {/* Hàng 1: 3 services đầu tiên */}
        <Grid container spacing={3} sx={{ mb: 4,justifyContent: 'space-between'}}>
          {servicesData.slice(0, 3).map((service) => (
            <Grid item xs={12} sm={6} md={6} key={service.id}>
              <Card sx={{ 
                width: '360px',
                height: '100%', 
                bgcolor: '#111', 
                border: '1px solid #333',
                '&:hover': { 
                  borderColor: '#ff0000',
                  transform: 'translateY(-5px)',
                  transition: 'all 0.3s ease'
                }
              }}>
                <CardContent sx={{ p: 2, textAlign: 'center', height: '1%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                   <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                     <Typography variant="h1" sx={{ 
                       fontSize: '2.5rem', 
                       mb: 1,
                       display: 'block'
                     }}>
                       <img width="50" height="50" src={service.icon} alt="service-icon"/>
                     </Typography>
                     <Typography variant="h6" sx={{ 
                       fontWeight: 'bold', 
                       mb: 1,
                       color: 'white',
                       fontSize: '0.9rem',
                       minHeight: '2.5rem',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       textAlign: 'center'
                     }}>
                       {service.title}
                     </Typography>
                     <Typography variant="body2" sx={{ 
                       color: '#ccc',
                       lineHeight: 1.3,
                       fontSize: '0.75rem',
                       minHeight: '3.9rem',
                       textAlign: 'center'
                     }}>
                       {service.description}
                     </Typography>
                   </Box>
                  <Button 
                    variant="text" 
                    sx={{ 
                      color: '#ff0000',
                      textTransform: 'none',
                      fontWeight: 'bold',
                      '&:hover': { color: '#cc0000' }
                    }}
                  >
                    READ MORE
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Hàng 2: 3 services còn lại */}
        <Grid container spacing={4}>
          {servicesData.slice(3, 6).map((service) => (
            <Grid item xs={12} sm={4} md={4} key={service.id}>
              <Card sx={{ 
                width: '360px',
                height: '100%', 
                bgcolor: '#111', 
                border: '1px solid #333',
                '&:hover': { 
                  borderColor: '#ff0000',
                  transform: 'translateY(-5px)',
                  transition: 'all 0.3s ease'
                }
              }}>
                <CardContent sx={{ p: 2, textAlign: 'center', height: '1%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                   <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                     <Typography variant="h1" sx={{ 
                       fontSize: '2.5rem', 
                       mb: 1,
                       display: 'block'
                     }}>
                       <img width="50" height="50" src={service.icon} alt="service-icon"/>
                     </Typography>
                     <Typography variant="h6" sx={{ 
                       fontWeight: 'bold', 
                       mb: 1,
                       color: 'white',
                       fontSize: '0.9rem',
                       minHeight: '2.5rem',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       textAlign: 'center'
                     }}>
                       {service.title}
                     </Typography>
                     <Typography variant="body2" sx={{ 
                       color: '#ccc',
                       lineHeight: 1.3,
                       fontSize: '0.75rem',
                       minHeight: '3.9rem',
                       textAlign: 'center'
                     }}>
                       {service.description}
                     </Typography>
                   </Box>
                  <Button 
                    variant="text" 
                    sx={{ 
                      color: '#ff0000',
                      textTransform: 'none',
                      fontWeight: 'bold',
                      '&:hover': { color: '#cc0000' }
                    }}
                  >
                    READ MORE
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  </Box>
);
