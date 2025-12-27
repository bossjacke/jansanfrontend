import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import img from '../../assets/logo.png';
import './navbar.css'; // Import custom CSS

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [initial, setInitial] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Logic to derive user initial
    const userName = user?.name || user?.email;
    if (userName) {
      setInitial(userName.trim().charAt(0).toUpperCase());
    } else {
      // Fallback logic
      try {
        const rawUser = localStorage.getItem('user') || localStorage.getItem('profile');
        if (rawUser) {
          const u = JSON.parse(rawUser);
          const name = u?.name || u?.fullName || u?.username || u?.email;
          if (name) return setInitial(name.trim().charAt(0).toUpperCase());
        }
      } catch (e) {
        // ignore parse errors
      }
      const nameKey = localStorage.getItem('name') || localStorage.getItem('userName') || localStorage.getItem('username');
      if (nameKey) setInitial(String(nameKey).trim().charAt(0).toUpperCase());
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbarInner">
        <div className="navbarContent">

          {/* Logo Section */}
          <div className="navbarLogoSection">
            <Link to="/" className="navbarLogoLink">
              <div className="navbarLogoBox">
                <img src={img} alt="Logo" className="navbarLogoImg" />
              </div>
              <span className="navbarBrandName">Adams Fire</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="navbarLinksDesktop">
            <Link to="/" className="navbarLink">Home</Link>
            <Link to="/about" className="navbarLink">About</Link>
            <Link to="/products" className="navbarLink">Products</Link>
            <Link to="/contact" className="navbarLink">Contact</Link>
            <Link to="/cart" className="navbarLink navbarCartLink">
              <div className="navbarCartIconBox">
                <svg className="navbarCartIcon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Cart</span>
              </div>
            </Link>
            <Link to="/orders" className="navbarMobileLink">Orders</Link>

            {isAuthenticated && user?.role === 'admin' && (
              <Link to="/admin" className="navbarLink navbarAdminLink">Admin</Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="navbarActions">
            {isAuthenticated ? (
              <div className="navbarAuthUser">
                <div className="navbarUserInfo">
                  <div className="navbarUserInitial">
                    {initial || 'U'}
                  </div>
                  <span className="navbarUserName">
                    {user?.name || user?.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="navbarBtn navbarBtnLogout"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="navbarAuthGuest">
                <Link to="/login" className="navbarLink navbarLinkLogin">
                  Login
                </Link>
                <Link to="/register" className="navbarBtn navbarBtnRegister">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="navbarMobileToggle">
            <button className="navbarBtn navbarBtnMenu" onClick={toggleMobileMenu}>
              <svg className="navbarIcon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation (Conditional Display) */}
      <div className={`navbarMobileMenu ${isMobileMenuOpen ? 'navbarMobileMenu--open' : ''}`}>
        <div className="navbarMobileLinks">
          <Link to="/" className="navbarMobileLink" onClick={toggleMobileMenu}>Home</Link>
          <Link to="/about" className="navbarMobileLink" onClick={toggleMobileMenu}>About</Link>
          <Link to="/products" className="navbarMobileLink" onClick={toggleMobileMenu}>Products</Link>
          <Link to="/contact" className="navbarMobileLink" onClick={toggleMobileMenu}>Contact</Link>
          <Link to="/cart" className="navbarMobileLink" onClick={toggleMobileMenu}>Cart</Link>
          <Link to="/orders" className="navbarMobileLink" onClick={toggleMobileMenu}>Orders</Link>
          {isAuthenticated && user?.role === 'admin' && (
            <Link to="/admin" className="navbarMobileLink" onClick={toggleMobileMenu}>Admin</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;