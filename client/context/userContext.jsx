// client/context/userContext.jsx
import axios from 'axios';
import { createContext, useState, useEffect } from 'react';

// Create a context with default value as an empty object
export const UserContext = createContext({});

// UserContextProvider component
export default function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  

  // Fetch user profile if user is not set
  useEffect(() => {
    if (!user) {
      axios.get('/auth/profile')
        .then(({ data }) => {
          if (data.error) {
            // Handle error in the response data
            console.error('Profile fetch error:', data.error);
          } else {
            // Successfully retrieved profile data
            setUser(data);
          }
        })
        .catch(error => {
          if (error.response && error.response.status === 401) {
            // Handle unauthorized error (e.g., user is not logged in)
            console.error('Unauthorized: Please log in.', error.response.data);
          } else if (error.response && error.response.data) {
            // Handle other server errors
            console.error('Error fetching user profile:', error.response.data);
          } else {
            // Handle network or other errors
            console.error('Error fetching user profile:', error.message);
          }
        });
    }
  }, [user]);
  
  

  const logout = async () => {
    try {
      // Example API call to log out
      await axios.post('/auth/logout'); 
      setUser(null); // Clear user state
    } catch (error) {
      console.error('Logout failed:', error.response?.data || error.message);
      throw error; // Re-throw error to be caught in handleLogout
    }
  };

  // Provide context to children
  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}
