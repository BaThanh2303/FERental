import { createContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = { stations: [], selectedStation: null, vehicles: [] };

function reducer(state, action) {
  switch (action.type) {
    case 'SET_STATIONS': return { ...state, stations: action.payload };
    case 'SELECT_STATION': return { ...state, selectedStation: action.payload };
    case 'SET_VEHICLES': return { ...state, vehicles: action.payload };
    default: return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <AppContext.Provider value={{ ...state, dispatch }}>{children}</AppContext.Provider>;
}

export default AppContext;