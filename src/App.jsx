import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RentalProvider } from './context/RentalContext';
import Home from './components/Home.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import PaymentPage from './pages/PaymentPage.jsx';
import RentalDetailPage from './pages/RentalDetailPage.jsx';

const theme = createTheme({
  palette: { 
    primary: { main: '#ff0000' }, // Red accent
    secondary: { main: '#333333' }, // Dark gray
    background: { 
      default: '#000000',
      paper: '#111111'
    },
    text: {
      primary: '#ffffff',
      secondary: '#cccccc'
    }
  },
  typography: {
    fontFamily: '"Consolas", "Monaco", "monospace"',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <RentalProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/payment/:rentalId" element={<PaymentPage />} />
            <Route path="/rental/:id" element={<RentalDetailPage />} />
          </Routes>
        </Router>
      </RentalProvider>
    </ThemeProvider>
  );
}

export default App;