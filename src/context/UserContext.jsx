import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import api from '../utils/axios.js';
import { getUserId } from '../api.jsx';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async (explicitUserId) => {
    const id = explicitUserId ?? getUserId();
    if (!id) {
      setUser(null);
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/users/${id}`);
      setUser(res.data);
      return res.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Auto-load on mount if there is a userId
    fetchUser().catch(() => {});
  }, [fetchUser]);

  const value = {
    user,
    loading,
    error,
    refreshUser: fetchUser,
    cccdImageUrl: user?.cccdImageUrl || null
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserInfo() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUserInfo must be used within a UserProvider');
  return ctx;
}

export default UserContext;


