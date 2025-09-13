import React, { createContext, useContext, useReducer } from 'react';

const RentalContext = createContext();

const initialState = {
  selectedVehicle: null,
  selectedPackage: null,
  rentalPackages: [],
  currentRental: null,
  loading: false,
  error: null
};

function rentalReducer(state, action) {
  switch (action.type) {
    case 'SET_SELECTED_VEHICLE':
      return {
        ...state,
        selectedVehicle: action.payload,
        error: null
      };
    
    case 'SET_SELECTED_PACKAGE':
      return {
        ...state,
        selectedPackage: action.payload,
        error: null
      };
    
    case 'SET_RENTAL_PACKAGES':
      return {
        ...state,
        rentalPackages: action.payload,
        error: null
      };
    
    case 'SET_CURRENT_RENTAL':
      return {
        ...state,
        currentRental: action.payload,
        error: null
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case 'CLEAR_RENTAL_DATA':
      return {
        ...state,
        selectedVehicle: null,
        selectedPackage: null,
        currentRental: null,
        error: null
      };
    
    case 'RESET_STATE':
      return initialState;
    
    default:
      return state;
  }
}

export function RentalProvider({ children }) {
  const [state, dispatch] = useReducer(rentalReducer, initialState);

  const actions = {
    setSelectedVehicle: (vehicle) => {
      dispatch({ type: 'SET_SELECTED_VEHICLE', payload: vehicle });
    },
    
    setSelectedPackage: (packageData) => {
      dispatch({ type: 'SET_SELECTED_PACKAGE', payload: packageData });
    },
    
    setRentalPackages: (packages) => {
      dispatch({ type: 'SET_RENTAL_PACKAGES', payload: packages });
    },
    
    setCurrentRental: (rental) => {
      dispatch({ type: 'SET_CURRENT_RENTAL', payload: rental });
    },
    
    setLoading: (loading) => {
      dispatch({ type: 'SET_LOADING', payload: loading });
    },
    
    setError: (error) => {
      dispatch({ type: 'SET_ERROR', payload: error });
    },
    
    clearRentalData: () => {
      dispatch({ type: 'CLEAR_RENTAL_DATA' });
    },
    
    resetState: () => {
      dispatch({ type: 'RESET_STATE' });
    }
  };

  return (
    <RentalContext.Provider value={{ ...state, ...actions }}>
      {children}
    </RentalContext.Provider>
  );
}

export function useRental() {
  const context = useContext(RentalContext);
  if (!context) {
    throw new Error('useRental must be used within a RentalProvider');
  }
  return context;
}

export default RentalContext;
