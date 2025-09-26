import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RentalProvider } from './context/RentalContext';
import { UserProvider } from './context/UserContext.jsx';
import Home from './components/Home.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import PaymentPage from './pages/PaymentPage.jsx';
import PaymentSuccessPage from './pages/PaymentSuccessPage.jsx';
import PaymentErrorPage from './pages/PaymentErrorPage.jsx';
import PaymentCancelPage from './pages/PaymentCancelPage.jsx';
import RentalDetailPage from './pages/RentalDetailPage.jsx';
import RentalHistoryPage from './pages/RentalHistoryPage.jsx';
import UploadCCCDPage from './pages/UploadCCCDPage.jsx';
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import Stations from './pages/admin/Stations.jsx';
import Users from './pages/admin/Users.jsx';
import Vehicles from './pages/admin/Vehicles.jsx';
import Packages from './pages/admin/Packages.jsx';
import Rentals from './pages/admin/Rentals.jsx';
import Payments from './pages/admin/Payments.jsx';

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
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 500 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          fontWeight: 600
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <RentalProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/upload-cccd" element={<UploadCCCDPage />} />
              <Route path="/payment/:rentalId" element={<PaymentPage />} />
              <Route path="/payment/success" element={<PaymentSuccessPage />} />
              <Route path="/payment/error" element={<PaymentErrorPage />} />
              <Route path="/payment/cancel" element={<PaymentCancelPage />} />
              <Route path="/rental/:id" element={<RentalDetailPage />} />
              <Route path="/rental-history" element={<RentalHistoryPage />} />

            <Route element={<ProtectedAdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="stations" element={<Stations />} />
                <Route path="users" element={<Users />} />
                <Route path="vehicles" element={<Vehicles />} />
                <Route path="packages" element={<Packages />} />
                <Route path="rentals" element={<Rentals />} />
                <Route path="payments" element={<Payments />} />
              </Route>
            </Route>
            </Routes>
          </Router>
        </RentalProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;