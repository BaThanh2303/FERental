import { 
  Typography, 
  Box, 
  Grid, 
  Container, 
  Button 
} from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import { companyInfo } from '../data.jsx';

// About Section
export const About = () => (
  <Box sx={{ py: 8, bgcolor: '#000000' }}>
    <Container maxWidth="lg">
      <Grid container spacing={6} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="overline" sx={{ 
            color: '#ff0000', 
            fontWeight: 'bold',
            fontSize: '1rem',
            mb: 2,
            display: 'block'
          }}>
            WELCOME TO AUTOBIKE
          </Typography>
          <Typography variant="h3" sx={{ 
            fontWeight: 'bold', 
            mb: 4, 
            color: 'white',
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}>
            HELPS YOU TO FIND YOUR NEXT MOTORBIKE EASILY
          </Typography>
          <Typography variant="body1" sx={{ 
            mb: 4, 
            color: '#ccc', 
            lineHeight: 1.8,
            fontSize: '1.1rem'
          }}>
            {companyInfo.description}
          </Typography>
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
            WORK ABOUT US
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative'
          }}>
            <Box sx={{
              width: 300,
              height: 300,
              borderRadius: '50%',
              bgcolor: '#111',
              border: '2px solid #333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <Box sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: '#ff0000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '2rem'
              }}>
                <PlayArrow sx={{ fontSize: '2.5rem' }} />
              </Box>
            </Box>
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              height: 400,
              borderRadius: '50%',
              border: '1px solid #333',
              opacity: 0.3
            }} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  </Box>
);
