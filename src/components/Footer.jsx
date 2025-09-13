import { 
  Typography, 
  Box, 
  Grid, 
  Container, 
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  Button
} from '@mui/material';
import { 
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  ArrowUpward
} from '@mui/icons-material';
import { companyInfo, footerLinks } from '../data.jsx';
import logo from '../assets/images/logo.svg';
// Footer Section
export const Footer = () => (
  <Box sx={{ bgcolor: '#000000', color: '#fff', py: 8 }}>
    <Container maxWidth="lg">
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={{ 
            color: '#ff0000', 
            fontWeight: 'bold', 
            mb: 3,
            fontSize: '1.2rem'
          }}>
            DO YOU HAVE QUESTIONS? LET'S TALK US!
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: '#ccc', lineHeight: 1.8 }}>
            {companyInfo.address}
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: '#ccc' }}>
            {companyInfo.phone}
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: '#ccc' }}>
            {companyInfo.email}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: 'white' }}>
            ABOUT US
          </Typography>
          <List dense>
            {footerLinks.about.map((link, index) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <ListItemText 
                  primary={link} 
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      fontSize: '0.9rem', 
                      color: '#ccc',
                      cursor: 'pointer',
                      '&:hover': { color: '#ff0000' }
                    } 
                  }} 
                />
              </ListItem>
            ))}
          </List>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: 'white' }}>
            QUICK LINKS
          </Typography>
          <List dense>
            {footerLinks.quickLinks.map((link, index) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <ListItemText 
                  primary={link} 
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      fontSize: '0.9rem', 
                      color: '#ccc',
                      cursor: 'pointer',
                      '&:hover': { color: '#ff0000' }
                    } 
                  }} 
                />
              </ListItem>
            ))}
          </List>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: 'white' }}>
            SUBSCRIBE FOR UPDATED
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: '#ccc' }}>
            Stay updated with our latest offers and news
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField 
              placeholder="Your email address"
              variant="outlined"
              size="small"
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: '#333' },
                  '&:hover fieldset': { borderColor: '#666' },
                  '&.Mui-focused fieldset': { borderColor: '#ff0000' }
                },
                '& .MuiInputBase-input::placeholder': {
                  color: '#666',
                  opacity: 1
                }
              }}
            />
            <Button 
              variant="contained"
              sx={{ 
                bgcolor: '#ff0000',
                color: 'white',
                px: 3,
                fontWeight: 'bold',
                textTransform: 'none',
                '&:hover': { bgcolor: '#cc0000' }
              }}
            >
              SUBSCRIBE
            </Button>
          </Box>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 4, bgcolor: '#333' }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ color: '#ccc' }}>
          Copyright © 2025 AutoBike. Design by templatars
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box 
            component="img"
            src={logo}
            alt="AutoBike Logo"
            sx={{ 
              height: 40,
              width: 'auto',
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8
              }
            }}
            />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
              AutoBike
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton sx={{ color: '#ccc' }}><Facebook /></IconButton>
          <IconButton sx={{ color: '#ccc' }}><Twitter /></IconButton>
          <IconButton sx={{ color: '#ccc' }}><Instagram /></IconButton>
          <IconButton sx={{ color: '#ccc' }}><LinkedIn /></IconButton>
          <IconButton sx={{ color: '#ff0000' }}>
            <ArrowUpward />
          </IconButton>
        </Box>
      </Box>
    </Container>
  </Box>
);
