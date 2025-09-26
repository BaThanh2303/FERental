// API Base URL - Change this to your actual API endpoint
// Use relative path when using Vite proxy, or full URL for direct connection
const API_BASE_URL = '/api'; // This will be proxied to http://localhost:8080/api

// Helper function to get stored token
const getAuthToken = () => {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
};

// Helper function to set stored token
const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
  // Also set in sessionStorage for session persistence
  sessionStorage.setItem('authToken', token);
};

// Helper function to remove stored token
const removeAuthToken = () => {
  localStorage.removeItem('authToken');
  sessionStorage.removeItem('authToken');
};

// Helper function to create headers with auth token
const createHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    console.log('Auth token:', token ? 'Present' : 'Missing');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Helper function to handle API response
const handleResponse = async (response) => {
  console.log('API Response status:', response.status);
  console.log('API Response headers:', response.headers);

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    
    // Clone response first to avoid "body already read" error
    const responseClone = response.clone();
    
    try {
      // Check if response has content
      const contentLength = response.headers.get('content-length');
      const contentType = response.headers.get('content-type');
      
      console.log('Error response headers:', {
        status: response.status,
        statusText: response.statusText,
        contentType: contentType,
        contentLength: contentLength
      });
      
      // Only try to parse if we have content
      if (contentLength && parseInt(contentLength) > 0) {
        if (contentType && contentType.includes('application/json')) {
          // Try to read as JSON first
          const errorData = await response.json();
          console.error('API Error response:', errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } else {
          // Try to read as text
          const errorText = await responseClone.text();
          console.error('Error response text:', errorText);
          if (errorText && errorText.trim()) {
            errorMessage = `${errorMessage} - ${errorText}`;
          }
        }
      } else {
        console.log('Empty response body');
      }
    } catch (parseError) {
      console.error('Failed to parse error response:', parseError);
      
      try {
        // Last resort: try to read as text from cloned response
        const errorText = await responseClone.text();
        console.error('Error response text (fallback):', errorText);
        if (errorText && errorText.trim()) {
          errorMessage = `${errorMessage} - ${errorText}`;
        }
      } catch (textError) {
        console.error('Failed to read error response as text:', textError);
      }
    }
    
    throw new Error(errorMessage);
  }

  try {
    const data = await response.json();
    console.log('API Success response:', data);
    return data;
  } catch (parseError) {
    console.error('Failed to parse success response:', parseError);
    // Clone response to read text
    const clonedResponse = response.clone();
    const responseText = await clonedResponse.text();
    console.error('Response text:', responseText);
    
    // If response is empty or just whitespace, return empty object
    if (!responseText || responseText.trim() === '') {
      console.log('Empty response, returning empty object');
      return {};
    }
    
    throw new Error(`Invalid JSON response: ${parseError.message}`);
  }
};

// Helper function to create fetch with timeout
const fetchWithTimeout = async (url, options, timeout = 10000) => {
  console.log('API Request:', { url, options, timeout });
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      mode: 'cors',
      credentials: 'omit',
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - Server không phản hồi');
    }
    throw error;
  }
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.email - User email
 * @param {string} userData.passwordHash - Hashed password
 * @param {string} userData.name - User full name
 * @param {string} userData.role - User role (e.g., 'customer', 'admin')
 * @returns {Promise<Object>} Saved user data
 */
export const registerUser = async (userData) => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: createHeaders(false), // No auth required for registration
      body: JSON.stringify(userData),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Registration failed:', error);
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc liên hệ admin.');
    }
    throw new Error(`Registration failed: ${error.message}`);
  }
};

/**
 * Login user and store authentication token
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password (plain text)
 * @returns {Promise<Object>} User data with token
 */
export const loginUser = async (credentials) => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: createHeaders(false), // No auth required for login
      body: JSON.stringify(credentials),
    });

    const data = await handleResponse(response);
    
    // Store the token and user ID
    if (data.token) {
      setAuthToken(data.token);
    }
    
    if (data.userId) {
      setUserId(data.userId);
    }
    
    return data;
  } catch (error) {
    console.error('Login failed:', error);
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc liên hệ admin.');
    }
    throw new Error(`Login failed: ${error.message}`);
  }
};

/**
 * Logout user and remove stored token and user ID
 */
