import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../../context/userContext'; // Assuming you have a context for user info
import './Navbar.css';

export default function Navbar() {
  const { user } = useContext(UserContext);  // Get user information from context
  const location = useLocation();  // Get the current location (pathname)
  const currentPath = location.pathname;

  // Check if the user is logged in
  const isLoggedIn = !!user;  // This assumes `user` is null or undefined when not logged in

  // Determine if the current path is the Home page
  const isHomePage = currentPath === '/';

  // Determine if the current path is the Login or Register page
  const isLoginOrRegisterPage = currentPath === '/login' || currentPath === '/register';

  // Determine if we are on any other page (not Home, Login, or Register)
  const isOtherPage = !(isHomePage || isLoginOrRegisterPage);

  return (
    <div className="navbar">
      <nav className="navbar-container">
        {/* Show Home, Login, and Register buttons only on the Home page */}
        {isHomePage && (
          <>
          <div className="navbar-left">
            <Link to='/'>Home</Link>
          </div>
          
          </>
        )}

        <div className="navbar-right">
          {/* On Home page, show Home, Login, and Register buttons if not logged in */}
          {isHomePage &&(
            <>
              <div className="login-navbar-right">
                <Link to='/login'>Login</Link>
              </div>
              <div className="register-navbar-right">
                <Link to='/register'>Register</Link>
              </div>
            </>
          )}

          {/* On Login or Register page, show only the Home button */}
          {isLoginOrRegisterPage && (
            <div className="navbar-left">
              <Link to='/'>Home</Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
