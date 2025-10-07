import { createContext, useReducer, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    case "LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    loading: true, // Add loading state
  });

  useEffect(() => {
    const checkAuthStatus = async () => {
      dispatch({ type: "LOADING", payload: true });
      
      try {
        // First check localStorage for regular login
        const localUser = JSON.parse(localStorage.getItem('user'));
        
        if (localUser) {
          dispatch({ type: 'LOGIN', payload: localUser });
          dispatch({ type: "LOADING", payload: false });
          return;
        }

        // Then check OAuth session
        const response = await axios.get('http://localhost:6005/auth/user', {
          withCredentials: true
        });
        
        if (response.data.user) {
          dispatch({ type: 'LOGIN', payload: response.data.user });
        }
      } catch (error) {
        // No authentication found
        console.log('No active session found');
      } finally {
        dispatch({ type: "LOADING", payload: false });
      }
    };

    checkAuthStatus();
  }, []);

  // Add logout function for OAuth
  const logout = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem('user');
      
      // Logout from OAuth session
      await axios.get('http://localhost:6005/auth/logout', {
        withCredentials: true
      });
      
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if server logout fails
      dispatch({ type: 'LOGOUT' });
    }
  };

  console.log("AuthContext state: ", state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