export const logoutUser = () => {
  removeAuthToken();
  removeUserId();
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has valid token
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

/**
 * Get user ID from localStorage
 * @returns {number|null} User ID or null if not found
 */
const getUserId = () => {
  const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
  return userId ? parseInt(userId) : null;
};

/**
 * Set user ID in localStorage and sessionStorage
 * @param {number} userId - User ID to store
 */
const setUserId = (userId) => {
  localStorage.setItem('userId', userId.toString());
  sessionStorage.setItem('userId', userId.toString());
};

/**
 * Remove user ID from localStorage and sessionStorage
 */
const removeUserId = () => {
  localStorage.removeItem('userId');
  sessionStorage.removeItem('userId');
};

/**
 * Get all stations
 * @returns {Promise<Array>} List of all stations with new format
 */
export const getAllStations = async () => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/stations`, {
      method: 'GET',
      headers: createHeaders(true), // Auth required
    });

    const stationsData = await handleResponse(response);
    
    // Transform API data to match our component expectations
    // API returns: { stationId, name, location, latitude, longitude }
    // Component expects: { id, name, address, lat, lng, availableBikes }
    return stationsData.map(station => ({
      id: station.stationId,
      name: station.name,
      address: station.location,
      lat: station.latitude,
      lng: station.longitude,
      availableBikes: Math.floor(Math.random() * 20) + 5 // Mock data for now
    }));
  } catch (error) {
    console.error('Failed to fetch stations:', error);
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc liên hệ admin.');
    }
    throw new Error(`Failed to fetch stations: ${error.message}`);
  }
};



/**
 * Refresh authentication token (if your API supports it)
 * @returns {Promise<Object>} New token data
 */
export const refreshToken = async () => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: createHeaders(true),
    });

    const data = await handleResponse(response);
    
    if (data.token) {
      setAuthToken(data.token);
    }
    
    return data;
  } catch (error) {
    console.error('Token refresh failed:', error);
    // Remove invalid token
    removeAuthToken();
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc liên hệ admin.');
    }
    throw new Error(`Token refresh failed: ${error.message}`);
  }
};

/**
 * Get current user profile by userId
 * @param {number} userId - User ID from login response
 * @returns {Promise<Object>} Current user data
 */
export const getCurrentUser = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const response = await fetchWithTimeout(`${API_BASE_URL}/users/profile/${userId}`, {
      method: 'GET',
      headers: createHeaders(true),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc liên hệ admin.');
    }
    throw new Error(`Failed to fetch user profile: ${error.message}`);
  }
};

/**
 * Get all vehicles
 * @returns {Promise<Array>} List of all vehicles
 */
export const getAllVehicles = async () => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/vehicles`, {
      method: 'GET',
      headers: createHeaders(true),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Failed to get all vehicles:', error);
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc liên hệ admin.');
    }
    throw new Error(`Failed to get all vehicles: ${error.message}`);
  }
};

/**
 * Get vehicle details by ID
 * @param {number} vehicleId - Vehicle ID
 * @returns {Promise<Object>} Vehicle details
 */
export const getVehicleDetails = async (vehicleId) => {
  try {
    console.log('Fetching vehicle details for ID:', vehicleId);
    const response = await fetchWithTimeout(`${API_BASE_URL}/vehicles/${vehicleId}`, {
      method: 'GET',
      headers: createHeaders(true),
    });

    const result = await handleResponse(response);
    console.log('Vehicle details received:', result);
    return result;
  } catch (error) {
    console.error('Failed to get vehicle details:', error);
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc liên hệ admin.');
    }
    throw new Error(`Failed to get vehicle details: ${error.message}`);
  }
};

/**
 * Create payment record
 * @param {Object} paymentData - Payment data
 * @param {number} paymentData.rentalId - Rental ID
 * @param {number} paymentData.amount - Payment amount
 * @param {string} paymentData.currency - Currency
 * @param {string} paymentData.paymentMethod - Payment method
 * @param {string} paymentData.status - Payment status
 * @returns {Promise<Object>} Payment response
 */
export const createPayment = async (paymentData) => {
  try {
    console.log('Creating payment:', paymentData);
    const response = await fetchWithTimeout(`${API_BASE_URL}/payments`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(paymentData),
    });

    const result = await handleResponse(response);
    console.log('Payment created:', result);
    return result;
  } catch (error) {
    console.error('Failed to create payment:', error);
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc liên hệ admin.');
    }
    throw new Error(`Failed to create payment: ${error.message}`);
  }
};

/**
 * Get stations with vehicle counts (new API)
 * @returns {Promise<Array>} List of stations with totalVehicles
 */
export const getVehiclesInStation = async (stationId) => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/vehicles/station/${stationId}`, {
      method: 'GET',
      headers: createHeaders(true),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Failed to get vehicles in station:', error);
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc liên hệ admin.');
    }
    throw new Error(`Failed to get vehicles in station: ${error.message}`);
  }
};

/**
 * Get all rental packages
 * @returns {Promise<Array>} List of rental packages
 */
export const getRentalPackages = async () => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/packages`, {
      method: 'GET',
      headers: createHeaders(true),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Failed to fetch rental packages:', error);
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc liên hệ admin.');
    }
    throw new Error(`Failed to fetch rental packages: ${error.message}`);
  }
};

/**
 * Create a rental preorder
 * @param {Object} rentalData - Rental preorder data
 * @param {number} rentalData.userId - User ID
 * @param {number} rentalData.vehicleId - Vehicle ID
 * @param {number} rentalData.packageId - Package ID
 * @returns {Promise<Object>} Rental preorder response
 */
export const createRentalPreorder = async (rentalData) => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/rentals/preorder/day`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(rentalData),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Failed to create rental preorder:', error);
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc liên hệ admin.');
    }
    throw new Error(`Failed to create rental preorder: ${error.message}`);
  }
};

/**
 * Confirm rental payment
 * @param {number} rentalId - Rental ID
 * @returns {Promise<Object>} Confirmed rental response
 */
export const confirmRentalPayment = async (rentalId) => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/rentals/confirm/day?rentalId=${rentalId}`, {
      method: 'POST',
      headers: createHeaders(true),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Failed to confirm rental payment:', error);
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc liên hệ admin.');
    }
    throw new Error(`Failed to confirm rental payment: ${error.message}`);
  }
};

/**
 * Get rental details by ID
 * @param {number} rentalId - Rental ID
 * @returns {Promise<Object>} Rental details
 */
export const getRentalDetails = async (rentalId) => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/rentals/${rentalId}`, {
      method: 'GET',
      headers: createHeaders(true),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Failed to fetch rental details:', error);
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc liên hệ admin.');
    }
    throw new Error(`Failed to fetch rental details: ${error.message}`);
  }
};

/**
 * Get payment details by payment ID
 * @param {number} paymentId - Payment ID (same as rental ID in this case)
 * @returns {Promise<Object|null>} Payment details or null if not found
 */
export const getRentalPayment = async (rentalId) => {
  try {
    console.log('Fetching payment details for rental:', rentalId);
    const response = await fetchWithTimeout(`${API_BASE_URL}/payments/${rentalId}`, {
      method: 'GET',
      headers: createHeaders(true),
    });

    const result = await handleResponse(response);
    console.log('Payment details received:', result);
    return result;
  } catch (error) {
    console.log('Payment details not found for rental:', rentalId, error.message);
    // Return null instead of throwing error - payment details are optional
    return null;
  }
};

/**
 * Pickup vehicle using QR code
 * @param {number} rentalId - Rental ID
 * @param {number} vehicleId - Vehicle ID
 * @param {Object} pickupData - Pickup data with QR code
 * @returns {Promise<Object>} Pickup confirmation response
 */
export const pickupVehicle = async (rentalId, vehicleId, pickupData) => {
  try {
    console.log('Pickup API call:', { rentalId, vehicleId, pickupData });
    console.log('API URL:', `${API_BASE_URL}/rentals/${rentalId}/pickup-vehicle`);
    
    const response = await fetchWithTimeout(`${API_BASE_URL}/rentals/${rentalId}/pickup-vehicle`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(pickupData),
    });

    console.log('Pickup response status:', response.status);
    console.log('Pickup response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Pickup error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    return await handleResponse(response);
  } catch (error) {
    console.error('Failed to pickup vehicle:', error);
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc liên hệ admin.');
    }
    throw error; // Re-throw the original error to preserve details
  }
};

/**
 * Return vehicle using QR code
 * @param {number} rentalId - Rental ID
 * @param {Object} returnData - Return data with QR code
 * @returns {Promise<Object>} Return confirmation response
 */
export const returnVehicle = async (rentalId, returnData) => {
  try {
    console.log('Return API call:', { rentalId, returnData });
    const response = await fetchWithTimeout(`${API_BASE_URL}/rentals/${rentalId}/return-vehicle`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(returnData),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Failed to return vehicle:', error);
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc liên hệ admin.');
    }
    throw new Error(`Failed to return vehicle: ${error.message}`);
  }
};

/**
 * Get QR code for rental
 * @param {number} rentalId - Rental ID
 * @returns {Promise<Object>} QR code data
 */
export const getRentalQRCode = async (rentalId) => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/rentals/${rentalId}/qr-code`, {
      method: 'GET',
      headers: createHeaders(true),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Failed to get QR code:', error);
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc liên hệ admin.');
    }
    throw new Error(`Failed to get QR code: ${error.message}`);
  }
};

/**
 * Get rentals by user ID
 * @param {number} userId - User ID
 * @returns {Promise<Array>} List of rentals
 */
export const getUserRentals = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    const response = await fetchWithTimeout(`${API_BASE_URL}/rentals/user/${userId}`, {
      method: 'GET',
      headers: createHeaders(true),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Failed to fetch user rentals:', error);
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc liên hệ admin.');
    }
    throw new Error(`Failed to fetch user rentals: ${error.message}`);
  }
};

/**
 * Return rental vehicle
 * @param {number} rentalId - Rental ID
 * @returns {Promise<Object>} Return response
 */
export const returnRentalVehicle = async (rentalId) => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/rentals/${rentalId}/return`, {
      method: 'PUT',
      headers: createHeaders(true),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Failed to return rental vehicle:', error);
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc liên hệ admin.');
    }
    throw new Error(`Failed to return rental vehicle: ${error.message}`);
  }
};

/**
 * Create VNPay payment
 * @param {Object} paymentData - Payment data
 * @param {number} paymentData.rentalId - Rental ID
 * @param {number} paymentData.amount - Payment amount
 * @param {string} paymentData.orderDescription - Order description
 * @param {string} paymentData.returnUrl - Return URL after payment
 * @param {string} paymentData.cancelUrl - Cancel URL
 * @returns {Promise<Object>} VNPay payment response
 */
export const createVNPayPayment = async (paymentData) => {
  try {
    console.log('Creating VNPay payment:', paymentData);
    console.log('API URL:', `${API_BASE_URL}/payments/vnpay/create`);
    console.log('Headers:', createHeaders(true));
    
    const response = await fetchWithTimeout(`${API_BASE_URL}/payments/vnpay/create`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(paymentData),
    });

    console.log('VNPay API Response status:', response.status);
    console.log('VNPay API Response headers:', response.headers);

    const result = await handleResponse(response);
    console.log('VNPay payment created:', result);
    return result;
  } catch (error) {
    console.error('Failed to create VNPay payment:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      paymentData: paymentData
    });
    
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc liên hệ admin.');
    }
    
    // Provide more specific error messages
    if (error.message.includes('500')) {
      throw new Error(`Lỗi server (500): ${error.message}. Vui lòng kiểm tra backend logs hoặc liên hệ admin.`);
    }
    
    throw new Error(`Failed to create VNPay payment: ${error.message}`);
  }
};

/**
 * Handle VNPay payment return
 * @param {Object} returnData - Return data from VNPay
 * @returns {Promise<Object>} Payment return result
 */
export const handleVNPayReturn = async (returnData) => {
  try {
    console.log('Handling VNPay return:', returnData);
    const response = await fetchWithTimeout(`${API_BASE_URL}/payments/vnpay/return-callback`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(returnData),
    });

    const result = await handleResponse(response);
    console.log('VNPay return handled:', result);
    return result;
  } catch (error) {
    console.error('Failed to handle VNPay return:', error);
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc liên hệ admin.');
    }
    throw new Error(`Failed to handle VNPay return: ${error.message}`);
  }
};

// Export utility functions for external use
export {
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  getUserId,
  setUserId,
  removeUserId,
  createHeaders,
  handleResponse
};
